import gql from "graphql-tag";

export const WR_CHAT_MSG_SCALARS = gql`
fragment WrChatMsgScalars on ChatMsg {
  id
  roomId
  senderId
  type
  content
}
`;
