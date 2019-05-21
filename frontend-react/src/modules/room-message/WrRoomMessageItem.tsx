import React from 'react';
import { WrRoomMessage } from './types';

import styled from 'styled-components';
import Item from '../../ui/list/Item';

interface Props {
  message: WrRoomMessage;
}

const MessageItem = styled(Item)`
background: ${({ theme }) => theme.colors.heterogBg};
border-radius: 4px;
margin: ${({ theme }) => theme.space[1]} 0;
padding: 0 ${({ theme }) => theme.space[2]};
`;

const TextContent = styled.div`
display: flex;
flex-direction: column;
`;

const CommentHeader = styled.div`
display: flex;
padding: ${({ theme }) => theme.space[2]} 0 0 0;
`;

const CommentAuthor = styled.h5`
margin: 0;
font-size: 100%;
`;

const CommentText = styled.p`
margin: 0;
padding: ${({ theme }) => theme.space[2]} 0;
`;

const WrRoomMessageItem = (props: Props) => {
  const { message } = props;
  return (
    <MessageItem>
      <TextContent>
        <CommentHeader>
          <CommentAuthor>{message.sender.email}</CommentAuthor>
        </CommentHeader>
        <CommentText>
          {message.content}
        </CommentText>
      </TextContent>
    </MessageItem>
  );
};

export default WrRoomMessageItem;
