import React, { Component, ChangeEvent } from 'react';

import { Mutation, MutationFn, MutationResult } from 'react-apollo';
import { printApolloError } from '../../util';
import { CARD_UPDATE_MUTATION, CardUpdateVariables, CardUpdateData } from './gql';

import { Card, Flex } from 'rebass';
import VDivider from '../../ui/VDivider';

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
    prompt: this.props.card.prompt,
    fullAnswer: this.props.card.fullAnswer,
  };

  public readonly render = () => {
    const { handlePromptChange, handleFullAnswerChange } = this;
    const { prompt, fullAnswer } = this.state;
    const { id, sortKey } = this.props.card;
    const renderCardUpdate = (
      mutate: MutationFn<CardUpdateData, CardUpdateVariables>,
      { loading }: MutationResult<CardUpdateData>,
    ) => {
      const handleUpdate = () => {
        // https://github.com/lovasoa/react-contenteditable/issues/164
        return mutate({
          variables: {
            id,
            prompt: this.state.prompt,
            fullAnswer: this.state.fullAnswer,
            sortKey,
          },
        });
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
                html={prompt}
                onChange={handlePromptChange}
                onUnmodifiedEnter={handleUpdate}
              />
              <Flex flexDirection="column" justifyContent="center">
                <VDivider height="75%" spacer={{ bg: 'lightLightEdge' }} />
              </Flex>
              <CardFieldset
                label="Displayed Answer"
                html={fullAnswer}
                onChange={handleFullAnswerChange}
                onUnmodifiedEnter={handleUpdate}
              />
            </Flex>
          </Flex>
        </Card>
      );
    };
    return (
      <Mutation<CardUpdateData, CardUpdateVariables>
        mutation={CARD_UPDATE_MUTATION}
        onError={printApolloError}
      >
        {renderCardUpdate}
      </Mutation>
    );
  }
  private readonly handlePromptChange = (e: ChangeEvent<HTMLInputElement>) => {
    this.setState({ prompt: e.target.value });
  }
  private readonly handleFullAnswerChange = (e: ChangeEvent<HTMLInputElement>) => {
    this.setState({ fullAnswer: e.target.value });
  }
}

export default WrCardItem;
