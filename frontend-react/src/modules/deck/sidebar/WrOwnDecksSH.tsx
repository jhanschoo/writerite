import { PureComponent } from 'react';

import { SubscribeToMoreOptions } from 'apollo-client';
import { UpdateQueryFn } from 'apollo-client/core/watchQueryOptions';
import { printApolloError } from '../../../util';
import { MutationType } from '../../../types';
import { WrDeck } from '../types';
import { OWN_DECK_UPDATES_SUBSCRIPTION, OwnDecksData, OwnDeckUpdatesData, OwnDeckUpdatesVariables } from './gql';

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
          // https://github.com/apollographql/react-apollo/issues/2656
          decks = [rwOwnDeckUpdates.new].concat(decks.filter((deck: WrDeck) => {
            return deck.id !== rwOwnDeckUpdates.new.id;
          }));
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
        default:
          throw new Error('Invalid MutationType');
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
