import gql from "graphql-tag";

export const CHAT_MSG_SCALARS = gql`
  fragment ChatMsgScalars on ChatMsg {
    id
    roomId
    senderId
    type
    content
    createdAt
  }
`;
