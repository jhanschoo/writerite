import React from 'react';
import { Plus } from 'react-feather';

import styled from 'styled-components';
import { Card, Flex } from 'rebass';
import Button from '../../ui/form/Button';

const CenteredCard = styled(Card)`
  align-self: center;
`;

const NewCardButton = () => {
  return (
    <CenteredCard
      m={1}
      px={2}
      borderTop="1px solid"
      borderBottom="1px solid"
      borderColor="shadow"
    >
      <Button variant="card" bg="bg0" px={[1, 1, 2]} py={1}>
        <Plus size={16} />New Card
      </Button>
    </CenteredCard>
  )
};

export default NewCardButton;
