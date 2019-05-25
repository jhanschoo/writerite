import '../assertConfig';
import { OAuth2Client } from 'google-auth-library';

import { AbstractAuthService, ISigninOptions } from './AbstractAuthService';
import { ApolloError } from 'apollo-server-koa';
import { rwGuardPrismaNullError } from '../util';

const { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET } = process.env;

if (!GOOGLE_CLIENT_ID) {
  throw new Error('GOOGLE_CLIENT_ID envvar not found!');
}
if (!GOOGLE_CLIENT_SECRET) {
  throw new Error('GOOGLE_CLIENT_SECRET envvar not found!');
}

const googleClient = new OAuth2Client(GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET);

export class GoogleAuthService extends AbstractAuthService {

  public async signin({ models, prisma, email, token, identifier, persist }: ISigninOptions) {
    const googleId = await this.verify(token);
    if (!googleId || googleId !== identifier) {
      throw new ApolloError('writerite: failed google authentication');
    }
    // TODO: refactor to use null reply from prisma
    if (await prisma.$exists.pUser({ email })) {
      if (!await prisma.$exists.pUser({ email, googleId })) {
        throw new ApolloError('writerite: user already exists');
      }
      const pUser = rwGuardPrismaNullError(await prisma.pUser({ email }));
      return GoogleAuthService.authResponseFromUser(
        pUser, { models, persist, prisma },
      );
    } else {
      const pUser = await prisma.createPUser(
        { email, googleId, roles: { set: ['user'] } },
      );
      rwGuardPrismaNullError(pUser);
      return GoogleAuthService.authResponseFromUser(pUser, { models, persist, prisma });
    }
  }

  protected async verify(idToken: string) {
    return new Promise<string | undefined>((res, rej) => {
      googleClient.verifyIdToken({
        // TODO: figure out why coercion is needed in this case
        audience: GOOGLE_CLIENT_ID as string,
        idToken,
      }).then((ticket) => {
        if (!ticket || ticket === null) {
          res(undefined);
          return;
        }
        const payload = ticket.getPayload();
        if (!payload) {
          res(undefined);
          return;
        }
        res(payload.sub);
      }).catch((e) => res(undefined));
    });
  }
}
