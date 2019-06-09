import { PureComponent } from 'react';

import { gql } from 'graphql.macro';
import { SubscribeToMoreOptions } from 'apollo-client';
import { UpdateQueryFn } from 'apollo-client/core/watchQueryOptions';
import { printApolloError } from '../../../util';

import { WrDeckDetail, IWrDeckDetail } from '../../../models/WrDeckDetail';
import { DeckDetailData } from './WrDeckDetail';
import { MutationType, Payload } from '../../../types';
import { WrCard, IWrCard } from '../../../models/WrCard';

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

type CardUpdatesPayload = Payload<IWrCard>;

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

type DeckUpdatesPayload = Payload<IWrDeckDetail>;

interface DeckUpdatesData {
  readonly rwDeckUpdates: DeckUpdatesPayload;
}

interface Props {
  subscribeToMore: ((options: SubscribeToMoreOptions<
    DeckDetailData,
    CardsUpdatesVariables,
    CardsUpdatesData
  >) => () => void) & ((options: SubscribeToMoreOptions<
    DeckDetailData,
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
      DeckDetailData,
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
          cards = [rwCardsUpdatesOfDeck.new].concat(cards.filter((card: IWrCard) => {
            return card.id !== rwCardsUpdatesOfDeck.new.id;
          }));
          break;
        case MutationType.UPDATED:
          cards = cards.map((card: IWrCard) => {
            if (card.id !== rwCardsUpdatesOfDeck.new.id) {
              return card;
            }
            return rwCardsUpdatesOfDeck.new;
          });
          break;
        case MutationType.DELETED:
          cards = cards.filter((card: IWrCard) => {
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
      DeckDetailData,
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
