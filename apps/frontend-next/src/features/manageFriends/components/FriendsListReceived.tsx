import { graphql } from '@generated/gql';
import { useQuery } from 'urql';

const FriendsListReceivedQuery = graphql(/* GraphQL */ `
  query FriendsListReceivedQuery {
    befrienders {
      edges {
        node {
          ...UserProfile
        }
      }
    }
  }
`);

export const FriendsListReceived = () => {
  const { data } = useQuery({ query: FriendsListReceivedQuery });
  return <p>{JSON.stringify(data)}</p>;
};
