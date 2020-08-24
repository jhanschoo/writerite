import React from "react";

import { ChatMsgContentType } from "src/gqlTypes";

import WrRoomDetailTextChatMsgItem from "./WrRoomDetailTextChatMsgItem";
import WrRoomDetailRoundStartChatMsgItem from "./WrRoomDetailRoundStartChatMsgItem";
import WrRoomDetailRoundScoreChatMsgItem from "./WrRoomDetailRoundScoreChatMsgItem";
import { DiscriminatedChatMsgDetail, TextChatMsgDetail } from "src/types";

interface Props {
  chatMsgs: [DiscriminatedChatMsgDetail, ...DiscriminatedChatMsgDetail[]];
}

const WrRoomDetailChatMsgItem = ({ chatMsgs }: Props): JSX.Element | null => {
  const [chatMsg] = chatMsgs;
  switch (chatMsg.type) {
    case ChatMsgContentType.TEXT:
      return <WrRoomDetailTextChatMsgItem chatMsgs={chatMsgs as [TextChatMsgDetail, ...TextChatMsgDetail[]]} />;
    case ChatMsgContentType.ROUND_START:
      return <WrRoomDetailRoundStartChatMsgItem chatMsg={chatMsg} />;
    case ChatMsgContentType.ROUND_SCORE:
      return <WrRoomDetailRoundScoreChatMsgItem chatMsg={chatMsg} />;
    default:
      return null;
  }
};

export default WrRoomDetailChatMsgItem;
