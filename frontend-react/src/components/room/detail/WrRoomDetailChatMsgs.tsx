import React, { useEffect, useLayoutEffect, useRef, useState } from "react";

import { useQuery } from "@apollo/client";
import { CHAT_MSGS_OF_ROOM_QUERY, CHAT_MSGS_OF_ROOM_UPDATES_SUBSCRIPTION } from "src/gql";
import { ChatMsgContentType, ChatMsgsOfRoomQuery, ChatMsgsOfRoomQueryVariables, ChatMsgsOfRoomUpdatesSubscription, ChatMsgsOfRoomUpdatesSubscriptionVariables, UpdateType } from "src/gqlTypes";

import { wrStyled } from "src/theme";
import { Item, List } from "src/ui";

import WrRoomDetailChatMsgItem from "./WrRoomDetailChatMsgItem";
import { DiscriminatedChatMsgDetail } from "src/types";

const ConversationList = wrStyled(List)`
flex-grow: 1;
flex-shrink: 1;
overflow-y: scroll;
padding: ${({ theme: { space } }) => `0 0 ${space[1]} 0`}
`;

const SpacerItem = wrStyled(Item)`
flex-grow: 1;
`;

interface Props {
  roomId: string;
}

const WrRoomDetailChatMsgs = ({ roomId }: Props): JSX.Element => {
  const [fixToBottom, setFixToBottom] = useState(true);
  const conversationEl = useRef<HTMLUListElement>(null);
  useLayoutEffect(() => {
    const { current } = conversationEl;
    if (fixToBottom && current) {
      const maxScrollTop = current.scrollHeight - current.clientHeight;
      if (maxScrollTop > 0) {
        current.scrollTop = maxScrollTop;
      }
    }
  }, [fixToBottom]);
  const { data, subscribeToMore } = useQuery<ChatMsgsOfRoomQuery, ChatMsgsOfRoomQueryVariables>(CHAT_MSGS_OF_ROOM_QUERY, { variables: {
    roomId,
  } });
  useEffect(() => {
    subscribeToMore<ChatMsgsOfRoomUpdatesSubscription, ChatMsgsOfRoomUpdatesSubscriptionVariables>({
      document: CHAT_MSGS_OF_ROOM_UPDATES_SUBSCRIPTION,
      variables: { roomId },
      updateQuery(prev, { subscriptionData: { data: { chatMsgsOfRoomUpdates } } }) {
        switch (chatMsgsOfRoomUpdates?.type) {
          case UpdateType.CREATED:
            return { ...prev, chatMsgsOfRoom: [...prev.chatMsgsOfRoom ?? [], chatMsgsOfRoomUpdates.data] };
          default:
            return prev;
        }
      },
    });
  }, [roomId, subscribeToMore]);
  useLayoutEffect(() => {
    const { current } = conversationEl;
    if (fixToBottom && current) {
      const maxScrollTop = current.scrollHeight - current.clientHeight;
      if (maxScrollTop > 0) {
        current.scrollTop = maxScrollTop;
      }
    }
  }, [data, fixToBottom]);
  const handleScroll = () => {
    const { current } = conversationEl;
    if (!current) {
      return;
    }
    if (current.scrollTop + current.clientHeight >= current.scrollHeight) {
      return setFixToBottom(true);
    }
    return setFixToBottom(false);
  };
  const msgItems: JSX.Element[] = [];
  const msgs = data?.chatMsgsOfRoom?.filter((chatMsg): chatMsg is DiscriminatedChatMsgDetail => Boolean(chatMsg && chatMsg.type !== ChatMsgContentType.ROUND_WIN));
  if (msgs && msgs.length > 0) {
    let msgItemGroup: [DiscriminatedChatMsgDetail, ...DiscriminatedChatMsgDetail[]] = [msgs[0]];
    for (let i = 1; i < msgs.length; ++i) {
      if (msgs[i].type === msgItemGroup[0].type && msgs[i].senderId === msgItemGroup[0].senderId) {
        msgItemGroup.push(msgs[i]);
      } else {
        msgItems.push(<WrRoomDetailChatMsgItem key={`${msgItemGroup[0].id}-group`} chatMsgs={msgItemGroup} />);
        msgItemGroup = [msgs[i]];
      }
    }
    msgItems.push(<WrRoomDetailChatMsgItem key={`${msgItemGroup[0].id}-group`} chatMsgs={msgItemGroup} />);
  }

  return <ConversationList onScroll={handleScroll} ref={conversationEl}>
    <SpacerItem key="spacer" />
    {msgItems}
  </ConversationList>;
};

export default WrRoomDetailChatMsgs;
