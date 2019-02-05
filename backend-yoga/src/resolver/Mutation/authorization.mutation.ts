import { IFieldResolver } from 'graphql-tools';

import { AuthorizerType, IRwContext } from '../../types';

import { IRwAuthResponse } from '../authorization';

import { GoogleAuthService } from '../../service/GoogleAuthService';
import { FacebookAuthService } from '../../service/FacebookAuthService';
import { LocalAuthService } from '../../service/LocalAuthService';
import { DevelopmentAuthService } from '../../service/DevelopmentAuthService';
import { throwIfDevel } from '../../util';

const googleAuth = new GoogleAuthService();
const facebookAuth = new FacebookAuthService();
const localAuth = new LocalAuthService();
const developmentAuth = new DevelopmentAuthService();

const signin: IFieldResolver<any, IRwContext, {
  email: string,
  token: string,
  authorizer: string,
  identifier: string,
  persist?: boolean,
}> = async (
  _parent,
  { email, token, authorizer, identifier, persist },
  { prisma },
): Promise<IRwAuthResponse | null> => {
  try {
    if (authorizer === AuthorizerType.LOCAL) {
      return localAuth.signin({
        prisma, email, token, identifier, persist,
      });
    }
    if (authorizer === AuthorizerType.GOOGLE) {
      return googleAuth.signin({
        prisma, email, token, identifier, persist,
      });
    }
    if (authorizer === AuthorizerType.FACEBOOK) {
      return facebookAuth.signin({
        prisma, email, token, identifier, persist,
      });
    }
    if (authorizer === AuthorizerType.DEVELOPMENT) {
      return developmentAuth.signin({
        prisma, email, token, identifier, persist,
      });
    }
  } catch (e) {
    return throwIfDevel(e);
  }
  return null;
};

export const authorizationMutation = {
  signin,
};
