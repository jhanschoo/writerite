import { generateJWT } from "../util";
import { PrismaClient } from "@prisma/client";
import { UserSS } from "../model/User";
import { AuthResponseSS } from "../model/Authorization";

export interface SigninOptions {
  prisma: PrismaClient;
  email: string;
  name?: string;
  token: string;
  identifier: string;
  persist?: boolean;
}

export abstract class AbstractAuthService {
  protected static authResponseFromUser({
    user, persist = false,
  }: {
    user: UserSS | null;
    persist?: boolean;
  }): AuthResponseSS | null {
    if (user === null) {
      return null;
    }
    const { id, email, roles, name } = user;
    return {
      token: generateJWT({
        id,
        email,
        roles,
        name,
      }, persist),
    };
  }

  public abstract async signin(opts: SigninOptions): Promise<AuthResponseSS | null>;

  protected abstract async verify(token: string): Promise<string | null>;
}
