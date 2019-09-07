import { IFieldResolver, IResolverObject } from 'apollo-server-koa';

import { IContext, IUpdatedUpdate, ICreatedUpdate, IDeletedUpdate } from '../../types';

import { rwAuthenticationError, rwNotFoundError } from '../../util';
import { ISUser, IRwUser } from '../../model/RwUser';

const rwUserEdit: IFieldResolver<any, IContext, {
  name: string,
}> = async (
  _parent,
  { name },
  { models, prisma, sub },
): Promise<IRwUser | null> => {
  if (!sub) {
    throw rwAuthenticationError();
  }
  const { id } = sub;
  return await models.RwUser.edit(prisma, {
    id, name,
  });
};

export const rwUserMutation: IResolverObject<any, IContext, any> = {
  rwUserEdit,
};
