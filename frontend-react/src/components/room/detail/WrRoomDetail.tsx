import React from 'react';

import gql from 'graphql-tag';
import { useQuery } from '@apollo/react-hooks';
import { printApolloError } from '../../../util';
import { WR_ROOM_DETAIL } from '../../../client-models';
import { RoomDetail, RoomDetailVariables } from './gqlTypes/RoomDetail';

import styled from 'styled-components';
import Main from '../../../ui/layout/Main';
import HDivider from '../../../ui/HDivider';

import { withRouter, RouteComponentProps } from 'react-router';

import WrRoomDetailSH from './WrRoomDetailSH';
import WrRoomDetailInput from './WrRoomDetailInput';
import WrRoomConfig from './WrRoomConfig';
import WrRoomSidebar from '../sidebar/WrRoomSidebar';
import WrRoomMessageConfigItem from '../../room-message/WrRoomMessageConfigItem';
import WrRoomMessageTextItem from '../../room-message/WrRoomMessageTextItem';
import WrRoomConversationBox from './WrRoomConversationBox';

const ROOM_DETAIL_QUERY = gql`
${WR_ROOM_DETAIL}
query RoomDetail(
  $id: ID!
) {
  rwRoom(id: $id) {
    ...WrRoomDetail
  }
}
`;

const CenteredP = styled.p`
  text-align: center;
`;

const Header = styled.header`
  display: flex;
  flex-direction: column;
  padding: ${({ theme }) => theme.space[3]} 0;
`;

const RoomHeading = styled.h3`
  margin: 0;
  font-size: 112.5%;
`;

const WrRoomDetailComponent = (props: RouteComponentProps<{ roomId: string }>) => {
  const { match } = props;
  const { roomId } = match.params;
  const {
    subscribeToMore, loading, error, data,
  } = useQuery<RoomDetail, RoomDetailVariables>(ROOM_DETAIL_QUERY, {
    variables: { id: roomId },
    onError: printApolloError,
  });
  if (error) {
    return (
      <>
        <WrRoomSidebar />
        <Main />
      </>
    );
  }
  if (loading) {
    return (
      <>
        <WrRoomSidebar />
        <Main>
          <CenteredP>
            Retrieving room...
          </CenteredP>
        </Main>
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
  const { config } = room;
  let hasConfigMessage = false;
  const formattedMessages = room.messages.map((message) => {
    switch (message.contentType) {
      case 'CONFIG':
        hasConfigMessage = true;
        return <WrRoomMessageConfigItem key={message.id} config={config} />;
    }
    return <WrRoomMessageTextItem key={message.id} message={message} />;
  });
  return (
    <>
      <WrRoomDetailSH subscribeToMore={subscribeToMore} roomId={room.id} />
      <WrRoomSidebar room={room} />
      <Main>
        <Header>
          <RoomHeading>
            {room.owner.email} is hosting
            <span lang={config.deckNameLang ? config.deckNameLang : undefined}>{config.deckName}</span>
          </RoomHeading>
        </Header>
        <HDivider />
        {hasConfigMessage && <WrRoomConfig room={room} />}
        <WrRoomConversationBox>
          {formattedMessages}
        </WrRoomConversationBox>
        <HDivider />
        <WrRoomDetailInput roomId={roomId} />
      </Main>
    </>
  );
};

export default withRouter(WrRoomDetailComponent);
