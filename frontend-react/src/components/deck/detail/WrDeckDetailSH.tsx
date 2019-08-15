import { PureComponent } from 'react';

import { gql } from 'graphql.macro';
import { SubscribeToMoreOptions } from 'apollo-client';
import { UpdateQueryFn } from 'apollo-client/core/watchQueryOptions';
import { printApolloError } from '../../../util';
import { CardsUpdates_rwCardsUpdatesOfDeck_new } from './gqlTypes/CardsUpdates';
import { DeckUpdates_rwDeckUpdates_new } from './gqlTypes/DeckUpdates';

import { WrDeckDetail } from '../../../client-models/WrDeckDetail';
import { DeckDetail, DeckDetail_rwDeck_cards } from './gqlTypes/DeckDetail';
import { MutationType, Payload } from '../../../types';
import { WrCard } from '../../../client-models/WrCard';

const CARDS_UPDATES_SUBSCRIPTION = gql`
${WrCard}
subscription CardsUpdates($deckId: ID!) {
  rwCardsUpdatesOfDeck(deckId: $deckId) {
    mutation
    new {
      ...WrCard
    }
    oldId
  }
}
`;

interface CardsUpdatesVariables {
  readonly deckId: string;
}

type CardUpdatesPayload = Payload<CardsUpdates_rwCardsUpdatesOfDeck_new>;

interface CardsUpdatesData {
  readonly rwCardsUpdatesOfDeck: CardUpdatesPayload;
}

const DECK_UPDATES_SUBSCRIPTION = gql`
${WrDeckDetail}
subscription DeckUpdates($id: ID!) {
  rwDeckUpdates(id: $id) {
    mutation
    new {
      ...WrDeckDetail
    }
    oldId
  }
}
`;

interface DeckUpdatesVariables {
  readonly id: string;
}

type DeckUpdatesPayload = Payload<DeckUpdates_rwDeckUpdates_new>;

interface DeckUpdatesData {
  readonly rwDeckUpdates: DeckUpdatesPayload;
}

interface Props {
  subscribeToMore: ((options: SubscribeToMoreOptions<
    DeckDetail,
    CardsUpdatesVariables,
    CardsUpdatesData
  >) => () => void) & ((options: SubscribeToMoreOptions<
    DeckDetail,
    DeckUpdatesVariables,
    DeckUpdatesData
  >) => () => void);
  deckId: string;
}

class WrDeckDetailSH extends PureComponent<Props> {
  public readonly componentDidMount = () => {
    this.subscribeToCardsUpdatesOfDeck();
  }

  public readonly render = () => null;

  private subscribeToCardsUpdatesOfDeck = () => {
    const { subscribeToMore, deckId } = this.props;
    const updateQuery: UpdateQueryFn<
      DeckDetail,
      CardsUpdatesVariables,
      CardsUpdatesData
    > = (
      prev, { subscriptionData },
    ) => {
      let cards = (prev.rwDeck) ? prev.rwDeck.cards : [];
      const { rwCardsUpdatesOfDeck } = subscriptionData.data;
      switch (rwCardsUpdatesOfDeck.mutation) {
        case MutationType.CREATED:
          // https://github.com/apollographql/react-apollo/issues/2656
          cards = [rwCardsUpdatesOfDeck.new].concat(cards.filter((card) => {
            return card.id !== rwCardsUpdatesOfDeck.new.id;
          }));
          break;
        case MutationType.UPDATED:
          cards = cards.map((card) => {
            if (card.id !== rwCardsUpdatesOfDeck.new.id) {
              return card;
            }
            return rwCardsUpdatesOfDeck.new;
          });
          break;
        case MutationType.DELETED:
          cards = cards.filter((card) => {
            return card.id !== rwCardsUpdatesOfDeck.oldId;
          });
          break;
        default:
          throw new Error('Invalid MutationType');
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
      DeckUpdatesData
    > = (
      prev, { subscriptionData },
    ) => {
      let deck = prev.rwDeck;
      const { rwDeckUpdates } = subscriptionData.data;
      switch (rwDeckUpdates.mutation) {
        case MutationType.CREATED:
          throw new Error('CREATED not expected on subscription');
        case MutationType.UPDATED:
          deck = deck && { ...deck, ...rwDeckUpdates.new };
          break;
        case MutationType.DELETED:
          deck = null;
          break;
        default:
          throw new Error('Invalid MutationType');
      }
      return { ...prev, rwDeck: deck };
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
