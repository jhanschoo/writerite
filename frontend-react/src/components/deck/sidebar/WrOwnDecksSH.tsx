import { PureComponent } from 'react';

import gql from 'graphql-tag';
import { SubscribeToMoreOptions } from 'apollo-client';
import { UpdateQueryFn } from 'apollo-client/core/watchQueryOptions';
import { printApolloError } from '../../../util';
import { WR_DECK } from '../../../client-models';
import { SidebarOwnDecksUpdates } from './gqlTypes/SidebarOwnDecksUpdates';
import { SidebarOwnDecks } from './gqlTypes/SidebarOwnDecks';

const OWN_DECKS_UPDATES_SUBSCRIPTION = gql`
${WR_DECK}
subscription SidebarOwnDecksUpdates {
  rwOwnDecksUpdates {
    ... on RwDeckCreated {
      created {
        ...WrDeck
      }
    }
    ... on RwDeckUpdated {
      updated {
        ...WrDeck
      }
    }
    ... on RwDeckDeleted {
      deletedId
    }
  }
}
`;

interface Props {
  subscribeToMore: (options: SubscribeToMoreOptions<
    SidebarOwnDecks, object, SidebarOwnDecksUpdates
  >) => () => void;
}

class WrOwnDecksSH extends PureComponent<Props> {
  public readonly componentDidMount = () => {
    const { subscribeToMore } = this.props;
    const updateQuery: UpdateQueryFn<SidebarOwnDecks, object, SidebarOwnDecksUpdates> = (
      prev, { subscriptionData },
    ) => {
      // note changes should be idempotent due to following issue
      // https://github.com/apollographql/react-apollo/issues/2656
      let decks = prev.rwOwnDecks ? [...prev.rwOwnDecks] : [];
      const { rwOwnDecksUpdates } = subscriptionData.data;
      if ('created' in rwOwnDecksUpdates && rwOwnDecksUpdates.created) {
        const { created } = rwOwnDecksUpdates;
        decks = [created].concat(decks.filter((deck) => {
          return deck.id !== created.id;
        }));
      }
      if ('updated' in rwOwnDecksUpdates && rwOwnDecksUpdates.updated) {
        const { updated } = rwOwnDecksUpdates;
        decks = decks.map((deck) => {
          if (deck.id !== updated.id) {
            return deck;
          }
          return updated;
        });
      }
      if ('deletedId' in rwOwnDecksUpdates && rwOwnDecksUpdates.deletedId) {
        decks = decks.filter((deck) => {
          return deck.id !== rwOwnDecksUpdates.deletedId;
        });
      }
      return Object.assign<object, SidebarOwnDecks, SidebarOwnDecks>(
        {}, prev, { rwOwnDecks: decks },
      );
    };
    subscribeToMore({
      document: OWN_DECKS_UPDATES_SUBSCRIPTION,
      updateQuery,
      onError: printApolloError,
    });
  }

  public readonly render = () => null;
}

export default WrOwnDecksSH;
