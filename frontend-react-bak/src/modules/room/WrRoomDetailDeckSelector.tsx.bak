import React, { Component, SyntheticEvent } from 'react';
import { WrDeck } from '../deck/types';
import { QueryResult, Query, Mutation, MutationFn, MutationResult } from 'react-apollo';
import { DecksData, DecksVariables, DECKS_QUERY } from '../deck/gql';
import { Dropdown } from 'semantic-ui-react';
import { printApolloError } from '../util';
import { RoomServeDeckVariables, RoomServeDeckData, ROOM_SERVE_DECK } from './gql';

import './WrRoomDetailDeckSelector.css';

interface Props {
  roomId: string;
  currentDeck?: WrDeck;
  onMutation?: () => void;
  loading?: boolean;
  disabled?: boolean;
}

class WrRoomDetailDeckSelector extends Component<Props> {

  public readonly render = () => {
    const { renderDeckSelector } = this;
    return (
      <Query<DecksData, DecksVariables>
        query={DECKS_QUERY}
        onError={printApolloError}
      >
        {renderDeckSelector}
      </Query>
    );
  }

  private readonly renderDeckSelector = ({
    loading, error, data,
  }: QueryResult<DecksData, DecksVariables>) => {
    const { roomId, onMutation, loading: loadingOverride, disabled } = this.props;
    if (error) {
      return null;
    }
    if (!loading && (!data || !data.rwDecks)) {
      return null;
    }
    const deckList = (loading || !data || !data.rwDecks)
      ? []
      : data.rwDecks.map((deck) => {
        return {
          text: deck.name,
          value: deck.id,
        };
      });
    const renderDropdown = (
      mutate: MutationFn<RoomServeDeckData, RoomServeDeckVariables>,
      { loading: mutationLoading }: MutationResult<RoomServeDeckData>,
    ) => {
      const handleDeckDropdownChange = (_e: SyntheticEvent<HTMLElement>, dropdownData: any) => {
        this.setState({ deckInput: dropdownData.value });
        return mutate({
          variables: {
            id: roomId,
            deckId: dropdownData.value,
          },
        });
      };
      return (
        <Dropdown
          fluid={true}
          placeholder="Select a deck..."
          search={true}
          selection={true}
          options={deckList}
          loading={loadingOverride || loading || mutationLoading}
          onChange={handleDeckDropdownChange}
          value={this.props.currentDeck && this.props.currentDeck.id}
          disabled={disabled}
        />
      );
    };
    return (
      <Mutation<RoomServeDeckData, RoomServeDeckVariables>
        mutation={ROOM_SERVE_DECK}
        onError={printApolloError}
        onCompleted={onMutation}
      >
        {renderDropdown}
      </Mutation>
    );
  }

}

export default WrRoomDetailDeckSelector;
