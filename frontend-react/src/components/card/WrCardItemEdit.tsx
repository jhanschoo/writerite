import React, { useState, ChangeEvent, FormEvent, KeyboardEvent, MouseEvent } from 'react';
import { Plus, X } from 'react-feather';

import { gql } from 'graphql.macro';
import { useMutation } from '@apollo/react-hooks';
import { printApolloError } from '../../util';
import { WR_CARD } from '../../client-models/WrCard';
import { WrCard } from '../../client-models/gqlTypes/WrCard';
import { CardEditVariables, CardEdit } from './gqlTypes/CardEdit';

import styled, { StyledComponent } from 'styled-components';
import TextInput from '../../ui/form/TextInput';
import { Button, BorderlessButton } from '../../ui/form/Button';

const CARD_EDIT_MUTATION = gql`
${WR_CARD}
mutation CardEdit(
  $id: ID!,
  $prompt: String,
  $fullAnswer: String,
  $sortKey: String,
  $answers: [String!],
  $template: Boolean,
) {
  rwCardEdit(
    id: $id,
    prompt: $prompt,
    fullAnswer: $fullAnswer,
    sortKey: $sortKey,
    answers: $answers,
    template: $template,
  ) {
    ...WrCard
  }
}
`;

interface Props {
  toggleEdit: () => void;
  promptLang: string;
  answerLang: string;
  card: WrCard;
}

const StyledFrom = styled.form`
  display: flex;
  flex-direction: column;
`;

const CardFieldset = styled.fieldset`
  display: flex;
  flex-direction: column;
  width: 100%;
  padding: 0;
  margin: 0;
  border: none;
`;

const LowercaseLabel = styled.label`
  font-weight: normal;
  font-size: 75%;
  text-transform: lowercase;
  margin: 0;
  padding: 0 ${({ theme }) => theme.space[2]};
  color: ${({ theme }) => theme.colors.fg2};
`;

const StyledTextInput = styled(TextInput)`
  margin: ${({ theme }) => theme.space[1]} 0;
  width: 100%;
`;

const AnswersFieldset = styled.fieldset`
  display: flex;
  flex-wrap: wrap;
  width: 100%;
  padding: 0;
  margin: 0;
  border: none;
`;

const LowercaseLegend = styled(LowercaseLabel)`
  width: 100%;
` as StyledComponent<'legend', any, {}, never>;

const NewAcceptedAnswerDiv = styled.div`
  display: flex;
  flex-direction: column;
  margin: ${({ theme }) => theme.space[1]};
  padding: ${({ theme }) => theme.space[1]};
  border-radius: 2px;
  background: ${({ theme }) => theme.colors.bg0};
  width: 100%;
`;

const NewAcceptedAnswerSubdiv = styled.div`
  display: flex;
`;

const AnswersP = styled.p`
  display: flex;
  margin: ${({ theme }) => theme.space[1]};
  padding: ${({ theme }) => theme.space[1]};
  border-radius: 2px;
  background: ${({ theme }) => theme.colors.bg0};
  font-size: 75%;
`;

const PlusButton = styled(BorderlessButton)`
  margin: ${({ theme }) => theme.space[1]};
  padding: ${({ theme }) => theme.space[1]};
`;

const DeleteAnswerButton = styled(BorderlessButton)`
  margin-left: 2em;
`;

const SubmitDiv = styled.div`
  display: flex;
  justify-content: center;
`;

const CancelButton = styled(BorderlessButton)`
  padding: ${({ theme }) => theme.space[1]} ${({ theme }) => theme.space[2]};
  margin: ${({ theme }) => theme.space[1]};
`;

const SubmitButton = styled(Button)`
  padding: ${({ theme }) => theme.space[1]} ${({ theme }) => theme.space[2]};
  margin: ${({ theme }) => theme.space[1]};
`;

const WrCardItemEdit = (props: Props) => {
  const { toggleEdit, promptLang, answerLang } = props;
  const { id, prompt, fullAnswer, sortKey, answers } = props.card;
  const [promptInput, setPromptInput] = useState(prompt);
  const [fullAnswerInput, setFullAnswerInput] = useState(fullAnswer);
  const [newAnswerInput, setNewAnswerInput] = useState('');
  const [newAnswers, setNewAnswers] = useState(answers);
  const promptId = id + '-prompt';
  const fullAnswerId = id + '-full-answer';
  const newAnswerId = id + '-new-answer';
  const addAnswer = () => {
    setNewAnswers(newAnswers.concat([newAnswerInput]));
    setNewAnswerInput('');
  };
  const handlePromptChange = (e: ChangeEvent<HTMLInputElement>) => {
    setPromptInput(e.target.value);
  };
  const handleFullAnswerChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFullAnswerInput(e.target.value);
  };
  const handleNewAnswerChange = (e: ChangeEvent<HTMLInputElement>) => {
    setNewAnswerInput(e.target.value);
  };
  const handleAddNewAnswer = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    addAnswer();
  };
  const handleAnswersDelete = (i: number) => (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setNewAnswers(newAnswers.filter((_v, j) => i !== j));
  };
  const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    const { key } = e;
    if (key === 'Escape' || key === 'Esc') {
      e.preventDefault();
      toggleEdit();
    }
  };
  const handleNewAnswerKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    const { key } = e;
    if (key === 'Enter') {
      e.preventDefault();
      addAnswer();
    }
    if (key === 'Escape' || key === 'Esc') {
      e.preventDefault();
      toggleEdit();
    }
  };
  const handleCancelButton = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    toggleEdit();
  };
  const formattedAnswers = newAnswers.map((answer, i) => (
    <AnswersP key={i}>
      {answer}
      <DeleteAnswerButton
        aria-label="Delete"
        onClick={handleAnswersDelete(i)}
      >
        <X size={12} />
      </DeleteAnswerButton>
    </AnswersP>
  ));
  const [mutate, { loading }] = useMutation<CardEdit, CardEditVariables>(
    CARD_EDIT_MUTATION, {
      onError: printApolloError,
    },
  );
  const handleUpdate = () => mutate({
    variables: {
      id,
      prompt: promptInput,
      fullAnswer: fullAnswerInput,
      answers: newAnswers,
      sortKey,
    },
  }).then(() => toggleEdit());
  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    handleUpdate();
  };
  return (
    <StyledFrom onSubmit={handleSubmit}>
      <CardFieldset lang={promptLang}>
        <LowercaseLabel htmlFor={promptId}>Prompt</LowercaseLabel>
        <StyledTextInput
          id={promptId}
          value={promptInput}
          onChange={handlePromptChange}
          onKeyDown={handleKeyDown}
          disabled={loading}
        />
      </CardFieldset>
      <CardFieldset lang={answerLang}>
        <LowercaseLabel htmlFor={fullAnswerId}>Displayed Answer</LowercaseLabel>
        <StyledTextInput
          id={fullAnswerId}
          value={fullAnswerInput}
          onChange={handleFullAnswerChange}
          onKeyDown={handleKeyDown}
          disabled={loading}
        />
      </CardFieldset>
      <AnswersFieldset>
        <LowercaseLegend as="legend">Accepted Answers</LowercaseLegend>
        <NewAcceptedAnswerDiv>
          <LowercaseLabel htmlFor={newAnswerId}>Add a new accepted answer</LowercaseLabel>
          <NewAcceptedAnswerSubdiv>
            <StyledTextInput
              id={newAnswerId}
              value={newAnswerInput}
              onChange={handleNewAnswerChange}
              onKeyDown={handleNewAnswerKeyDown}
              disabled={loading}
            />
            <PlusButton onClick={handleAddNewAnswer}>
              <Plus size={16} />
            </PlusButton>
          </NewAcceptedAnswerSubdiv>
        </NewAcceptedAnswerDiv>
        {formattedAnswers}
      </AnswersFieldset>
      <SubmitDiv>
        <CancelButton
          onClick={handleCancelButton}
          disabled={loading}
        >
          Cancel
        </CancelButton>
        <SubmitButton type="submit">
          Save Changes
        </SubmitButton>
      </SubmitDiv>
    </StyledFrom>
  );
};

export default WrCardItemEdit;
