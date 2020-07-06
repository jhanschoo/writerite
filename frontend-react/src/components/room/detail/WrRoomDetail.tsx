import React from 'react';

import gql from 'graphql-tag';
import { useQuery } from '@apollo/react-hooks';
import { printApolloError } from '../../../util';
import { WR_ROOM_DETAIL } from '../../../client-models';
import { RoomDetail, RoomDetailVariables } from './gqlTypes/RoomDetail';

import styled from 'styled-components';
import Main from '../../../ui/layout/Main';
import HDivider from '../../../ui-components/HDivider';

import { useParams } from 'react-router';

import WrRoomDetailInput from './WrRoomDetailInput';
import WrRoomConfig from './WrRoomConfig';
import WrRoomSidebar from '../sidebar/WrRoomSidebar';
import WrChatMsgConfigItem from '../../chat-msg/WrChatMsgConfigItem';
import WrChatMsgTextItem from '../../chat-msg/WrChatMsgTextItem';
import WrRoomConversationBox from './WrRoomConversationBox';
import { WrChatMsg } from '../../../client-models/gqlTypes/WrChatMsg';

const ROOM_DETAIL_QUERY = gql`
${WR_ROOM_DETAIL}
query RoomDetail(
  $id: ID!
) {
  room(id: $id) {
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

const WrRoomDetailComponent = () => {
  const { roomId } = useParams<{ roomId: string }>();
  const {
    loading, error, data,
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
  if (!data?.room) {
    return (
      <CenteredP>
        Error retrieving room. Please try again later.
      </CenteredP>
    );
  }
  const { room } = data;
  const { config } = room;
  let hasConfigMessage = false;
  const formattedMessages = room.chatMsgs?.filter((msg): msg is WrChatMsg => !!msg).map((msg) => {
    switch (msg.type) {
      case 'CONFIG':
        hasConfigMessage = true;
        return <WrChatMsgConfigItem key={msg.id} config={config} />;
    }
    return <WrChatMsgTextItem key={msg.id} message={msg} />;
  });
  return (
    <>
      <WrRoomSidebar room={room} />
      <Main>
        <Header>
          <RoomHeading>
            {room.owner?.email || "ERROR"} is hosting
            <span lang={undefined}>{config.deckName}</span>
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

export default WrRoomDetailComponent;
