import React from 'react';

import { ChevronDown, ChevronUp } from 'react-feather';

import styled from 'styled-components';
import FlexCard from '../../../ui/FlexCard';

const ListHeading = styled.h4`
  font-size: 125%;
  font-weight: normal;
  text-align: center;
  margin: 0;
`;

const WrTemplateCardsList = () => (
  <>
    <FlexCard
      as="header"
      justifyContent="center"
      alignItems="center"
      p={1}
      m={1}
    >
      <ListHeading>0 Template Cards</ListHeading><ChevronDown />
    </FlexCard>
  </>
);

export default WrTemplateCardsList;
