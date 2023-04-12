import React from "react";

import { wrStyled } from "src/theme";
import { Item } from "src/ui";

import { TextChatMsgDetail } from "src/types";

const MsgItem = wrStyled(Item)`
margin: ${({ theme: { space } }) => `0 ${space[4]}`};
`;

const SenderItem = wrStyled(Item)`
margin: ${({ theme: { space } }) => `${space[2]} ${space[4]} 0 ${space[4]}`};
font-weight: bold;
`;

interface Props {
  chatMsgs: [TextChatMsgDetail, ...TextChatMsgDetail[]];
}

const WrRoomDetailTextChatMsgItem = ({ chatMsgs }: Props): JSX.Element => {
  const [{ sender }] = chatMsgs;
  // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
  const senderName = sender?.name || sender?.email;
  const items = chatMsgs.map(({ id, content }) => (
    <MsgItem key={id}>{content}</MsgItem>
  ));
  return (
    <>
      {sender && <SenderItem key={sender.id}>{senderName ?? ""}</SenderItem>}
      {items}
    </>
  );
};

export default WrRoomDetailTextChatMsgItem;
