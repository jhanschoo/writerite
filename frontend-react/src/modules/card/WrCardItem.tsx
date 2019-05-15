import React, { Component, ChangeEvent, KeyboardEvent } from 'react';
import moment from 'moment';

import { Mutation, MutationFn, MutationResult } from 'react-apollo';
import { printApolloError } from '../../util';
import { CARD_EDIT_MUTATION, CardEditVariables, CardEditData } from './gql';

import styled from 'styled-components';
import HDivider from '../../ui/HDivider';
import List from '../../ui/list/List';
import Item from '../../ui/list/Item';

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

const Header = styled.header`
  display: flex;
  justify-content: space-between;
  padding: ${({ theme }) => theme.space[1]} 0;
`;

const MainSegment = styled.main`
  display: flex;
  padding: ${({ theme }) => theme.space[1]} 0;
`;

const Card = styled.form`
  border-radius: 4px;
  margin: ${({ theme }) => theme.space[1]} ${({ theme }) => theme.space[0]};
  padding: 0 ${({ theme }) => theme.space[3]};
  display: flex;
  flex-direction: column;
  background: ${({ theme }) => theme.colors.bg0};
  .auxillary {
    visibility: hidden;
  }

  :hover .auxillary {
    visibility: visible;
  }
`;

const EditNoticeText = styled.span`
  color: ${({ theme }) => theme.colors.fg2};
  font-size: 75%;
`;

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
      const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
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
      return (
        <Card>
          <Header>
            <EditNoticeText>
              <em>{hasUnsavedChanges ? unsavedChangesNotice : lastEditedNotice}</em>
            </EditNoticeText>
            <List>
              <Item>
                <WrCreateCardButton
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
          <MainSegment>
            <CardFieldset
              label="Prompt"
              lang={promptLang}
              input={promptInput}
              onChange={handlePromptChange}
              onKeyDown={handleKeyDown}
            />
            <CardFieldset
              label="Displayed Answer"
              lang={answerLang}
              input={fullAnswerInput}
              onChange={handleFullAnswerChange}
              onKeyDown={handleKeyDown}
            />
          </MainSegment>
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
  private readonly resetState = () => {
    const { prompt, fullAnswer } = this.props.card;
    this.setState({
      promptInput: prompt,
      fullAnswerInput: fullAnswer,
    });
  }
}

export default WrCardItem;
