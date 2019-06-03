import { IFieldResolver, IResolverObject } from 'apollo-server-koa';

import { Roles, IContext } from '../../types';
import { IRwUser } from '../../model/RwUser';
import { rwAuthenticationError } from '../../util';

const rwUsers: IFieldResolver<any, IContext, any> = async (
  _parent, _args, { models, prisma, sub },
): Promise<IRwUser[] | null> => {
  if (!sub || !sub.roles.includes(Roles.admin)) {
    throw rwAuthenticationError();
  }
  return models.RwUser.getAll(prisma);
};

const rwUser: IFieldResolver<any, IContext, { id: string }> = async (
  _parent, { id }, { models, prisma },
): Promise<IRwUser | null> => {
  return models.RwUser.get(prisma, id);
};

export const rwUserQuery: IResolverObject<any, IContext, any> = {
  rwUser, rwUsers,
};
