import React, { PureComponent } from 'react';

import { Segment, Container, Placeholder, Header, Grid } from 'semantic-ui-react';

import { RouteComponentProps } from 'react-router';

import { Query, QueryResult } from 'react-apollo';
import { ROOM_QUERY, RoomData, RoomVariables } from './gql';
import { printApolloError } from '../util';

import WrNavbar from '../WrNavbar';
import WrRoomMessageInput from '../roomMessages/WrRoomMessageInput';
import WrRoomFeed from '../roomMessages/WrRoomFeed';
import WrRoomDetailDeckSelector from './WrRoomDetailDeckSelector';
import { WrState } from '../store';
import { connect } from 'react-redux';
import { User } from '../types';

type RoomDetailRouteProps = RouteComponentProps<{ roomId: string }>;

interface StateProps {
  email: string | null;
}

type Props = StateProps & RoomDetailRouteProps;

class WrRoomDetail extends PureComponent<Props> {

  public readonly render = () => {
    const { match } = this.props;
    const { roomId } = match.params;
    const { renderRoom } = this;
    return (
      <>
        <Segment as="section" vertical={true} basic={true}>
          <Container>
            <WrNavbar dashboardPage="Room" />
          </Container>
        </Segment>
        <Segment as="section" vertical={true} basic={true}>
          <Container>
            <Query<RoomData, RoomVariables>
              query={ROOM_QUERY}
              variables={{ roomId }}
              fetchPolicy="network-only"
              onError={printApolloError}
            >
              {renderRoom}
            </Query>
          </Container>
        </Segment>
      </>
    );
  }

  private readonly renderRoom = ({
    loading, error, data, refetch,
  }: QueryResult<RoomData, RoomVariables>) => {
    const { email: userEmail } = this.props;
    const { roomId } = this.props.match.params;
    if (error) {
      return null;
    }
    if (!loading && (!data || !data.rwRoom)) {
      return null;
    }
    const { name, occupants, owner } = (data && data.rwRoom) || {
      name: undefined, occupants: [] as User[], owner: undefined,
    };
    const occupantEmails = occupants.map(({ email }) => email);
    const userAllowedInRoom = owner && ((owner.email === userEmail) || occupantEmails.includes(userEmail || ''));
    const formattedHeader = (data && data.rwRoom)
      ? (() => {
        const formattedOwnerInfo = owner && (
          <Header.Subheader>{owner.email} is hosting</Header.Subheader>
        );
        const formattedOccupantEmails = occupantEmails && (
          <Header.Subheader>
            Also in this room: {occupantEmails.sort().join(', ')}
          </Header.Subheader>
        );
        return (
          <Segment>
            <Grid stackable={true}>
              <Grid.Column width={10}>
                <Header as="h3">
                  {name}
                  {formattedOwnerInfo}
                  {formattedOccupantEmails}
                </Header>
              </Grid.Column>
              <Grid.Column width={6} textAlign="right">
                <WrRoomDetailDeckSelector
                  roomId={roomId}
                  currentDeck={data.rwRoom.servingDeck}
                  onMutation={refetch}
                  loading={loading}
                  disabled={!userAllowedInRoom}
                />
              </Grid.Column>
            </Grid>
          </Segment>
        );
      })()
      : (
        <Segment>
          <Placeholder>
            <Placeholder.Header>
              <Placeholder.Line />
              <Placeholder.Line />
              <Placeholder.Line />
            </Placeholder.Header>
          </Placeholder>
        </Segment>
      );
    return (
      <Segment.Group>
        {formattedHeader}
        <WrRoomFeed roomId={roomId} />
        <WrRoomMessageInput roomId={roomId} disabled={!userAllowedInRoom} />
      </Segment.Group>
    );
  }
}

const mapStateToProps = (state: WrState): StateProps => {
  const email = (state.signin && state.signin.data && state.signin.data.user && state.signin.data.user.email) || null;
  return { email };
};

export default connect<StateProps, {}, RoomDetailRouteProps, WrState>(mapStateToProps)(WrRoomDetail);
