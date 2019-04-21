import { PureComponent } from 'react';
import { SubscribeToMoreOptions } from 'apollo-client';
import { UpdateQueryFn } from 'apollo-client/core/watchQueryOptions';
import { OWN_DECK_UPDATES_SUBSCRIPTION, OwnDecksData, OwnDeckUpdatesData, OwnDeckUpdatesVariables } from '../gql';
import { printApolloError } from '../../../util';
import { MutationType } from '../../../types';
import { WrDeck } from '../types';

interface Props {
  subscribeToMore: (options: SubscribeToMoreOptions<
    OwnDecksData, OwnDeckUpdatesVariables, OwnDeckUpdatesData
  >) => () => void;
}

class WrOwnDecksSH extends PureComponent<Props> {
  public readonly componentDidMount = () => {
    const { subscribeToMore } = this.props;
    const updateQuery: UpdateQueryFn<OwnDecksData, OwnDeckUpdatesVariables, OwnDeckUpdatesData> = (
      prev, { subscriptionData },
    ) => {
      let decks = prev.rwOwnDecks || [];
      const { rwOwnDeckUpdates } = subscriptionData.data;
      switch (rwOwnDeckUpdates.mutation) {
        case MutationType.CREATED:
          decks = decks.concat([rwOwnDeckUpdates.new]);
          break;
        case MutationType.UPDATED:
          decks = decks.map((deck: WrDeck) => {
            if (deck.id !== rwOwnDeckUpdates.new.id) {
              return deck;
            }
            return rwOwnDeckUpdates.new;
          });
          break;
        case MutationType.DELETED:
          decks = decks.filter((deck: WrDeck) => {
            return deck.id !== rwOwnDeckUpdates.oldId;
          });
          break;
      }
      return Object.assign<object, OwnDecksData, OwnDecksData>(
        {}, prev, { rwOwnDecks: decks },
      );
    };
    subscribeToMore({
      document: OWN_DECK_UPDATES_SUBSCRIPTION,
      updateQuery,
      onError: printApolloError,
    });
  }

  public readonly render = () => null;
}

export default WrOwnDecksSH;
