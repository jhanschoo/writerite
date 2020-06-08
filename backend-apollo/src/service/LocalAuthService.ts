/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import "../assertConfig";
import fetch from "node-fetch";
import FormData from "form-data";

import { comparePassword, hashPassword } from "../util";
import { AbstractAuthService, SigninOptions } from "./AbstractAuthService";
import { ApolloError } from "apollo-server-koa";
import { AuthResponseSS } from "../model/Authorization";
import { userToSS } from "../model/User";

// eslint-disable-next-line @typescript-eslint/naming-convention
const { RECAPTCHA_SECRET } = process.env;

if (!RECAPTCHA_SECRET) {
  throw new Error("RECAPTCHA_SECRET envvar not found!");
}

export class LocalAuthService extends AbstractAuthService {

  public async signin({ prisma, email, name, token, identifier: password, persist }: SigninOptions): Promise<AuthResponseSS | null> {
    const user = userToSS(await prisma.user.findOne({ where: { email } }));
    if (user !== null) {
      if (!user.passwordHash || !await comparePassword(password, user.passwordHash)) {
        throw new ApolloError("writerite: failed login");
      }
      return LocalAuthService.authResponseFromUser({ user, persist });
    }
    const verified = await this.verify(token);
    if (!verified) {
      throw new ApolloError("writerite: failed recaptcha authentication");
    }
    // create
    const passwordHash = await hashPassword(password);
    const newUser = userToSS(await prisma.user.create({ data: {
      email,
      name,
      passwordHash,
      roles: { set: ["user"] },
    } }));
    return LocalAuthService.authResponseFromUser({ user: newUser, persist });
  }

  protected async verify(token: string): Promise<string | null> {
    const form = new FormData();
    form.append("secret", RECAPTCHA_SECRET);
    form.append("response", token);

    try {
      const response = await fetch("https://www.google.com/recaptcha/api/siteverify", {
        method: "post",
        body: form,
      });

      // TODO: assert that hostname is correct
      const json = await response.json();
      return json.success ? "success" : null;
    } catch (e) {
      return null;
    }
    return null;
  }
}
