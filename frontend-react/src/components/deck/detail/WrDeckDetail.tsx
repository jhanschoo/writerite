import React, { useState, MouseEvent } from 'react';
import { Play, Copy, Settings, Trash } from 'react-feather';

import { gql } from 'graphql.macro';
import { useQuery, useMutation } from '@apollo/react-hooks';
import { printApolloError } from '../../../util';

import styled from 'styled-components';
import FlexMain from '../../../ui/layout/FlexMain';
import List from '../../../ui/list/List';
import Item from '../../../ui/list/Item';
import WrCardsList from '../../card/WrCardsList';
import WrNewCardPrompt from '../../card/WrNewCardPrompt';
import HDivider from '../../../ui/HDivider';
import { BorderlessButton } from '../../../ui/form/Button';

import WrDeckDetailSettings from './WrDeckDetailSettings';
import WrDeckDetailDeletePrompt from './WrDeckDetailDeletePrompt';
import WrDeckDetailSH from './WrDeckDetailSH';

import { withRouter, RouteComponentProps } from 'react-router';

import { WrDeckDetail, IWrDeckDetail } from '../../../models/WrDeckDetail';
import { WrRoom, IWrRoom } from '../../../models/WrRoom';
import { IRoomConfig } from '../../../models/WrRoomStub';

const DECK_DETAIL_QUERY = gql`
${WrDeckDetail}
query Deck($deckId: ID!) {
  rwDeck(id: $deckId) {
    ...WrDeckDetail
  }
}
`;

interface DeckDetailVariables {
  readonly deckId: string;
}

export interface DeckDetailData {
  readonly rwDeck: IWrDeckDetail | null;
}

const ROOM_CREATE_MUTATION = gql`
${WrRoom}
mutation RoomCreate(
  $config: IRoomConfigInput!
) {
  rwRoomCreate(
    config: $config
  ) {
    ...WrRoom
  }
}
`;

interface RoomCreateVariables {
  readonly config: IRoomConfig;
}

interface RoomCreateData {
  readonly rwRoomCreate: IWrRoom | null;
}

enum ActiveAction {
  NONE,
  SETTINGS,
  DELETE,
}

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
  padding: ${({ theme }) => theme.space[3]};
  @media (max-width: ${({ theme }) => theme.breakpoints[1]}) {
    padding: ${({ theme }) => theme.space[1]};
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

const BigButton = styled(BorderlessButton)`
  width: 100%;
  flex-direction: column;
  padding: ${({ theme }) => theme.space[2]};
`;

const CenteredP = styled.p`
  text-align: center;
`;

const WrDeckDetailComponent = (props: RouteComponentProps<{ deckId: string }>) => {
  const { history, match } = props;
  const { deckId } = match.params;
  const [activeAction, setActiveAction] = useState(ActiveAction.NONE);
  const handleCompletedCreateRoom = (roomCreateData: RoomCreateData) => {
    if (roomCreateData === null || roomCreateData.rwRoomCreate === null) {
      return;
    }
    history.push(`/room/${roomCreateData.rwRoomCreate.id}`);
  };
  const {
    loading, error, data, subscribeToMore,
  } = useQuery<DeckDetailData, DeckDetailVariables>(DECK_DETAIL_QUERY, {
    variables: { deckId },
    onError: printApolloError,
  });
  const [
    mutate, { loading: createRoomLoading },
  ] = useMutation<RoomCreateData, RoomCreateVariables>(
      ROOM_CREATE_MUTATION, {
      onError: printApolloError,
      onCompleted: handleCompletedCreateRoom,
    },
  );
  if (error) {
    return (<FlexMain/>);
  }
  if (loading) {
    return (
      <FlexMain>
        <CenteredP>
          Retrieving deck...
        </CenteredP>
      </FlexMain>
    );
  }
  if (!data || !data.rwDeck) {
    return (
      <CenteredP>
        Error retrieving deck. Please try again later.
      </CenteredP>
    );
  }
  const deck = data.rwDeck;
  const { name, promptLang, answerLang } = deck;
  const templates = data.rwDeck.cards.filter((card) => card.template);
  const cards = data.rwDeck.cards.filter((card) => !card.template);
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
    <>
      {
        // tslint:disable-next-line: jsx-no-multiline-js
        // https://github.com/apollographql/apollo-client/issues/4246
        // @ts-ignore
        <WrDeckDetailSH subscribeToMore={subscribeToMore} deckId={deckId} />
      }
      <DeckHeader><DeckHeading>{name}</DeckHeading></DeckHeader>
      <ActionTray>
        <ActionTrayItem>
          <BigButton
            onClick={handleCreateRoom}
            disabled={loading || createRoomLoading}
          >
            <Play size={32} />
            Serve
          </BigButton>
        </ActionTrayItem>
        <ActionTrayItem>
          <BigButton
            disabled={loading || createRoomLoading}
          >
            <Copy size={32} />
            Duplicate
          </BigButton>
        </ActionTrayItem>
        <ActionTrayItem>
          <BigButton
            onClick={toggleSettings}
            className={activeAction === ActiveAction.SETTINGS ? 'active' : undefined}
            disabled={loading || createRoomLoading}
          >
            <Settings size={32} />
            Settings
          </BigButton>
        </ActionTrayItem>
        <ActionTrayItem>
          <BigButton
            onClick={toggleDelete}
            className={activeAction === ActiveAction.DELETE ? 'active' : undefined}
            disabled={loading || createRoomLoading}
          >
            <Trash size={32} />
            Delete
          </BigButton>
        </ActionTrayItem>
      </ActionTray>
      {activeAction === ActiveAction.SETTINGS && <WrDeckDetailSettings deck={deck} />}
      {activeAction === ActiveAction.DELETE && <WrDeckDetailDeletePrompt deck={deck} />}
      <HDivider>{templates.length} Sub-Decks</HDivider>
      <HDivider>{templates.length} Template Cards</HDivider>
      <WrCardsList cards={templates} promptLang={promptLang} answerLang={answerLang} />
      <HDivider>{cards.length} Cards</HDivider>
      <WrNewCardPrompt deckId={deckId} />
      <WrCardsList cards={cards} promptLang={promptLang} answerLang={answerLang} />
    </>
  );
};

export default withRouter(WrDeckDetailComponent);
