import React from 'react';

import styled from 'styled-components';
import Item from '../../ui/list/Item';
import { IRoomConfig } from '../../client-models/WrRoomStub';

interface Props {
  config: IRoomConfig;
}

const MessageItem = styled(Item)`
display: flex;
flex-direction: column;
background: ${({ theme }) => theme.colors.heterogBg};
border-radius: 4px;
margin: ${({ theme }) => theme.space[1]} 0;
padding: 0 ${({ theme }) => theme.space[2]};
`;

const CommentText = styled.p`
margin: 0;
padding: ${({ theme }) => theme.space[2]} 0;
`;

const WrRoomMessageConfigItem = ({ config }: Props) => {
  const {
    deckName, deckNameLang, roundLength,
  } = config;
  if (roundLength === undefined || roundLength === null) {
    // display config message
    return (
      <MessageItem>
        <CommentText>
          Hi! We're about to begin a room serving
          <span lang={deckNameLang}>{' ' + deckName || ' a deck'}</span>.
          The room owner will now configure how the deck is going to be
          served. They also have the opportunity to invite other
          participants into the room before starting.
        </CommentText>
      </MessageItem>
    );
  }
  return null;
};

export default WrRoomMessageConfigItem;