import React, { Component, ChangeEvent, ClipboardEvent, KeyboardEvent } from 'react';
import he from 'he';
import moment from 'moment';
import ContentEditable from 'react-contenteditable';
import { MoreVertical } from 'react-feather';

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
    promptLangInput: he.encode(this.props.card.promptLang),
    answerLangInput: he.encode(this.props.card.answerLang),
  };

  public readonly render = () => {
    const {
      handlePromptChange,
      handleFullAnswerChange,
      handlePromptLangChange,
      handleAnswerLangChange,
      resetState,
    } = this;
    const { promptInput, fullAnswerInput, promptLangInput, answerLangInput } = this.state;
    const { deckId } = this.props;
    const { id, prompt, fullAnswer, promptLang, answerLang, sortKey, editedAt, template } = this.props.card;
    const hasUnsavedChanges = (prompt !== promptInput)
      || (fullAnswer !== fullAnswerInput)
      || (he.encode(this.props.card.promptLang) !== promptLangInput)
      || (he.encode(this.props.card.answerLang) !== answerLangInput);
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
            promptLang: he.decode(this.state.promptLangInput),
            answerLang: he.decode(this.state.answerLangInput),
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
              <Flex className="auxillary">
                <Text as="span" color="fg2" fontSize="75%">
                  <em>prompt language:</em>&nbsp;
                  {
                    // tslint:disable-next-line: jsx-no-multiline-js
                    // @ts-ignore
                    <ContentEditable
                      role="textbox"
                      aria-multiline="true"
                      html={promptLangInput}
                      onChange={handlePromptLangChange}
                      onKeyDown={handleSingleLineDown}
                      onPaste={handlePaste}
                      tagName="span"
                    />
                  }
                  , <em>answer language:</em>&nbsp;
                  {
                    // tslint:disable-next-line: jsx-no-multiline-js
                    // @ts-ignore
                    <ContentEditable
                      role="textbox"
                      aria-multiline="true"
                      html={answerLangInput}
                      onChange={handleAnswerLangChange}
                      onKeyDown={handleKeyDown}
                      onPaste={handlePaste}
                      tagName="span"
                    />
                  }
                </Text>
              </Flex>
              <Flex>
                <Button
                  mx={1}
                  variant="auxillary"
                  className="auxillary"
                ><MoreVertical size={16} />
                </Button>
                <WrCreateCardButton
                  deckId={deckId}
                  prompt={prompt}
                  fullAnswer={fullAnswer}
                  promptLang={promptLang}
                  answerLang={answerLang}
                  sortKey={sortKey}
                  template={template}
                />
                <WrDeleteCardButton cardId={id} />
              </Flex>
            </Flex>
            <Flex>
              <CardFieldset
                label="Prompt"
                lang={promptLang}
                html={promptInput}
                onChange={handlePromptChange}
                onKeyDown={handleKeyDown}
              />
              <Flex px={2} flexDirection="column">
                <VDivider height="100%" spacer={{ bg: 'lightLightEdge' }} />
              </Flex>
              <CardFieldset
                label="Displayed Answer"
                lang={answerLang}
                html={fullAnswerInput}
                onChange={handleFullAnswerChange}
                onKeyDown={handleKeyDown}
              />
            </Flex>
            <Flex pb={1} justifyContent="flex-end">
              <Text as="span" color="fg2" fontSize="75%">
                <em>{hasUnsavedChanges ? unsavedChangesNotice : lastEditedNotice}</em>
              </Text>
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
  private readonly handlePromptLangChange = (e: ChangeEvent<HTMLInputElement>) => {
    this.setState({ promptLangInput: e.target.value });
  }
  private readonly handleAnswerLangChange = (e: ChangeEvent<HTMLInputElement>) => {
    this.setState({ answerLangInput: e.target.value });
  }
  private readonly resetState = () => {
    const { prompt, fullAnswer, promptLang, answerLang } = this.props.card;
    this.setState({
      promptInput: prompt,
      fullAnswerInput: fullAnswer,
      promptLangInput: promptLang,
      answerLangInput: answerLang,
    });
  }
}

export default WrCardItem;
