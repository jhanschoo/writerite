import React, { useState, ChangeEvent } from 'react';

import { Card, Flex } from 'rebass';
import VDivider from '../../ui/VDivider';

import CardFieldset from './CardFieldset';

const WrCardForm = () => {
  const [front, useFront] = useState('');
  const [back, useBack] = useState('');
  const handleFrontChange = (e: ChangeEvent<HTMLInputElement>) => {
    useFront(e.target.value);
  };
  const handleBackChange = (e: ChangeEvent<HTMLInputElement>) => {
    useBack(e.target.value);
  };
  return (
    <Card
      m={1}
      px={2}
      borderTop="1px solid"
      borderBottom="1px solid"
      borderColor="shadow"
    >
      <Flex bg="bg0" as="form" flexDirection="column">
        <Flex>
          <CardFieldset label="Front" onChange={handleFrontChange} />
          <Flex flexDirection="column" justifyContent="center">
            <VDivider height="75%" spacer={{ bg: "shadow" }} />
          </Flex>
          <CardFieldset label="Back" onChange={handleBackChange} />
        </Flex>
      </Flex>
    </Card>
  );
};

export default WrCardForm;
