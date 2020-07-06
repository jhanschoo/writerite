import React from 'react';

import { useQuery } from '@apollo/react-hooks';
import { printApolloError } from '../../../util';
import { OWN_DECKS_QUERY } from '../sharedGql';
import { OwnDecks } from '../gqlTypes/OwnDecks';

import styled from 'styled-components';
import Main from '../../../ui/layout/Main';
import List from '../../../ui/list/List';

import WrDeckItem from './WrDeckItem';

const StyledList = styled(List)`
flex-direction: row;
flex-wrap: wrap;
`;

const WrManageOwnDecks = () => {
  const {
    loading, error, data,
  } = useQuery<OwnDecks>(OWN_DECKS_QUERY, {
    onError: printApolloError,
  });
  if (error) {
    return (<Main/>);
  }
  if (loading || !data?.ownDecks) {
    return (<Main><p>Fetching decks...</p></Main>);
  }
  if (data.ownDecks.length === 0) {
    return (<Main><p>You have no decks.</p></Main>);
  }
  const styledDecks = data.ownDecks.map((deck) => deck &&
    <WrDeckItem deck={deck} key={deck.id}/>
  );
  return (
    <Main>
      <StyledList>
        {styledDecks}
      </StyledList>
    </Main>
  );
};

export default WrManageOwnDecks;
