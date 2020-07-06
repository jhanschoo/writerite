import React from 'react';

import { WrRoomScalars_config } from '../../client-models/gqlTypes/WrRoomScalars';

import styled from 'styled-components';
import Item from '../../ui/list/Item';

interface Props {
  config: WrRoomScalars_config;
}

const MessageItem = styled(Item)`
display: flex;
flex-direction: column;
background: ${({ theme }) => theme.color.heterogBg};
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
    deckName, roundLength,
  } = config;
  if (roundLength === undefined || roundLength === null) {
    // display config message
    // TODO: fix lang
    return (
      <MessageItem>
        <CommentText>
          Hi! We're about to begin a room serving
          <span lang={undefined}>{' ' + deckName || ' a deck'}</span>.
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
