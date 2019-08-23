import { PureComponent } from 'react';

import { gql } from 'graphql.macro';
import { SubscribeToMoreOptions } from 'apollo-client';
import { UpdateQueryFn } from 'apollo-client/core/watchQueryOptions';
import { printApolloError } from '../../../util';
import { CardsUpdates, CardsUpdatesVariables } from './gqlTypes/CardsUpdates';
import { DeckUpdates, DeckUpdatesVariables } from './gqlTypes/DeckUpdates';

import { WR_DECK_DETAIL } from '../../../client-models/WrDeckDetail';
import { DeckDetail } from './gqlTypes/DeckDetail';
import { WR_CARD } from '../../../client-models/WrCard';

const CARDS_UPDATES_SUBSCRIPTION = gql`
${WR_CARD}
subscription CardsUpdates($deckId: ID!) {
  rwCardsUpdatesOfDeck(deckId: $deckId) {
    ... on RwCardCreated {
      created {
        ...WrCard
      }
    }
    ... on RwCardUpdated {
      updated {
        ...WrCard
      }
    }
    ... on RwCardDeleted {
      deletedId
    }
  }
}
`;

const DECK_UPDATES_SUBSCRIPTION = gql`
${WR_DECK_DETAIL}
subscription DeckUpdates($id: ID!) {
  rwDeckUpdates(id: $id) {
    ... on RwDeckCreated {
      created {
        ...WrDeckDetail
      }
    }
    ... on RwDeckUpdated {
      updated {
        ...WrDeckDetail
      }
    }
    ... on RwDeckDeleted {
      deletedId
    }
  }
}
`;

interface Props {
  subscribeToMore: ((options: SubscribeToMoreOptions<
    DeckDetail,
    CardsUpdatesVariables,
    CardsUpdates
  >) => () => void) & ((options: SubscribeToMoreOptions<
    DeckDetail,
    DeckUpdatesVariables,
    DeckUpdates
  >) => () => void);
  deckId: string;
}

class WrDeckDetailSH extends PureComponent<Props> {
  public readonly componentDidMount = () => {
    this.subscribeToCardsUpdatesOfDeck();
    this.subscribeToDeckUpdates();
  }

  public readonly render = () => null;

  private subscribeToCardsUpdatesOfDeck = () => {
    const { subscribeToMore, deckId } = this.props;
    const updateQuery: UpdateQueryFn<
      DeckDetail,
      CardsUpdatesVariables,
      CardsUpdates
    > = (
      prev, { subscriptionData },
    ) => {
      let cards = (prev.rwDeck) ? [...prev.rwDeck.cards] : [];
      const { rwCardsUpdatesOfDeck } = subscriptionData.data;
      if ('created' in rwCardsUpdatesOfDeck && rwCardsUpdatesOfDeck.created) {
        const { created } = rwCardsUpdatesOfDeck;
        cards = [created].concat(cards.filter((card) => {
          return card.id !== created.id;
        }));
      }
      if ('updated' in rwCardsUpdatesOfDeck && rwCardsUpdatesOfDeck.updated) {
        const { updated } = rwCardsUpdatesOfDeck;
        cards = cards.map((card) => {
          if (card.id !== updated.id) {
            return card;
          }
          return updated;
        });
      }
      if ('deletedId' in rwCardsUpdatesOfDeck && rwCardsUpdatesOfDeck.deletedId) {
        const { deletedId } = rwCardsUpdatesOfDeck;
        cards = cards.filter((card) => {
          return card.id !== deletedId;
        });
      }
      return { ...prev, rwDeck: prev.rwDeck ? { ...prev.rwDeck, cards } : null };
    };
    subscribeToMore({
      document: CARDS_UPDATES_SUBSCRIPTION,
      updateQuery,
      onError: printApolloError,
      // workaround for insufficiently expressive type
      variables: { deckId },
    });
  }

  private subscribeToDeckUpdates = () => {
    const { subscribeToMore, deckId } = this.props;
    const updateQuery: UpdateQueryFn<
      DeckDetail,
      DeckUpdatesVariables,
      DeckUpdates
    > = (
      prev, { subscriptionData },
    ) => {
      let rwDeck = prev.rwDeck;
      const { rwDeckUpdates } = subscriptionData.data;
      if ('created' in rwDeckUpdates) {
        throw new Error('created not expected on subscription');
      }
      if ('updated' in rwDeckUpdates && rwDeckUpdates.updated) {
        rwDeck = rwDeck && { ...rwDeck, ...rwDeckUpdates.updated };
      }
      if ('deletedId' in rwDeckUpdates && rwDeckUpdates.deletedId) {
        rwDeck = null;
      }
      return { ...prev, rwDeck };
    };
    subscribeToMore({
      document: DECK_UPDATES_SUBSCRIPTION,
      updateQuery,
      onError: printApolloError,
      // workaround for insufficiently expressive type
      variables: { id: deckId },
    });
  }
}

export default WrDeckDetailSH;
