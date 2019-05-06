import React, { PureComponent, ChangeEvent, ClipboardEvent, KeyboardEvent } from 'react';
import he from 'he';
import ContentEditable from 'react-contenteditable';

import { MutationFn, Mutation, MutationResult } from 'react-apollo';
import { printApolloError } from '../../../util';
import { DeckEditNameData, DeckEditNameVariables, DECK_EDIT_NAME_MUTATION } from '../gql';

import styled from 'styled-components';
import { Card, CardProps, Heading, HeadingProps } from 'rebass';

const StyledContentEditable = styled(ContentEditable)`
  outline: none;
`;

const handlePaste = (e: ClipboardEvent<HTMLDivElement>) => {
  e.preventDefault();
  const text = e.clipboardData.getData('text/plain');
  document.execCommand('insertHTML', false, text);
};

interface DetailHeader extends HeadingProps {
  card?: CardProps;
  heading?: HeadingProps;
  name: string;
  deckId?: string;
}

class WrDetailHeader extends PureComponent<DetailHeader> {
  public readonly state = {
    nameInput: he.encode(this.props.name),
  };

  public readonly render = () => {
    const { handleChange } = this;
    const { nameInput } = this.state;
    const { card, heading, name, deckId } = this.props;
    const renderName = (
      mutate: MutationFn<DeckEditNameData, DeckEditNameVariables>,
      { loading }: MutationResult<DeckEditNameData>,
    ) => {
      const handleUpdate = () => {
        if (!deckId) {
          return;
        }
        mutate({
          variables: {
            id: deckId,
            name: he.decode(this.state.nameInput),
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
          this.setState({
            nameInput: name,
          });
        }
      };
      return (
        // @ts-ignore
        <StyledContentEditable
          role="textbox"
          aria-multiline="true"
          html={nameInput}
          onChange={handleChange}
          onKeyDown={handleKeyDown || undefined}
          onPaste={handlePaste}
          disabled={!deckId}
        />
      );
    };
    return (
      <Card as="header" {...card}>
        <Heading {...heading}>
          <Mutation<DeckEditNameData, DeckEditNameVariables>
            mutation={DECK_EDIT_NAME_MUTATION}
            onError={printApolloError}
          >
          {renderName}
          </Mutation>
        </Heading>
      </Card>
    );
  }

  private readonly handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    this.setState({ nameInput: e.target.value });
  }
}

export default WrDetailHeader;
