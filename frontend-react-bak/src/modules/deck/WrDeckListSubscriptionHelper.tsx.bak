import { PureComponent } from 'react';
import { SubscribeToMoreOptions } from 'apollo-client';
import { UpdateQueryFn } from 'apollo-client/core/watchQueryOptions';
import { DECK_UPDATES_SUBSCRIPTION, DecksData, DeckUpdatesData, DeckUpdatesVariables } from './gql';
import { printApolloError } from '../util';
import { MutationType } from '../types';
import { WrDeck } from './types';

interface Props {
  subscribeToMore: (options: SubscribeToMoreOptions<
    DecksData, DeckUpdatesVariables, DeckUpdatesData
  >) => () => void;
}

class WrDeckListSubscriptionHelper extends PureComponent<Props> {
  public readonly componentDidMount = () => {
    const { subscribeToMore } = this.props;
    const updateQuery: UpdateQueryFn<DecksData, DeckUpdatesVariables, DeckUpdatesData> = (
      prev, { subscriptionData },
    ) => {
      let decks = prev.rwDecks || [];
      const { rwDeckUpdates } = subscriptionData.data;
      switch (rwDeckUpdates.mutation) {
        case MutationType.CREATED:
          decks = decks.concat([rwDeckUpdates.new]);
          break;
        case MutationType.UPDATED:
          decks = decks.map((deck: WrDeck) => {
            if (deck.id !== rwDeckUpdates.new.id) {
              return deck;
            }
            return rwDeckUpdates.new;
          });
          break;
        case MutationType.DELETED:
          decks = decks.filter((deck: WrDeck) => {
            return deck.id !== rwDeckUpdates.oldId;
          });
          break;
      }
      return Object.assign<object, DecksData, DecksData>(
        {}, prev, { rwDecks: decks },
      );
    };
    subscribeToMore({
      document: DECK_UPDATES_SUBSCRIPTION,
      updateQuery,
      onError: printApolloError,
    });
  }

  public readonly render = () => null;
}

export default WrDeckListSubscriptionHelper;
