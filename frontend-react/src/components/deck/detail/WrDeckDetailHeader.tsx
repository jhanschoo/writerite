import React, { useState, MouseEvent } from 'react';
import { withRouter, RouteComponentProps } from 'react-router';

import { useMutation } from '@apollo/react-hooks';
import { printApolloError } from '../../../util';
import { ROOM_CREATE_MUTATION } from '../sharedGql';
import { RoomCreate, RoomCreateVariables } from '../gqlTypes/RoomCreate';
import { WrDeckDetail } from '../../../client-models/gqlTypes/WrDeckDetail';

import styled from 'styled-components';
import List from '../../../ui/list/List';
import Item from '../../../ui/list/Item';
import { Button } from '../../../ui/Button';

import WrDeckDetailSettings from './WrDeckDetailSettings';
import WrDeckDetailDeletePrompt from './WrDeckDetailDeletePrompt';

enum ActiveAction {
  NONE,
  SETTINGS,
  DELETE,
}

const HeaderDiv = styled.div`
  ${({ theme }) => theme.fgbg[2]}
`;

const DeckHeader = styled.header`
display: flex;
flex-direction: column;
align-items: center;
padding: ${({ theme }) => theme.space[3]} 12.5%;
@media (max-width: ${({ theme }) => theme.breakpoints[1]}) {
  padding: ${({ theme }) => theme.space[1]} ${({ theme }) => theme.space[2]};
}
`;

const DeckHeading = styled.h2`
margin: 0;
text-align: center;
font-size: 250%;
`;

const ActionTray = styled(List)`
flex-direction: row;
flex-wrap: wrap;
padding: 0 ${({ theme }) => theme.space[3]} ${({ theme }) => theme.space[3]} ${({ theme }) => theme.space[3]};
@media (max-width: ${({ theme }) => theme.breakpoints[1]}) {
  padding: 0 ${({ theme }) => theme.space[1]} ${({ theme }) => theme.space[1]} ${({ theme }) => theme.space[1]};
}
`;

const ActionTrayItem = styled(Item)`
flex-grow: 1;
flex-basis: 0;
padding: ${({ theme }) => theme.space[2]};
@media (max-width: ${({ theme }) => theme.breakpoints[1]}) {
  width: 50%;
}
`;

const StyledButton = styled(Button)`
width: 100%;
flex-direction: column;
padding: ${({ theme }) => theme.space[2]};
`;

interface OwnProps {
  deck: WrDeckDetail;
}

type Props = OwnProps & RouteComponentProps;

const WrDeckDetailHeader = ({ deck, history }: Props) => {
  const [activeAction, setActiveAction] = useState(ActiveAction.NONE);
  const handleCompletedCreateRoom = (roomCreate: RoomCreate) => {
    if (roomCreate === null || roomCreate.rwRoomCreate === null) {
      return;
    }
    history.push(`/room/${roomCreate.rwRoomCreate.id}`);
  };
  const [mutate] = useMutation<RoomCreate, RoomCreateVariables>(
      ROOM_CREATE_MUTATION, {
      onError: printApolloError,
      onCompleted: handleCompletedCreateRoom,
    },
  );
  const toggleSettings =
    (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setActiveAction((activeAction === ActiveAction.SETTINGS)
      ? ActiveAction.NONE
      : ActiveAction.SETTINGS,
    );
  };
  const toggleDelete =
    (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setActiveAction((activeAction === ActiveAction.DELETE)
      ? ActiveAction.NONE
      : ActiveAction.DELETE,
    );
  };
  const handleCreateRoom = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    mutate({
      variables: {
        config: {
          deckId: deck.id,
          deckName: deck.name,
          deckNameLang: deck.nameLang,
        },
      },
    });
  };
  return (
    <HeaderDiv>
      <DeckHeader><DeckHeading>{deck.name}</DeckHeading></DeckHeader>
      <ActionTray>
        <ActionTrayItem>
          <StyledButton
            onClick={handleCreateRoom}
          >
            Serve
          </StyledButton>
        </ActionTrayItem>
        <ActionTrayItem>
          <StyledButton
            onClick={toggleSettings}
            className={activeAction === ActiveAction.SETTINGS ? 'active' : undefined}
          >
            Settings
          </StyledButton>
        </ActionTrayItem>
        <ActionTrayItem>
          <StyledButton
            onClick={toggleDelete}
            className={activeAction === ActiveAction.DELETE ? 'active' : undefined}
          >
            Delete
          </StyledButton>
        </ActionTrayItem>
      </ActionTray>
      {activeAction === ActiveAction.SETTINGS && <WrDeckDetailSettings deck={deck} />}
      {activeAction === ActiveAction.DELETE && <WrDeckDetailDeletePrompt deck={deck} />}
    </HeaderDiv>
  );
};

export default withRouter(WrDeckDetailHeader);
