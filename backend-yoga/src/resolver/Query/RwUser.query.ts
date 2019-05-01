import { IFieldResolver } from 'graphql-tools';

import { Roles, IRwContext } from '../../types';

import { IRwUser, pUserToRwUser } from '../RwUser';
import { wrAuthenticationError, throwIfDevel, wrNotFoundError, wrGuardPrismaNullError } from '../../util';

const rwUsers: IFieldResolver<any, IRwContext, {}> = async (
  _parent, _args, { prisma, sub },
): Promise<IRwUser[] | null> => {
  try {
    if (!sub) {
      throw wrAuthenticationError();
    }
    if (!sub.roles.includes(Roles.admin)) {
      throw wrNotFoundError('users');
    }
    const pUsers = await prisma.pUsers();
    wrGuardPrismaNullError(pUsers);
    return pUsers.map((pUser) => pUserToRwUser(pUser, prisma));
  } catch (e) {
    return throwIfDevel(e);
  }
};

const rwUser: IFieldResolver<any, IRwContext, { id: string }> = async (
  _parent, { id }, { prisma },
): Promise<IRwUser | null> => {
  try {
    const pUser = wrGuardPrismaNullError(await prisma.pUser({ id }));
    return pUserToRwUser(pUser, prisma);
  } catch (e) {
    return throwIfDevel(e);
  }
};

export const rwUserQuery = {
  rwUser, rwUsers,
};
