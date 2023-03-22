import { UserPersonalQuery } from '@generated/graphql';

export interface ManagePersonalProps {
  user: UserPersonalQuery['user']; // TODO: decouple interface from GraphQL return shape definition
  path?: string[];
}
