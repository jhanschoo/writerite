import '../assertConfig';
import fetch from 'node-fetch';
import FormData from 'form-data';

import { comparePassword, hashPassword, rwGuardPrismaNullError } from '../util';
import { AbstractAuthService, ISigninOptions } from './AbstractAuthService';
import { ApolloError } from 'apollo-server-koa';

const { RECAPTCHA_SECRET } = process.env;

if (!RECAPTCHA_SECRET) {
  throw new Error('RECAPTCHA_SECRET envvar not found!');
}

export class LocalAuthService extends AbstractAuthService {

  public async signin({ models, prisma, email, name, token, identifier: password, persist }: ISigninOptions) {
    // TODO: refactor to use null reply from prisma
    if (await prisma.$exists.pUser({ email })) {
      const knownUser = rwGuardPrismaNullError(await prisma.pUser({ email }));
      if (!knownUser.passwordHash || !await comparePassword(password, knownUser.passwordHash)) {
        throw new ApolloError('writerite: failed login');
      }
      return LocalAuthService.authResponseFromUser(knownUser, { models, persist, prisma });
    }
    const verified = await this.verify(token);
    if (!verified) {
      throw new ApolloError('writerite: failed recaptcha authentication');
    }
    // create
    const passwordHash = await hashPassword(password);
    const user = prisma.createPUser(
      { email, name, passwordHash, roles: { set: ['user'] } },
    );
    rwGuardPrismaNullError(user);
    return LocalAuthService.authResponseFromUser(await user, { models, persist, prisma });
  }

  protected async verify(token: string) {
    const form = new FormData();
    form.append('secret', RECAPTCHA_SECRET);
    form.append('response', token);

    return new Promise<string | undefined>((res, rej) => {
      fetch('https://www.google.com/recaptcha/api/siteverify', {
        method: 'post',
        body: form,
      }).then(async (response) => {
        // TODO: assert that hostname is correct
        const json = await response.json();
        return json.success ? res(('true' as string)) : res(undefined);
      }).catch((e) => res(undefined));
    });
  }
}
