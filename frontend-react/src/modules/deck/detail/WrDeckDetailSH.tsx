import { PureComponent } from 'react';

import { SubscribeToMoreOptions } from 'apollo-client';
import { UpdateQueryFn } from 'apollo-client/core/watchQueryOptions';
import { printApolloError } from '../../../util';
import { MutationType } from '../../../types';
import { WrCard } from '../../card/types';
import { DeckDetailData } from '../gql';
import { CARD_UPDATES_SUBSCRIPTION, CardUpdatesData, CardUpdatesVariables } from '../../card/gql';

interface Props {
  subscribeToMore: (options: SubscribeToMoreOptions<
    DeckDetailData, CardUpdatesVariables, CardUpdatesData
  >) => () => void;
  deckId: string;
}

class WrDeckDetailSH extends PureComponent<Props> {
  public readonly componentDidMount = () => {
    const { subscribeToMore, deckId } = this.props;
    const updateQuery: UpdateQueryFn<DeckDetailData, CardUpdatesVariables, CardUpdatesData> = (
      prev, { subscriptionData },
    ) => {
      let cards = (prev.rwDeck) ? prev.rwDeck.cards : [];
      const { rwCardUpdatesOfDeck } = subscriptionData.data;
      switch (rwCardUpdatesOfDeck.mutation) {
        case MutationType.CREATED:
          // https://github.com/apollographql/react-apollo/issues/2656
          cards = [rwCardUpdatesOfDeck.new].concat(cards.filter((card: WrCard) => {
            return card.id !== rwCardUpdatesOfDeck.new.id;
          }));
          break;
        case MutationType.UPDATED:
          let hasMutation = false;
          cards = cards.map((card: WrCard) => {
            if (card.id !== rwCardUpdatesOfDeck.new.id) {
              return card;
            }
            hasMutation = true;
            return rwCardUpdatesOfDeck.new;
          });
          if (hasMutation) {
            cards = [rwCardUpdatesOfDeck.new].concat(cards);
          }
          break;
        case MutationType.DELETED:
          cards = cards.filter((card: WrCard) => {
            return card.id !== rwCardUpdatesOfDeck.oldId;
          });
          break;
        default:
          throw new Error('Invalid MutationType');
      }
      return { ...prev, rwDeck: prev.rwDeck ? { ...prev.rwDeck, cards } : null };
    };
    subscribeToMore({
      document: CARD_UPDATES_SUBSCRIPTION,
      updateQuery,
      onError: printApolloError,
      variables: { deckId },
    });
  }

  public readonly render = () => null;
}

export default WrDeckDetailSH;
