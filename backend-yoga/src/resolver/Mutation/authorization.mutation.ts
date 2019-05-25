import { IFieldResolver, UserInputError } from 'apollo-server-koa';

import { AuthorizerType, IContext } from '../../types';

import { IRwAuthResponse } from '../authorization';

import { GoogleAuthService } from '../../service/GoogleAuthService';
import { FacebookAuthService } from '../../service/FacebookAuthService';
import { LocalAuthService } from '../../service/LocalAuthService';
import { DevelopmentAuthService } from '../../service/DevelopmentAuthService';

const googleAuth = new GoogleAuthService();
const facebookAuth = new FacebookAuthService();
const localAuth = new LocalAuthService();
const developmentAuth = new DevelopmentAuthService();

const signin: IFieldResolver<any, IContext, {
  email: string,
  token: string,
  authorizer: string,
  identifier: string,
  persist?: boolean,
}> = async (
  _parent,
  { email, token, authorizer, identifier, persist },
  { models, prisma },
): Promise<IRwAuthResponse | null> => {
  if (authorizer === AuthorizerType.LOCAL) {
    return localAuth.signin({
      models, prisma, email, token, identifier, persist,
    });
  }
  if (authorizer === AuthorizerType.GOOGLE) {
    return googleAuth.signin({
      models, prisma, email, token, identifier, persist,
    });
  }
  if (authorizer === AuthorizerType.FACEBOOK) {
    return facebookAuth.signin({
      models, prisma, email, token, identifier, persist,
    });
  }
  if (authorizer === AuthorizerType.DEVELOPMENT) {
    return developmentAuth.signin({
      models, prisma, email, token, identifier, persist,
    });
  }
  throw new UserInputError('Invalid AuthorizerType');
};

export const authorizationMutation = {
  signin,
};
