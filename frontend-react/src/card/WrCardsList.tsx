import React, { Component } from 'react';

import { Query, QueryResult } from 'react-apollo';
import {
  CARDS_QUERY, CardsData, CardsVariables,
} from './gql';
import { printApolloError } from '../util';

import { Card, Placeholder, Grid } from 'semantic-ui-react';
import WrCardCreate from './WrCardCreate';
import { WrCard } from './types';
import WrCardItem from './WrCardItem';

import WrCardsListSubscriptionHelper from './WrCardsListSubscriptionHelper';
import { connect } from 'react-redux';
import { WrState } from '../store';
import { initialState } from './reducers';

interface StateProps {
  filter: string;
}

interface OwnProps {
  readonly deckId: string;
  readonly mutable: boolean;
}
type Props = StateProps & OwnProps;

const formattedLoadingCards = (
  <Card key="card-list-placeholder-0">
    <Card.Content>
      <Grid divided={true}>
        <Grid.Row>
          <Grid.Column width={6}>
            <Placeholder>
              <Placeholder.Line />
            </Placeholder>
          </Grid.Column>
          <Grid.Column width={6}>
            <Placeholder>
              <Placeholder.Line />
            </Placeholder>
          </Grid.Column>
          <Grid.Column width={4}>
            <Placeholder>
              <Placeholder.Line />
            </Placeholder>
          </Grid.Column>
        </Grid.Row>
      </Grid>
    </Card.Content>
  </Card>
);

class WrCardsList extends Component<Props> {

  public readonly render = () => {
    const { deckId } = this.props;
    const { renderComments } = this;
    return (
      <Query<CardsData, CardsVariables>
        query={CARDS_QUERY}
        variables={{ deckId }}
        onError={printApolloError}
      >
        {renderComments}
      </Query>
    );
  }

  private readonly renderComments = ({
    subscribeToMore, loading, error, data,
  }: QueryResult<CardsData, CardsVariables>) => {
    const { filter, mutable } = this.props;
    if (error) {
      return null;
    }
    if (!loading && (!data || !data.rwCardsOfDeck)) {
      return null;
    }
    const { deckId } = this.props;
    const formattedMessages = (loading || !data || !data.rwCardsOfDeck)
      ? formattedLoadingCards
      : data.rwCardsOfDeck.filter((room) => {
        return filter === '' || room.front.includes(filter) || room.back.includes(filter);
      }).map((card: WrCard) => {
        return <WrCardItem key={card.id} card={card} deckId={deckId} mutable={mutable} />;
      });
    const cardCreateIfMutable = mutable && (<WrCardCreate deckId={deckId} />);
    return (
      <>
        <WrCardsListSubscriptionHelper
          subscribeToMore={subscribeToMore}
          deckId={deckId}
        />
        <Card.Content>
          <Card.Group itemsPerRow={1}>
            {formattedMessages}
            {cardCreateIfMutable}
          </Card.Group>
        </Card.Content>
      </>
    );
  }
}

const mapStateToProps = (state: WrState): StateProps => {
  const { filter } = (state.card) || initialState;
  return { filter };
};

export default connect<StateProps, {}, OwnProps, WrState>(mapStateToProps)(WrCardsList);
