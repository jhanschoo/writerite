import { PUser, Prisma } from '../../generated/prisma-client';
import { generateJWT } from '../util';
import { IRwAuthResponse } from '../resolver/authorization';
import { IModels } from '../model';

export interface ISigninOptions {
  models: IModels;
  prisma: Prisma;
  email: string;
  token: string;
  identifier: string;
  persist?: boolean;
}

export abstract class AbstractAuthService {
  protected static async authResponseFromUser(
    pUser: PUser, { models, prisma, persist = false }: {
      models: IModels, prisma: Prisma, persist?: boolean,
    },
  ): Promise<IRwAuthResponse> {
    const user = models.RwUser.fromPUser(prisma, pUser);
    return {
      token: generateJWT({
        id: pUser.id,
        email: pUser.email,
        roles: pUser.roles,
      }, persist),
      user,
    };
  }

  public abstract async signin(options: ISigninOptions): Promise<any>;
  protected abstract async verify(token: string): Promise<any>;
}
