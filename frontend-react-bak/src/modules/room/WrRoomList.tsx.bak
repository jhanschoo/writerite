import React, { PureComponent } from 'react';

import { Link } from 'react-router-dom';

import { WrState } from '../store';
import { initialState } from './reducers';
import { connect } from 'react-redux';

import { Query, QueryResult } from 'react-apollo';
import { WrRoom } from './types';
import { ROOMS_QUERY, RoomsData, RoomsVariables } from './gql';
import WrRoomListSubscriptionHelper from './WrRoomListSubscriptionHelper';

import { Card, Segment, Container, Placeholder } from 'semantic-ui-react';

import WrRoomListNavbar from './WrRoomListNavbar';
import { printApolloError } from '../util';
import WrRoomCreate from './WrRoomCreate';

interface StateProps {
  filter: string;
}

// TODO: implement and refactor search to use redux state
class WrRoomList extends PureComponent<StateProps> {
  public readonly render = () => {
    const { renderList } = this;
    return (
      <>
        <WrRoomListNavbar />
        <Segment as="section" vertical={true} basic={true}>
          <Container>
            <Query<RoomsData, RoomsVariables>
              query={ROOMS_QUERY}
              onError={printApolloError}
            >
              {renderList}
            </Query>
          </Container>
        </Segment>
      </>
    );
  }

  private readonly renderList = ({
    subscribeToMore, loading, error, data,
  }: QueryResult<RoomsData, RoomsVariables>) => {
    const { filter } = this.props;
    if (error) {
      return null;
    }
    if (!loading && (!data || !data.rwRooms)) {
      return null;
    }
    // additional ||'s are needed due to tsc's inadequate case analysis
    const list = (loading || !data || !data.rwRooms)
      ? (
        <Card key="room-list-placeholder-0">
          <Card.Content>
            <Card.Header>
              <Placeholder><Placeholder.Line /></Placeholder>
            </Card.Header>
            <Card.Meta>
              <Placeholder><Placeholder.Line /></Placeholder>
            </Card.Meta>
          </Card.Content>
        </Card>
      )
      : data.rwRooms.filter((room) => {
        return filter === '' || room.name.includes(filter);
      }).map(({ id, name, owner: { email } }: WrRoom) => (
        <Card key={id} as={Link} from="/dashboard/room" to={`/dashboard/room/${id}`}>
          <Card.Content>
            <Card.Header>
              {name}
            </Card.Header>
            <Card.Meta>
              hosted by {email}
            </Card.Meta>
          </Card.Content>
        </Card>
      ));
    return (
      <>
        <WrRoomListSubscriptionHelper subscribeToMore={subscribeToMore} />
        <Card.Group itemsPerRow={3} stackable={true}>
          {list}
          <WrRoomCreate />
        </Card.Group>
      </>
    );
  }
}

const mapStateToProps = (state: WrState): StateProps => {
  const { filter } = (state.room) || initialState;
  return { filter };
};

export default connect(mapStateToProps)(WrRoomList);
