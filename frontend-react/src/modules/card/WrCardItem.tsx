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
    front: this.props.card.front,
    back: this.props.card.back,
  };

  public readonly render = () => {
    const { handleFrontChange, handleBackChange } = this;
    const { front, back } = this.state;
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
            front: this.state.front,
            back: this.state.back,
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
                label="Front"
                html={front}
                onChange={handleFrontChange}
                onUnmodifiedEnter={handleUpdate}
              />
              <Flex flexDirection="column" justifyContent="center">
                <VDivider height="75%" spacer={{ bg: 'lightLightEdge' }} />
              </Flex>
              <CardFieldset
                label="Back"
                html={back}
                onChange={handleBackChange}
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
  private readonly handleFrontChange = (e: ChangeEvent<HTMLInputElement>) => {
    this.setState({ front: e.target.value });
  }
  private readonly handleBackChange = (e: ChangeEvent<HTMLInputElement>) => {
    this.setState({ back: e.target.value });
  }
}

export default WrCardItem;
