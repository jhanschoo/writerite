import React, { PureComponent, ChangeEvent, ClipboardEvent, KeyboardEvent } from 'react';
import { Settings } from 'react-feather';
import he from 'he';
import ContentEditable from 'react-contenteditable';

import { MutationFn, Mutation, MutationResult } from 'react-apollo';
import { printApolloError } from '../../../util';
import { DeckEditData, DeckEditVariables, DECK_EDIT_MUTATION } from '../gql';

import styled from 'styled-components';
import { Card, Text, Heading, HeadingProps } from 'rebass';
import Button from '../../../ui/form/Button';
import TextInput from '../../../ui/form/TextInput';

import { WrDeckDetail } from '../types';

const StyledCard = styled(Card)`
  display: flex;
  flex-direction: column;
  align-items: center;

  .auxillary {
    visibility: hidden;
  }

  :hover .auxillary {
    visibility: visible;
  }
`;

const StyledContentEditable = styled(ContentEditable)`
  outline: none;
`;

const handlePaste = (e: ClipboardEvent<HTMLDivElement>) => {
  e.preventDefault();
  const text = e.clipboardData.getData('text/plain');
  document.execCommand('insertHTML', false, text);
};

interface DetailHeader extends HeadingProps {
  deck: WrDeckDetail;
}

class WrDetailHeader extends PureComponent<DetailHeader> {
  public readonly state = {
    nameInput: he.encode(this.props.deck.name),
    showSettings: false,
    nameLangInput: this.props.deck.nameLang,
    promptLangInput: this.props.deck.promptLang,
    answerLangInput: this.props.deck.answerLang,
  };

  public readonly render = () => {
    const {
      handleNameChange,
      toggleSettings,
      handleNameLangChange,
      handlePromptLangChange,
      handleAnswerLangChange,
    } = this;
    const { nameInput, nameLangInput, promptLangInput, answerLangInput, showSettings } = this.state;
    const { id, name } = this.props.deck;
    const renderName = (
      mutate: MutationFn<DeckEditData, DeckEditVariables>,
      { loading }: MutationResult<DeckEditData>,
    ) => {
      const handleUpdate = () => {
        if (!id) {
          return;
        }
        mutate({
          variables: {
            id,
            name: he.decode(this.state.nameInput),
            nameLang: this.state.nameLangInput,
            promptLang: this.state.promptLangInput,
            answerLang: this.state.answerLangInput,
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
          this.resetState();
        }
      };
      const settingsToggle = (id) ? (
        <Button variant="auxillary" className="auxillary" onClick={toggleSettings}>
          <Settings />
        </Button>
      ) : undefined;
      const settingsPanel = (showSettings) ? (
        <Text color="fg2" textAlign="center">
          Deck title language:
          <TextInput
            variant="underscore"
            type="text"
            value={nameLangInput}
            width="6rem"
            onChange={handleNameLangChange}
            onKeyDown={handleKeyDown || undefined}
          />,
          Prompt language:
          <TextInput
            variant="underscore"
            type="text"
            value={promptLangInput}
            width="6rem"
            onChange={handlePromptLangChange}
            onKeyDown={handleKeyDown || undefined}
          />
          , Answer language:
          <TextInput
            variant="underscore"
            type="text"
            value={answerLangInput}
            width="4rem"
            onChange={handleAnswerLangChange}
            onKeyDown={handleKeyDown || undefined}
          />
        </Text>
      ) : undefined;
      return (
        <>
          <Heading m={1} textAlign="center" fontSize="250%">
            {
              // tslint:disable-next-line: jsx-no-multiline-js
              // @ts-ignore
              <StyledContentEditable
                role="textbox"
                aria-multiline="true"
                html={nameInput}
                onChange={handleNameChange}
                onKeyDown={handleKeyDown || undefined}
                onPaste={handlePaste}
                disabled={!id}
              />
            }
          </Heading>
          {settingsToggle}
          {settingsPanel}
        </>
      );
    };
    return (
      <StyledCard as="header" px={[2, 2, '12.5%']} py={[1, 1, 2]}>
        <Mutation<DeckEditData, DeckEditVariables>
          mutation={DECK_EDIT_MUTATION}
          onError={printApolloError}
        >
          {renderName}
        </Mutation>
      </StyledCard>
    );
  }

  private readonly handleNameChange = (e: ChangeEvent<HTMLInputElement>) => {
    this.setState({ nameInput: e.target.value });
  }

  private readonly toggleSettings = () => {
    this.setState({ showSettings: !this.state.showSettings });
  }

  private readonly handleNameLangChange = (e: ChangeEvent<HTMLInputElement>) => {
    this.setState({ nameLangInput: e.target.value });
  }

  private readonly handlePromptLangChange = (e: ChangeEvent<HTMLInputElement>) => {
    this.setState({ promptLangInput: e.target.value });
  }

  private readonly handleAnswerLangChange = (e: ChangeEvent<HTMLInputElement>) => {
    this.setState({ answerLangInput: e.target.value });
  }

  private readonly resetState = () => {
    const { name, nameLang, promptLang, answerLang } = this.props.deck;
    this.setState({
      nameInput: he.encode(name),
      nameLangInput: nameLang,
      promptLangInput: promptLang,
      answerLangInput: answerLang,
    });
  }
}

export default WrDetailHeader;
