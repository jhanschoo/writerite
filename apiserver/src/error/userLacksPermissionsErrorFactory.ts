import { GraphQLError } from 'graphql';

export function userLacksPermissionsErrorFactory(message?: string): Error {
  return new GraphQLError(message ?? 'You are not allowed to perform this action', {
    extensions: { wrCode: 'USER_LACKS_PERMISSIONS' },
  });
}
