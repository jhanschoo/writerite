import React, { useState, MouseEvent } from 'react';
import { Edit } from 'react-feather';
import moment from 'moment';

import { WrCard } from '../../client-models/gqlTypes/WrCard';

import styled from 'styled-components';
import HDivider from '../../ui/HDivider';
import List from '../../ui/list/List';
import Item from '../../ui/list/Item';
import CardAuxillaryButton from './CardAuxillaryButton';

import WrDuplicateCardButton from './WrDuplicateCardButton';
import WrDeleteCardButton from './WrDeleteCardButton';
import WrCardItemEdit from './WrCardItemEdit';

interface Props {
  deckId: string;
  promptLang: string;
  answerLang: string;
  card: WrCard;
}

const Header = styled.header`
  display: flex;
  justify-content: space-between;
  padding: ${({ theme }) => theme.space[1]} 0;
`;

const Card = styled.section`
  margin: ${({ theme }) => theme.space[1]} ${({ theme }) => theme.space[0]};
  padding: ${({ theme }) => theme.space[2]} ${({ theme }) => theme.space[3]};
  display: flex;
  flex-direction: column;
  border-radius: 8px;
  .auxillary {
    visibility: hidden;
  }
  :hover, &.active {
    background: ${({ theme }) => theme.colors.bg2};
  }

  :hover .auxillary {
    visibility: visible;
  }
`;

const EditNoticeText = styled.span`
  color: ${({ theme }) => theme.colors.fg2};
  font-size: 75%;
`;

const CardMainField = styled.div`
  width: 100%;
`;

const LowercaseHeader = styled.h4`
  font-weight: normal;
  font-size: 75%;
  text-transform: lowercase;
  margin: 0;
  color: ${({ theme }) => theme.colors.fg2};
`;

const AnswersDisplayDiv = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: baseline;
`;

const AnswersP = styled.p`
  display: flex;
  margin: ${({ theme }) => theme.space[1]};
  padding: ${({ theme }) => theme.space[1]};
  border-radius: 2px;
  background: ${({ theme }) => theme.colors.bg0};
  font-size: 75%;
`;

const StyledParagraph = styled.p`
  margin: 0;
  padding: ${({ theme }) => theme.space[1]} 0;
`;

const EditDividerDiv = styled.div`
  margin: ${({ theme }) => theme.space[1]} 0;
`;

const WrCardItem = (props: Props) => {
  const { deckId, promptLang, answerLang, card } = props;
  const { id, prompt, fullAnswer, answers, sortKey, editedAt, template } = card;
  const lastEditedNotice = `last edited ${moment(editedAt).fromNow()}`;
  const [edit, setEdit] = useState(false);
  const toggleEdit = () => {
    setEdit(!edit);
  };
  const handleEditButton = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    toggleEdit();
  };
  const formattedAnswers = answers.map((answer, i) => (
    <AnswersP key={i}>{answer}</AnswersP>
  ));
  const optionalAnswers = (answers.length === 0) ? null : (
    <CardMainField lang={answerLang}>
      <LowercaseHeader>Accepted Answers</LowercaseHeader>
      <AnswersDisplayDiv>{formattedAnswers}</AnswersDisplayDiv>
    </CardMainField>
  );
  const optionalEdit = edit && (
    <>
      <EditDividerDiv>
        <HDivider spacerColor="lightLightEdge" />
      </EditDividerDiv>
      <WrCardItemEdit
        promptLang={promptLang}
        answerLang={answerLang}
        card={card}
        toggleEdit={toggleEdit}
      />
    </>
  );
  return (
    <Card className={edit ? 'active' : undefined}>
      <Header>
        <EditNoticeText>
          <em>{lastEditedNotice}</em>
        </EditNoticeText>
        <List>
          <Item>
            <CardAuxillaryButton
              className="auxillary"
              onClick={handleEditButton}
            >
              <Edit size={16} />
            </CardAuxillaryButton>
          </Item>
          <Item>
            <WrDuplicateCardButton
              deckId={deckId}
              prompt={prompt}
              fullAnswer={fullAnswer}
              sortKey={sortKey}
              template={template}
            />
          </Item>
          <Item>
            <WrDeleteCardButton cardId={id} />
          </Item>
        </List>
      </Header>
      <HDivider spacerColor="lightLightEdge" />
      <CardMainField lang={promptLang}>
        <LowercaseHeader>Prompt</LowercaseHeader>
        <StyledParagraph>{prompt}</StyledParagraph>
      </CardMainField>
      <CardMainField lang={answerLang}>
        <LowercaseHeader>Displayed Answer</LowercaseHeader>
        <StyledParagraph>{fullAnswer}</StyledParagraph>
      </CardMainField>
      {optionalAnswers}
      {optionalEdit}
    </Card>
  );
};

export default WrCardItem;
