import React, { PureComponent } from 'react';

import { Segment, Container, Card, Placeholder } from 'semantic-ui-react';

import { withRouter, RouteComponentProps } from 'react-router';

import { Query, QueryResult } from 'react-apollo';
import { DECK_QUERY, DeckData, DeckVariables } from './gql';

import { connect } from 'react-redux';
import { WrState } from '../store';

import WrCardsList from '../card/WrCardsList';
import WrCardListNavbar from '../card/WrCardListNavbar';

type DeckDetailRouteProps = RouteComponentProps<{ deckId: string }>;
interface StateProps {
  email: string | null;
}
type Props = StateProps & DeckDetailRouteProps;

class WrDeckDetail extends PureComponent<Props> {

  public readonly render = () => {
    const { match } = this.props;
    const { deckId } = match.params;
    const { renderDeck } = this;
    return (
      <Query query={DECK_QUERY} variables={{ deckId }}>
        {renderDeck}
      </Query>
    );
  }

  private readonly renderDeck = ({
    loading, error, data,
  }: QueryResult<DeckData, DeckVariables>) => {
    const { email: userEmail } = this.props;
    const { name, owner: { email } } = (data && data.rwDeck) || {
      name: null,
      owner: {
        email: null,
      },
    };
    const { deckId } = this.props.match.params;
    const formattedDeckName = (loading) ? (
      <Card.Header>
        <Placeholder>
          <Placeholder.Line />
        </Placeholder>
      </Card.Header>
    ) :  (<Card.Header>{name}</Card.Header>);
    const formattedOwner = (loading) ? (
      <Card.Meta>
        <Placeholder>
          <Placeholder.Line />
        </Placeholder>
      </Card.Meta>
    ) : (<Card.Meta>by {email}</Card.Meta>);
    const formattedError = error
      && <Card.Content>Error: {error.message}</Card.Content>;
    return (
      <>
        <WrCardListNavbar />
        <Segment as="section" vertical={true} basic={true}>
          <Container>
            <Card fluid={true}>
              <Card.Content>
                {formattedDeckName}
                {formattedOwner}
              </Card.Content>
              {formattedError}
              <WrCardsList deckId={deckId} mutable={!!(email && email === userEmail)} />
            </Card>
          </Container>
        </Segment>
      </>
    );
  }
}

const mapStateToProps = (state: WrState): StateProps => {
  const email = (state.signin && state.signin.data && state.signin.data.user && state.signin.data.user.email) || null;
  return { email };
};

export default withRouter<DeckDetailRouteProps>(
  connect<StateProps, {}, DeckDetailRouteProps>(mapStateToProps)(WrDeckDetail),
);
