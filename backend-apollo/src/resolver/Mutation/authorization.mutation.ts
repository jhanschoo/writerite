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
  name?: string,
  token: string,
  authorizer: string,
  identifier: string,
  persist?: boolean,
}> = async (
  _parent,
  params,
  { models, prisma },
): Promise<IRwAuthResponse | null> => {
  const { name, authorizer, ...otherParams } = params;
  const normalizedName = (name && name !== '') ? name : undefined;
  const authParams = {
    ...otherParams,
    name: normalizedName,
    models,
    prisma,
  };
  switch (authorizer) {
    case AuthorizerType.LOCAL:
      return localAuth.signin(authParams);
      break;
    case AuthorizerType.GOOGLE:
      return googleAuth.signin(authParams);
      break;
    case AuthorizerType.FACEBOOK:
      return facebookAuth.signin(authParams);
      break;
    case AuthorizerType.DEVELOPMENT:
      return developmentAuth.signin(authParams);
      break;
    default:
      throw new UserInputError('Invalid AuthorizerType');
  }
};

export const authorizationMutation = {
  signin,
};
