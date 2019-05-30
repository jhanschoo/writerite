import React from 'react';

import { gql } from 'graphql.macro';
import { Query, QueryResult } from 'react-apollo';
import { printApolloError } from '../../../util';

import styled from 'styled-components';
import FlexMain from '../../../ui/layout/FlexMain';
import HDivider from '../../../ui/HDivider';
import List from '../../../ui/list/List';
import Item from '../../../ui/list/Item';

import { withRouter, RouteComponentProps } from 'react-router';

import { WrRoom, IWrRoom } from '../../../models/WrRoom';
import { WrDeck, IWrDeck } from '../../../models/WrDeck';
import { WrRoomMessage, IWrRoomMessage } from '../../../models/WrRoomMessage';
import WrRoomDetailInput from './WrRoomDetailInput';
import WrRoomSidebar from '../sidebar/WrRoomSidebar';
import WrRoomMessageItem from '../../room-message/WrRoomMessageItem';

const ROOM_DETAIL_QUERY = gql`
query RoomDetail(
  $id: ID!
) {
  rwRoom(id: $id) {
    ...WrRoom
    deck {
      ...WrDeck
    }
    messages {
      ...WrRoomMessage
    }
  }
  ${WrRoom}
  ${WrDeck}
  ${WrRoomMessage}
}
`;

export interface RoomDetailVariables {
  readonly id: string;
}

export interface IWrRoomDetail extends IWrRoom {
  deck: IWrDeck;
  messages: IWrRoomMessage[];
}

export interface RoomDetailData {
  readonly rwRoom: IWrRoomDetail | null;
}

const CenteredP = styled.p`
  text-align: center;
`;

const Header = styled.header`
  display: flex;
  padding: ${({ theme }) => theme.space[3]} 0;
`;

const RoomHeading = styled.h3`
  margin: 0;
  font-size: 112.5%;
`;

const ConversationBox = styled(List)`
  flex-direction: column;
  flex-grow: 1;
  overflow-y: auto;
  padding: 0 ${({ theme }) => theme.space[2]};
`;

// https://github.com/philipwalton/flexbugs/issues/53
const Spacer = styled(Item)`
  display: flex;
  flex-grow: 1;
`;

const WrRoomDetail = (props: RouteComponentProps<{ roomId: string }>) => {
  const { match } = props;
  const { roomId } = match.params;
  const renderRoom = ({
    subscribeToMore, loading, error, data,
  }: QueryResult<RoomDetailData, RoomDetailVariables>) => {
    if (error) {
      return (
        <>
          <WrRoomSidebar />
          <FlexMain />
        </>
      );
    }
    if (loading) {
      return (
        <>
          <WrRoomSidebar />
          <FlexMain>
            <CenteredP>
              Retrieving room...
            </CenteredP>
          </FlexMain>
        </>
      );
    }
    if (!data || !data.rwRoom) {
      return (
        <CenteredP>
          Error retrieving room. Please try again later.
        </CenteredP>
      );
    }
    const room = data.rwRoom;
    const formattedMessages = room.messages.map((message) => (
      <WrRoomMessageItem key={message.id} message={message} />
    ));
    return (
      <>
        <WrRoomSidebar />
        <FlexMain>
          <Header>
            <RoomHeading>
              {room.owner.email} is hosting 
              <span lang={room.deck.nameLang || undefined}>{` ${room.deck.name} `}</span>
              by {room.deck.owner.email}
            </RoomHeading>
          </Header>
          <HDivider />
          <ConversationBox>
            <Spacer />
            {formattedMessages}
          </ConversationBox>
          <HDivider />
          <WrRoomDetailInput roomId={roomId} />
        </FlexMain>
      </>
    );
  };
  return (
    <Query<RoomDetailData, RoomDetailVariables>
      query={ROOM_DETAIL_QUERY}
      variables={{ id: roomId }}
      onError={printApolloError}
    >
      {renderRoom}
    </Query>
  );
};

export default withRouter(WrRoomDetail);
