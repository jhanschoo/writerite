import { PUser, Prisma } from '../../generated/prisma-client';
import { generateJWT } from '../util';
import { pUserToRwUser } from '../resolver/RwUser';
import { IRwAuthResponse } from '../resolver/authorization';

export interface ISigninOptions {
  prisma: Prisma;
  email: string;
  token: string;
  identifier: string;
  persist?: boolean;
}

export abstract class AbstractAuthService {
  protected static async authResponseFromUser(
    pUser: PUser, { persist = false, prisma }: {
      persist?: boolean,
      prisma: Prisma,
    },
  ): Promise<IRwAuthResponse> {
    const user = pUserToRwUser(pUser, prisma);
    return {
      token: generateJWT({
        id: pUser.id,
        email: pUser.email,
        roles: pUser.roles,
      }, persist),
      user,
    };
  }

  public abstract async signin({
    prisma, email, token, identifier, persist,
  }: ISigninOptions): Promise<any>;
  protected abstract async verify(token: string): Promise<any>;
}
