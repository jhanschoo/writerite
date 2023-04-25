import { graphql } from '@generated/gql';

export const ManageDeckSubdecksFragment = graphql(/* GraphQL */ `
  fragment ManageDeckSubdecks on Deck {
    id
    subdecks {
      id
      ...SubdeckListItemContent
    }
    subdecksCount
  }
`);
