import React, { useState, KeyboardEvent, ChangeEvent, FormEvent } from 'react';

import { gql } from 'graphql.macro';
import { Mutation, MutationFn, MutationResult } from 'react-apollo';
import { printApolloError } from '../../util';
import { WrCard, IWrCard } from '../../models/WrCard';

import styled from 'styled-components';
import TextInput from '../../ui/form/TextInput';
import { BorderlessButton } from '../../ui/form/Button';

const CARD_EDIT_MUTATION = gql`
${WrCard}
mutation CardEdit(
  $id: ID!,
  $prompt: String,
  $fullAnswer: String,
  $sortKey: String,
  $template: Boolean,
) {
  rwCardEdit(
    id: $id,
    prompt: $prompt,
    fullAnswer: $fullAnswer,
    sortKey: $sortKey,
    template: $template,
  ) {
    ...WrCard
  }
}
`;

interface CardEditVariables {
  readonly id: string;
  readonly prompt?: string;
  readonly fullAnswer?: string;
  readonly sortKey?: string;
  readonly template?: boolean;
}

interface CardEditData {
  readonly rwCardEdit: IWrCard | null;
}

interface Props {
  stopEdit: () => void;
  promptLang: string;
  answerLang: string;
  card: IWrCard;
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

const StyledButton = styled(BorderlessButton)`
  text-transform: uppercase;
  font-size: 87.5%;
`;

const WrCardItemEdit = (props: Props) => {
  const { stopEdit, promptLang, answerLang } = props;
  const { id, prompt, fullAnswer, sortKey } = props.card;
  const [promptInput, setPromptInput] = useState(prompt);
  const [fullAnswerInput, setFullAnswerInput] = useState(fullAnswer);
  const handlePromptChange = (e: ChangeEvent<HTMLInputElement>) => {
    setPromptInput(e.target.value);
  };
  const handleFullAnswerChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFullAnswerInput(e.target.value);
  };
  const renderCardItemEdit = (
    mutate: MutationFn<CardEditData, CardEditVariables>,
    { loading }: MutationResult<CardEditData>,
  ) => {
    const handleUpdate = () => mutate({
      variables: {
        id,
        prompt: promptInput,
        fullAnswer: fullAnswerInput,
        sortKey,
      },
    }).then(() => stopEdit());
    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      handleUpdate();
    };
    const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
      const { key } = e;
      // if (key === 'Enter') {
      //   e.preventDefault();
      //   handleUpdate();
      // }
      if (key === 'Escape' || key === 'Esc') {
        e.preventDefault();
        stopEdit();
      }
    };
    return (
      <StyledFrom onSubmit={handleSubmit}>
        <CardFieldset lang={promptLang}>
          <LowercaseLabel>Prompt</LowercaseLabel>
          <StyledTextInput
            value={promptInput}
            onChange={handlePromptChange}
            onKeyDown={handleKeyDown}
          />
        </CardFieldset>
        <CardFieldset lang={answerLang}>
          <LowercaseLabel>Displayed Answer</LowercaseLabel>
          <StyledTextInput
            value={fullAnswerInput}
            onChange={handleFullAnswerChange}
            onKeyDown={handleKeyDown}
          />
        </CardFieldset>
        <StyledButton type="submit">
          Save Changes
        </StyledButton>
      </StyledFrom>
    );
  };
  return (
    <Mutation<CardEditData, CardEditVariables>
      mutation={CARD_EDIT_MUTATION}
      onError={printApolloError}
    >
      {renderCardItemEdit}
    </Mutation>
  );
};

export default WrCardItemEdit;
