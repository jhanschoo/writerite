import React from 'react';
import { Send } from 'react-feather';

import styled from 'styled-components';
import TextInput from '../../../ui/form/TextInput';
import { BorderlessButton } from '../../../ui/form/Button';

const InputBox = styled.div`
  display: flex;
  padding: ${({ theme }) => theme.space[2]};
`;

const StyledTextInput = styled(TextInput)`
  flex-grow: 1;
`;

const StyledButton = styled(BorderlessButton)`
  padding: ${({ theme }) => theme.space[1]};
  margin: ${({ theme }) => theme.space[1]};
`;

const WrRoomDetailInput = () => {
  return (
    <InputBox>
      <StyledTextInput type="text" />
      <StyledButton>
        Send&nbsp;<Send size={16} />
      </StyledButton>
    </InputBox>
  );
};

export default WrRoomDetailInput;
