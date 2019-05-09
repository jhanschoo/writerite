import React, { Component, ChangeEvent, ClipboardEvent, KeyboardEvent } from 'react';
import moment from 'moment';

import { Mutation, MutationFn, MutationResult } from 'react-apollo';
import { printApolloError } from '../../util';
import { CARD_EDIT_MUTATION, CardEditVariables, CardEditData } from './gql';

import styled from 'styled-components';
import { Card, Flex, Text } from 'rebass';
import Button from '../../ui/form/Button';
import TextInput from '../../ui/form/TextInput';
import HDivider from '../../ui/HDivider';
import VDivider from '../../ui/VDivider';

import CardFieldset from './CardFieldset';
import { WrCard } from './types';
import WrCreateCardButton from './WrCreateCardButton';
import WrDeleteCardButton from './WrDeleteCardButton';

interface Props {
  deckId: string;
  promptLang: string;
  answerLang: string;
  card: WrCard;
}

const StyledCard = styled(Card)`
  .auxillary {
    visibility: hidden;
  }

  :hover .auxillary {
    visibility: visible;
  }
`;

const handlePaste = (e: ClipboardEvent<HTMLDivElement>) => {
  e.preventDefault();
  const text = e.clipboardData.getData('text/plain');
  document.execCommand('insertHTML', false, text);
};

// Note: Class implementation is needed to deal with ContentEditable
//   not updating onKeyDown handlers
// https://github.com/lovasoa/react-contenteditable/issues/164
class WrCardItem extends Component<Props> {
  public readonly state = {
    promptInput: this.props.card.prompt,
    fullAnswerInput: this.props.card.fullAnswer,
  };

  public readonly render = () => {
    const {
      handlePromptChange,
      handleFullAnswerChange,
      resetState,
    } = this;
    const { promptInput, fullAnswerInput } = this.state;
    const { deckId, promptLang, answerLang } = this.props;
    const { id, prompt, fullAnswer, sortKey, editedAt, template } = this.props.card;
    const hasUnsavedChanges = (prompt !== promptInput)
      || (fullAnswer !== fullAnswerInput);
    const lastEditedNotice = `last edited ${moment(editedAt).fromNow()}`;
    const unsavedChangesNotice = 'You have unsaved changes. Press Enter to save. Press Esc to discard changes.';
    const renderCardEdit = (
      mutate: MutationFn<CardEditData, CardEditVariables>,
      { loading }: MutationResult<CardEditData>,
    ) => {
      const handleUpdate = () => {
        // https://github.com/lovasoa/react-contenteditable/issues/164
        return mutate({
          variables: {
            id,
            prompt: this.state.promptInput,
            fullAnswer: this.state.fullAnswerInput,
            sortKey,
          },
        });
      };
      const handleSingleLineDown = (e: KeyboardEvent<HTMLDivElement>) => {
        const { key } = e;
        if (key === 'Enter') {
          e.preventDefault();
          handleUpdate();
        }
        if (key === 'Escape' || key === 'Esc') {
          e.preventDefault();
          resetState();
        }
      };
      const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
        const { key, shiftKey } = e;
        if (key === 'Enter' && !shiftKey) {
          e.preventDefault();
          handleUpdate();
        }
        if (key === 'Escape' || key === 'Esc') {
          e.preventDefault();
          resetState();
        }
      };
      return (
        <StyledCard
          m={1}
          px={2}
          borderTop="1px solid"
          borderBottom="1px solid"
          borderColor="lightEdge"
        >
          <Flex px={3} bg="bg0" as="form" flexDirection="column">
            <Flex pt={1} justifyContent="space-between">
              <Text as="span" color="fg2" fontSize="75%">
                <em>{hasUnsavedChanges ? unsavedChangesNotice : lastEditedNotice}</em>
              </Text>
              <Flex>
                <WrCreateCardButton
                  deckId={deckId}
                  prompt={prompt}
                  fullAnswer={fullAnswer}
                  sortKey={sortKey}
                  template={template}
                />
                <WrDeleteCardButton cardId={id} />
              </Flex>
            </Flex>
            <Flex flexDirection="column">
              <HDivider py={1} spacer={{ bg: 'lightLightEdge' }} />
            </Flex>
            <Flex>
              <CardFieldset
                label="Prompt"
                lang={promptLang}
                html={promptInput}
                onChange={handlePromptChange}
                onKeyDown={handleKeyDown}
              />
              <CardFieldset
                label="Displayed Answer"
                lang={answerLang}
                html={fullAnswerInput}
                onChange={handleFullAnswerChange}
                onKeyDown={handleKeyDown}
              />
            </Flex>
          </Flex>
        </StyledCard>
      );
    };
    return (
      <Mutation<CardEditData, CardEditVariables>
        mutation={CARD_EDIT_MUTATION}
        onError={printApolloError}
      >
        {renderCardEdit}
      </Mutation>
    );
  }
  private readonly handlePromptChange = (e: ChangeEvent<HTMLInputElement>) => {
    this.setState({ promptInput: e.target.value });
  }
  private readonly handleFullAnswerChange = (e: ChangeEvent<HTMLInputElement>) => {
    this.setState({ fullAnswerInput: e.target.value });
  }
  private readonly resetState = () => {
    const { prompt, fullAnswer } = this.props.card;
    this.setState({
      promptInput: prompt,
      fullAnswerInput: fullAnswer,
    });
  }
}

export default WrCardItem;
