import React, { useState, MouseEvent } from 'react';

import { Query, QueryResult, Mutation, MutationFn, MutationResult } from 'react-apollo';
import { printApolloError } from '../../../util';
import { DECK_DETAIL_QUERY, DeckDetailData, DeckDetailVariables } from '../gql';
import { ROOM_CREATE_MUTATION, RoomCreateData, RoomCreateVariables } from '../../room/gql';

import styled from 'styled-components';
import FlexMain from '../../../ui/layout/FlexMain';
import WrCardsList from '../../card/WrCardsList';
import WrNewCardPrompt from '../../card/WrNewCardPrompt';
import WrDetailHeader from './WrDetailHeader';
import WrDetailPanel from './WrDetailPanel';
import WrDetailButtons from './WrDetailButtons';
import WrDeckDetailSH from './WrDeckDetailSH';

import { withRouter, RouteComponentProps } from 'react-router';

export enum CurrentAddNewEnum {
  SUBDECK,
  TEMPLATE,
  CARD,
  NONE,
}

const CenteredP = styled.p`
  text-align: center;
`;

const WrDeckDetail = (props: RouteComponentProps<{ deckId: string }>) => {
  const { history, match } = props;
  const { deckId } = match.params;
  const [showSettings, setShowSettings] = useState(false);
  const [showSubDecks, setShowSubDecks] = useState(false);
  const [showTemplates, setShowTemplates] = useState(false);
  const [showCards, setShowCards] = useState(true);
  const [currentAddNew, setCurrentAddNew] = useState(CurrentAddNewEnum.CARD);
  const toggleSettings =
    (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setShowSettings(!showSettings);
  };
  const renderDeck = ({
    subscribeToMore, loading, error, data,
  }: QueryResult<DeckDetailData, DeckDetailVariables>) => {
    if (error) {
      return null;
    }
    if (loading) {
      return (
        <CenteredP>
          Retrieving deck...
        </CenteredP>
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
    const renderHeader = (
      mutate: MutationFn<RoomCreateData, RoomCreateVariables>,
      { loading: createRoomLoading }: MutationResult<RoomCreateData>,
    ) => {
      const handleCreateRoom = (e: MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        mutate({
          variables: { deckId: deck.id },
        });
      };
      return (
        <WrDetailHeader
          name={name}
          toggleSettings={toggleSettings}
          handleCreateRoom={handleCreateRoom}
        />
      );
    };
    const handleCompletedCreateRoom = (roomCreateData: RoomCreateData) => {
      if (roomCreateData === null || roomCreateData.rwRoomCreate === null) {
        return;
      }
      history.push(`/room/${roomCreateData.rwRoomCreate.id}`);
    };
    return (
      <>
        {
          // tslint:disable-next-line: jsx-no-multiline-js
          // https://github.com/apollographql/apollo-client/issues/4246
          // @ts-ignore
          <WrDeckDetailSH subscribeToMore={subscribeToMore} deckId={deckId} />
        }
        <Mutation<RoomCreateData, RoomCreateVariables>
          mutation={ROOM_CREATE_MUTATION}
          onError={printApolloError}
          onCompleted={handleCompletedCreateRoom}
        >
          {renderHeader}
        </Mutation>
        {showSettings && <WrDetailPanel deck={deck} />}
        <WrDetailButtons
          showSubDecks={showSubDecks}
          setShowSubDecks={setShowSubDecks}
          showTemplates={showTemplates}
          setShowTemplates={setShowTemplates}
          showCards={showCards}
          setShowCards={setShowCards}
          currentAddNew={currentAddNew}
          setCurrentAddNew={setCurrentAddNew}
          deck={deck}
        />
        {(currentAddNew === CurrentAddNewEnum.CARD) && <WrNewCardPrompt deckId={deckId} />}
        {showTemplates && <WrCardsList cards={templates} promptLang={promptLang} answerLang={answerLang} />}
        {showCards && <WrCardsList cards={cards} promptLang={promptLang} answerLang={answerLang} />}
      </>
    );
  };
  return (
    <FlexMain>
      <Query<DeckDetailData, DeckDetailVariables>
        query={DECK_DETAIL_QUERY}
        variables={{deckId}}
        onError={printApolloError}
      >
        {renderDeck}
      </Query>
    </FlexMain>
  );
};

export default withRouter(WrDeckDetail);
