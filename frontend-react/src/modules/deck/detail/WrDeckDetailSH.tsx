import { PureComponent } from 'react';

import { SubscribeToMoreOptions } from 'apollo-client';
import { UpdateQueryFn } from 'apollo-client/core/watchQueryOptions';
import { printApolloError } from '../../../util';
import { DeckDetailData, DECK_UPDATES_SUBSCRIPTION, DeckUpdatesVariables, DeckUpdatesData } from '../gql';
import { CARDS_UPDATES_SUBSCRIPTION, CardsUpdatesData, CardsUpdatesVariables } from '../../card/gql';

import { MutationType } from '../../../types';
import { WrCard } from '../../card/types';

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
          cards = [rwCardsUpdatesOfDeck.new].concat(cards.filter((card: WrCard) => {
            return card.id !== rwCardsUpdatesOfDeck.new.id;
          }));
          break;
        case MutationType.UPDATED:
          cards = cards.map((card: WrCard) => {
            if (card.id !== rwCardsUpdatesOfDeck.new.id) {
              return card;
            }
            return rwCardsUpdatesOfDeck.new;
          });
          break;
        case MutationType.DELETED:
          cards = cards.filter((card: WrCard) => {
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
