import React from 'react';

import { ChevronDown, ChevronUp } from 'react-feather';

import { Heading } from 'rebass';
import FlexCard from '../../../ui/FlexCard';

import WrCardForm from '../../card/WrCardForm';
import NewCardButton from '../../card/NewCardButton';

const WrCardsList = () => (
  <>
    <FlexCard
      as="header"
      justifyContent="center"
      alignItems="center"
      p={1}
      m={1}
    >
      <Heading as="h3" fontSize="125%" fontWeight="normal" textAlign="center">0 Cards</Heading><ChevronDown />
    </FlexCard>
    <NewCardButton />
    <WrCardForm />
  </>
);

export default WrCardsList;
