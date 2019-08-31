import React, { useState } from 'react';
import moment from 'moment';

import { WrCard } from '../../client-models/gqlTypes/WrCard';

import styled from 'styled-components';
import WrCardItemEdit from './WrCardItemEdit';
import WrCardActions from './WrCardActions';

const Card = styled.section`
margin: ${({ theme }) => theme.space[1]} ${({ theme }) => theme.space[0]};
padding: ${({ theme }) => theme.space[2]} ${({ theme }) => theme.space[3]};
display: flex;
flex-direction: column;
${({ theme }) => theme.fgbg[4]}
:hover, &.active {
  ${({ theme }) => theme.fgbg[2]}
}
`;

const Header = styled.header`
display: flex;
align-items: center;
justify-content: space-between;
padding: 0;
`;

const EditNoticeText = styled.span`
color: ${({ theme }) => theme.color.deemphasizedFg};
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
color: ${({ theme }) => theme.color.fg2};
`;

const AnswersDisplayDiv = styled.div`
display: flex;
margin: 0 -${({ theme }) => theme.space[1]};
flex-wrap: wrap;
align-items: center;
`;

const AnswersP = styled.p`
display: flex;
margin: ${({ theme }) => theme.space[1]};
padding: ${({ theme }) => theme.space[1]};
border: 1px solid ${({ theme }) => theme.edge[1]};
font-size: 75%;
`;

const StyledParagraph = styled.p`
margin: 0;
padding: ${({ theme }) => theme.space[1]} 0;
`;

interface Props {
  deckId: string;
  promptLang: string;
  answerLang: string;
  card: WrCard;
}

const WrCardItem = ({ deckId, promptLang, answerLang, card }: Props) => {
  const { prompt, fullAnswer, answers, editedAt } = card;
  const lastEditedNotice = `last edited ${moment(editedAt).fromNow()}`;
  const [edit, setEdit] = useState(false);
  const toggleEdit = () => {
    setEdit(!edit);
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
    <WrCardItemEdit
      promptLang={promptLang}
      answerLang={answerLang}
      card={card}
      toggleEdit={toggleEdit}
    />
  );
  const optionalDisplay = !edit && (
    <>
      <CardMainField lang={promptLang}>
        <LowercaseHeader>Prompt</LowercaseHeader>
        <StyledParagraph>{prompt}</StyledParagraph>
      </CardMainField>
      <CardMainField lang={answerLang}>
        <LowercaseHeader>Displayed Answer</LowercaseHeader>
        <StyledParagraph>{fullAnswer}</StyledParagraph>
      </CardMainField>
      {optionalAnswers}
    </>
  );
  return (
    <Card className={edit ? 'active' : undefined}>
      <Header>
        <EditNoticeText>
          {lastEditedNotice}
        </EditNoticeText>
        <WrCardActions
          deckId={deckId}
          card={card}
          editActive={edit}
          toggleEdit={toggleEdit}
        />
      </Header>
      {optionalEdit}
      {optionalDisplay}
    </Card>
  );
};

export default WrCardItem;
