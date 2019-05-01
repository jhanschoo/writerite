import '../assertConfig';
import fetch from 'node-fetch';
import FormData from 'form-data';

import { comparePassword, hashPassword, wrGuardPrismaNullError } from '../util';
import { AbstractAuthService, ISigninOptions } from './AbstractAuthService';
import { ApolloError } from 'apollo-server';

const { RECAPTCHA_SECRET } = process.env;

if (!RECAPTCHA_SECRET) {
  throw new Error('RECAPTCHA_SECRET envvar not found!');
}

export class LocalAuthService extends AbstractAuthService {

  public async signin({ prisma, email, token, identifier: password, persist }: ISigninOptions) {
    if (await prisma.$exists.pUser({ email })) {
      const knownUser = wrGuardPrismaNullError(await prisma.pUser({ email }));
      if (!knownUser.passwordHash || !await comparePassword(password, knownUser.passwordHash)) {
        throw new ApolloError('writerite: failed login');
      }
      return LocalAuthService.authResponseFromUser(knownUser, { persist, prisma });
    }
    const verified = await this.verify(token);
    if (!verified) {
      throw new ApolloError('writerite: failed recaptcha authentication');
    }
    // create
    const passwordHash = await hashPassword(password);
    const user = prisma.createPUser(
      { email, passwordHash, roles: { set: ['user'] } },
    );
    wrGuardPrismaNullError(user);
    return LocalAuthService.authResponseFromUser(await user, { persist, prisma });
  }

  protected async verify(token: string) {
    const form = new FormData();
    form.append('secret', RECAPTCHA_SECRET);
    form.append('response', token);

    return new Promise<string | undefined>((res, rej) => {
      fetch('https://www.google.com/recaptcha/api/siteverify', {
        method: 'post',
        body: form,
      }).then((response) => {
        // TODO: assert that hostname is correct
        return response.json().then((json) => json.success ? res('true' as string) : res(undefined));
      }).catch((e) => res(undefined));
    });
  }
}
