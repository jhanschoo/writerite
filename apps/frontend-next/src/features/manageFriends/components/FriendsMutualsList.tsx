import { graphql } from '@generated/gql';
import { Tabs, Title } from '@mantine/core';

const FriendsMutualsListQuery = graphql(/* GraphQL */ `
  query FriendsMutualsListQuery {
    friends {
      edges {
        cursor
        node {
          ...UserProfile
        }
      }
    }
  }
`);

export const FriendsMutualsList = () => {
  return <p>FriendsMutualsList</p>;
};
