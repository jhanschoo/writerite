import { PureComponent } from 'react';

import { gql } from 'graphql.macro';
import { SubscribeToMoreOptions } from 'apollo-client';
import { UpdateQueryFn } from 'apollo-client/core/watchQueryOptions';
import { printApolloError } from '../../../util';

import { MutationType, Payload } from '../../../types';
import { WrDeck, IWrDeck } from '../../../models/WrDeck';
import { OwnDecksData } from './WrOwnDecks';

const OWN_DECKS_UPDATES_SUBSCRIPTION = gql`
${WrDeck}
subscription OwnDecksUpdates {
  rwOwnDecksUpdates {
    mutation
    new {
      ...WrDeck
    }
    oldId
  }
}
`;

export type OwnDecksUpdatesVariables = object;

export type WrDeckUpdatesPayload = Payload<IWrDeck>;

export interface OwnDecksUpdatesData {
  readonly rwOwnDecksUpdates: WrDeckUpdatesPayload;
}

interface Props {
  subscribeToMore: (options: SubscribeToMoreOptions<
    OwnDecksData, OwnDecksUpdatesVariables, OwnDecksUpdatesData
  >) => () => void;
}

class WrOwnDecksSH extends PureComponent<Props> {
  public readonly componentDidMount = () => {
    const { subscribeToMore } = this.props;
    const updateQuery: UpdateQueryFn<OwnDecksData, OwnDecksUpdatesVariables, OwnDecksUpdatesData> = (
      prev, { subscriptionData },
    ) => {
      let decks = prev.rwOwnDecks || [];
      const { rwOwnDecksUpdates } = subscriptionData.data;
      switch (rwOwnDecksUpdates.mutation) {
        case MutationType.CREATED:
          // https://github.com/apollographql/react-apollo/issues/2656
          decks = [rwOwnDecksUpdates.new].concat(decks.filter((deck: IWrDeck) => {
            return deck.id !== rwOwnDecksUpdates.new.id;
          }));
          break;
        case MutationType.UPDATED:
          decks = decks.map((deck: IWrDeck) => {
            if (deck.id !== rwOwnDecksUpdates.new.id) {
              return deck;
            }
            return rwOwnDecksUpdates.new;
          });
          break;
        case MutationType.DELETED:
          decks = decks.filter((deck: IWrDeck) => {
            return deck.id !== rwOwnDecksUpdates.oldId;
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
      document: OWN_DECKS_UPDATES_SUBSCRIPTION,
      updateQuery,
      onError: printApolloError,
    });
  }

  public readonly render = () => null;
}

export default WrOwnDecksSH;