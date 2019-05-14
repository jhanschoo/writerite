import React from 'react';

import { ChevronDown, ChevronUp } from 'react-feather';

import styled from 'styled-components';

const Header = styled.header`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: ${({ theme }) => theme.space[1]}
  margin: ${({ theme }) => theme.space[1]}
`;

const ListHeading = styled.h4`
  font-size: 125%;
  font-weight: normal;
  text-align: center;
  margin: 0;
`;

const WrSubdeckList = () => {
  return (
    <Header>
      <ListHeading>0 Sub-Decks</ListHeading> <ChevronDown />
    </Header>
  );
};

export default WrSubdeckList;
