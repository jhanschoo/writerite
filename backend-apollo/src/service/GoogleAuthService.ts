import "../assertConfig";
import { OAuth2Client } from "google-auth-library";

import { AbstractAuthService, SigninOptions } from "./AbstractAuthService";
import { ApolloError } from "apollo-server-koa";
import { AuthResponseSS } from "../model/Authorization";
import { userToSS } from "../model/User";
import { handleError } from "../util";

// eslint-disable-next-line @typescript-eslint/naming-convention
const { GAPI_CLIENT_ID, GAPI_CLIENT_SECRET } = process.env;
if (!GAPI_CLIENT_ID) {
  throw new Error("GAPI_CLIENT_ID envvar not found!");
}
if (!GAPI_CLIENT_SECRET) {
  throw new Error("GAPI_CLIENT_SECRET envvar not found!");
}

const gapiClient = new OAuth2Client(GAPI_CLIENT_ID);

export class GoogleAuthService extends AbstractAuthService {

  public async signin({ prisma, email, name, token, identifier, persist }: SigninOptions): Promise<AuthResponseSS | null> {
    const googleId = await this.verify(token);
    if (!googleId || googleId !== identifier) {
      throw new ApolloError("writerite: failed google authentication");
    }
    const user = userToSS(await prisma.user.findOne({ where: { email } }));
    if (user !== null) {
      if (googleId !== user.googleId) {
        throw new ApolloError("writerite: user already exists");
      }
      return GoogleAuthService.authResponseFromUser({ user, persist });
    }
    const newUser = userToSS(await prisma.user.create({ data: {
      email,
      name,
      googleId,
      roles: { set: ["user"] },
    } }));
    return GoogleAuthService.authResponseFromUser({ user: newUser, persist });
  }

  protected async verify(idToken: string): Promise<string | null> {
    try {
      const ticket = await gapiClient.verifyIdToken({
        // TS limitation: coercion needed
        audience: GAPI_CLIENT_ID as string,
        idToken,
      });
      return ticket.getPayload()?.sub ?? null;
    } catch (e) {
      return handleError(e);
    }
  }
}
