import '../assertConfig';
import fetch from 'node-fetch';

import { AbstractAuthService, ISigninOptions } from './AbstractAuthService';
import { ApolloError } from 'apollo-server-koa';
import { rwGuardPrismaNullError } from '../util';

const { FACEBOOK_APP_ID, FACEBOOK_APP_SECRET } = process.env;
if (!FACEBOOK_APP_ID) {
  throw new Error('FACEBOOK_APP_ID envvar not found!');
}
if (!FACEBOOK_APP_SECRET) {
  throw new Error('FACEBOOK_APP_SECRET envvar not found!');
}
let FB_ACCESS_TOKEN = 'FB_ACCESS_TOKEN not set!';

const FB_ACCESS_TOKEN_QUERY = `https://graph.facebook.com/oauth/access_token?client_id=${
  FACEBOOK_APP_ID
  }&client_secret=${
  FACEBOOK_APP_SECRET
  }&grant_type=client_credentials`;

fetch(FB_ACCESS_TOKEN_QUERY).then((response) => {
  response.json().then((json) => {
    FB_ACCESS_TOKEN = json.access_token;
  });
});

export class FacebookAuthService extends AbstractAuthService {

  public async signin({ models, prisma, email, name, token, identifier, persist }: ISigninOptions) {
    const facebookId = await this.verify(token);
    if (!facebookId || facebookId !== identifier) {
      throw new ApolloError('failed Facebook authentication');
    }
    // TODO: refactor to use null reply from prisma
    if (await prisma.$exists.pUser({ email })) {
      if (!await prisma.$exists.pUser({ email, facebookId })) {
        throw new ApolloError('user already exists');
      }
      const pUser = rwGuardPrismaNullError(await prisma.pUser({ email }));
      return FacebookAuthService.authResponseFromUser(
        pUser, { models, persist, prisma },
      );
    } else {
      const pUser = rwGuardPrismaNullError(await prisma.createPUser(
        { email, name, facebookId, roles: { set: ['user'] } },
      ));
      return FacebookAuthService.authResponseFromUser(pUser, { models, persist, prisma });
    }
  }

  protected async verify(token: string) {
    const VERIFY_URL = `https://graph.facebook.com/debug_token?input_token=${
      token
      }&access_token=${FB_ACCESS_TOKEN}`;

    return new Promise<string | undefined>((res, rej) => {
      fetch(VERIFY_URL).then((response) => {
        return response.json().then((json) => {
          if (json.data && json.data.app_id === FACEBOOK_APP_ID && json.data.is_valid) {
            return res(json.data.user_id as string);
          } else {
            return res(undefined);
          }
        }).catch((e) => res(undefined));
      }).catch((e) => res(undefined));
    });
  }
}
