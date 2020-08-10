import React, { useEffect } from "react";

import { useQuery } from "@apollo/client";
import { ChatMsgContentType, ChatMsgDetail, ChatMsgsOfRoomQuery, ChatMsgsOfRoomQueryVariables, ChatMsgsOfRoomUpdatesSubscription, ChatMsgsOfRoomUpdatesSubscriptionVariables } from "src/gqlTypes";

import { wrStyled } from "src/theme";
import { Item, List } from "src/ui";
import { CHAT_MSGS_OF_ROOM_QUERY, CHAT_MSGS_OF_ROOM_UPDATES_SUBSCRIPTION } from "src/gql";

const ConversationList = wrStyled(List)`
flex-grow: 1;
flex-shrink: 1;
overflow-y: scroll;
`;

const MsgItem = wrStyled(Item)`
`;

interface Props {
  roomId: string;
}

const WrRoomDetailChatMsgs = ({ roomId }: Props): JSX.Element => {
  const { data, subscribeToMore } = useQuery<ChatMsgsOfRoomQuery, ChatMsgsOfRoomQueryVariables>(CHAT_MSGS_OF_ROOM_QUERY, { variables: {
    roomId,
  } });
  useEffect(() => {
    subscribeToMore<ChatMsgsOfRoomUpdatesSubscription, ChatMsgsOfRoomUpdatesSubscriptionVariables>({
      document: CHAT_MSGS_OF_ROOM_UPDATES_SUBSCRIPTION,
      variables: { roomId },
      updateQuery(prev, { subscriptionData: { data: { chatMsgsOfRoomUpdates } } }) {
        // TODO
        console.log(chatMsgsOfRoomUpdates);
        return prev;
      },
    });
  }, [roomId, subscribeToMore]);
  const msgs = data?.chatMsgsOfRoom?.filter((chatMsg): chatMsg is ChatMsgDetail => chatMsg?.type === ChatMsgContentType.TEXT);
  // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
  const msgItems = msgs?.map(({ id, sender, content }) => sender && <MsgItem key={id}>{`${sender.name || sender.email}: ${content}`}
  </MsgItem>);
  return <ConversationList>
    {msgItems}
  </ConversationList>;
};

export default WrRoomDetailChatMsgs;
