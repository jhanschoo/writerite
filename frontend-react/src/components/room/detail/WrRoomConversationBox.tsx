import React, { useLayoutEffect, useRef, useState, UIEvent, ReactNode } from 'react';

import styled from 'styled-components';
import List from '../../../ui/list/List';
import Item from '../../../ui/list/Item';

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

interface Props {
  children: ReactNode;
}

const WrRoomConversationBox = ({ children }: Props) => {
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
  }, [children, fixToBottom]);
  const handleScroll = (e: UIEvent<HTMLUListElement>) => {
    const { current } = conversationEl;
    if (!current) {
      return;
    }
    if (current.scrollTop + current.clientHeight >= current.scrollHeight) {
      return setFixToBottom(true);
    }
    return setFixToBottom(false);
  };
  return (
    <ConversationBox onScroll={handleScroll} ref={conversationEl}>
      <Spacer />
      {children}
    </ConversationBox>
  );
};

export default WrRoomConversationBox;
