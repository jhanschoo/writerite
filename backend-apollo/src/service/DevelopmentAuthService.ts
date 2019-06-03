import { LocalAuthService } from './LocalAuthService';

export class DevelopmentAuthService extends LocalAuthService {

  protected async verify(_token: string) {
    if (process.env.NODE_ENV === 'development') {
      return Promise.resolve('true');
    }
    return Promise.resolve(undefined);
  }
}
