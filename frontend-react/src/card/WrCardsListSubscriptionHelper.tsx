import { PureComponent } from 'react';
import { SubscribeToMoreOptions } from 'apollo-client';
import { UpdateQueryFn } from 'apollo-client/core/watchQueryOptions';
import { CARD_UPDATES_SUBSCRIPTION, CardsData, CardUpdatesData, CardUpdatesVariables } from './gql';
import { WrCard } from './types';
import { MutationType } from '../types';
import { printApolloError } from '../util';

interface Props {
  subscribeToMore: (options: SubscribeToMoreOptions<
    CardsData, CardUpdatesVariables, CardUpdatesData
  >) => () => void;
  deckId: string;
}

class WrDeckListSubscriptionHelper extends PureComponent<Props> {
  public readonly componentDidMount = () => {
    const { deckId, subscribeToMore } = this.props;
    const updateQuery: UpdateQueryFn<CardsData, CardUpdatesVariables, CardUpdatesData> = (
      prev, { subscriptionData },
    ) => {
      let cards = prev.rwCardsOfDeck || [];
      const { rwCardUpdatesOfDeck } = subscriptionData.data;
      switch (rwCardUpdatesOfDeck.mutation) {
        case MutationType.CREATED:
          cards = cards.concat([rwCardUpdatesOfDeck.new]);
          break;
        case MutationType.UPDATED:
          cards = cards.map((card: WrCard) => {
            if (card.id !== rwCardUpdatesOfDeck.new.id) {
              return card;
            }
            return rwCardUpdatesOfDeck.new;
          });
          break;
        case MutationType.DELETED:
          cards = cards.filter((card: WrCard) => {
            return card.id !== rwCardUpdatesOfDeck.oldId;
          });
          break;
      }
      return Object.assign<object, CardsData, CardsData>(
        {}, prev, { rwCardsOfDeck: cards },
      );
    };
    subscribeToMore({
      document: CARD_UPDATES_SUBSCRIPTION,
      variables: { deckId },
      updateQuery,
      onError: printApolloError,
    });
  }

  public readonly render = () => null;
}

export default WrDeckListSubscriptionHelper;
