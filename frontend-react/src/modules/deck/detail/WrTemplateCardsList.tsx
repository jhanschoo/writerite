import React from 'react';

import { ChevronDown, ChevronUp } from 'react-feather';

import { Heading } from 'rebass';
import FlexCard from '../../../ui/FlexCard';

import WrCardForm from '../../card/WrCardForm';

const WrTemplateCardsList = () => (
  <>
    <FlexCard
      as="header"
      justifyContent="center"
      alignItems="center"
      p={1}
      m={1}
    >
      <Heading as="h3" fontSize="125%" fontWeight="normal">0 Template Cards</Heading><ChevronDown />
    </FlexCard>
    <WrCardForm />
  </>
);

export default WrTemplateCardsList;
