import React, { Component, ChangeEvent, KeyboardEvent } from 'react';

import { Mutation, MutationFn, MutationResult } from 'react-apollo';
import { printApolloError } from '../../util';
import { CARD_EDIT_MUTATION, CardEditVariables, CardEditData } from './gql';

import { Card, Flex, Text } from 'rebass';
import HDivider from '../../ui/HDivider';
import VDivider from '../../ui/VDivider';

import moment from 'moment';

import CardFieldset from './CardFieldset';
import { WrCard } from './types';

interface Props {
  card: WrCard;
}

// Note: Class implementation is needed to deal with ContentEditable
//   not updating onKeyDown handlers
// https://github.com/lovasoa/react-contenteditable/issues/164
class WrCardItem extends Component<Props> {
  public readonly state = {
    promptInput: this.props.card.prompt,
    fullAnswerInput: this.props.card.fullAnswer,
  };

  public readonly render = () => {
    const { handlePromptChange, handleFullAnswerChange } = this;
    const { promptInput, fullAnswerInput } = this.state;
    const { id, prompt, fullAnswer, sortKey, editedAt } = this.props.card;
    const hasUnsavedChanges = (prompt !== promptInput) || (fullAnswer !== fullAnswerInput);
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
      const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
        const { key, shiftKey } = e;
        if (key === 'Enter' && !shiftKey) {
          e.preventDefault();
          handleUpdate();
        }
        if (key === 'Escape' || key === 'Esc') {
          e.preventDefault();
          this.setState({
            promptInput: prompt,
            fullAnswerInput: fullAnswer,
          });
        }
      };
      return (
        <Card
          m={1}
          px={2}
          borderTop="1px solid"
          borderBottom="1px solid"
          borderColor="lightEdge"
        >
          <Flex bg="bg0" as="form" flexDirection="column">
            <Flex>
              <CardFieldset
                label="Prompt"
                html={promptInput}
                onChange={handlePromptChange}
                onKeyDown={handleKeyDown}
              />
              <Flex flexDirection="column" justifyContent="center">
                <VDivider height="75%" spacer={{ bg: 'lightLightEdge' }} />
              </Flex>
              <CardFieldset
                label="Displayed Answer"
                html={fullAnswerInput}
                onChange={handleFullAnswerChange}
                onKeyDown={handleKeyDown}
              />
            </Flex>
            <Flex justifyContent="center">
              <HDivider width="75%" spacer={{ bg: 'lightLightEdge' }} />
            </Flex>
            <Flex px={[2, 2, 3]} py={1} justifyContent="flex-end">
              <Text as="span" color="fg2" fontSize="75%">
                <em>{hasUnsavedChanges ? unsavedChangesNotice : lastEditedNotice}</em>
              </Text>
            </Flex>
          </Flex>
        </Card>
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
}

export default WrCardItem;
