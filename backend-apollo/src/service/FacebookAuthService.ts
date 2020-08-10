/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import "../assertConfig";
import fetch from "node-fetch";

import { AbstractAuthService, SigninOptions } from "./AbstractAuthService";
import { ApolloError } from "apollo-server-koa";
import { AuthResponseSS } from "../model/Authorization";
import { userToSS } from "../model/User";
import { handleError } from "../util";

// eslint-disable-next-line @typescript-eslint/naming-convention
const { FACEBOOK_APP_ID, FACEBOOK_APP_SECRET } = process.env;
if (!FACEBOOK_APP_ID) {
  throw new Error("FACEBOOK_APP_ID envvar not found!");
}
if (!FACEBOOK_APP_SECRET) {
  throw new Error("FACEBOOK_APP_SECRET envvar not found!");
}
let FB_ACCESS_TOKEN: string | null = null;

const FB_ACCESS_TOKEN_QUERY = `https://graph.facebook.com/oauth/access_token?client_id=${
  FACEBOOK_APP_ID
}&client_secret=${
  FACEBOOK_APP_SECRET
}&grant_type=client_credentials`;

// eslint-disable-next-line @typescript-eslint/no-floating-promises
(async (): Promise<void> => {
  const response = await fetch(FB_ACCESS_TOKEN_QUERY);
  const json = await response.json();
  FB_ACCESS_TOKEN = json.access_token;
})();

export class FacebookAuthService extends AbstractAuthService {

  public async signin({ prisma, email, name, token, identifier, persist }: SigninOptions): Promise<AuthResponseSS | null> {
    const facebookId = await this.verify(token);
    if (!facebookId || facebookId !== identifier) {
      throw new ApolloError("failed Facebook authentication");
    }
    const user = userToSS(await prisma.user.findOne({ where: { email } }));
    if (user !== null) {
      if (facebookId !== user.facebookId) {
        throw new ApolloError("user already exists");
      }
      return FacebookAuthService.authResponseFromUser({ user, persist });
    }
    const newUser = userToSS(await prisma.user.create({ data: {
      email,
      name,
      facebookId,
      roles: { set: ["user"] },
    } }));
    return FacebookAuthService.authResponseFromUser({ user: newUser, persist });
  }

  protected async verify(token: string): Promise<string | null> {
    const VERIFY_URL = `https://graph.facebook.com/debug_token?input_token=${
      token
    }&access_token=${FB_ACCESS_TOKEN as string}`;
    try {
      const response = await fetch(VERIFY_URL);
      const json = await response.json();
      if (json?.data?.app_id === FACEBOOK_APP_ID && json.data.is_valid && typeof json.data.user_id === "string") {
        return json.data.user_id;
      }
      return null;
    } catch (e) {
      return handleError(e);
    }
  }
}
