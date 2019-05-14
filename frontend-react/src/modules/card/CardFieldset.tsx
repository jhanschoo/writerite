import React, { ChangeEvent, FC, KeyboardEvent } from 'react';

import styled from 'styled-components';
import Fieldset from '../../ui/form/Fieldset';
import TextInput from '../../ui/form/TextInput';

const GrowingFieldset = styled(Fieldset)`
  position: relative;
  flex-grow: 1;
  width: 50%;
  z-index: 0;
`;

const LowercaseLabel = styled.label`
  position: absolute;
  font-size: 75%;
  text-transform: lowercase;
  color: ${({ theme }) => theme.colors.fg2};
`;

const StyledTextInput = styled(TextInput)`
  width: 100%;
  padding:
    ${({ theme }) => theme.space[4]}
    ${({ theme }) => theme.space[0]}
    ${({ theme }) => theme.space[3]}
    ${({ theme }) => theme.space[0]};
`;

interface Props {
  input?: string;
  label?: string;
  lang?: string;
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
  onKeyDown?: (e: KeyboardEvent<HTMLDivElement>) => void;
}

const CardFieldset: FC<Props> = (props: Props) => {
  const { label, input, lang, onChange, onKeyDown } = { input: '', ...props };
  return (
    <GrowingFieldset lang={lang || undefined}>
      {label && <LowercaseLabel>{label}</LowercaseLabel>}
      <StyledTextInput
        onChange={onChange}
        onKeyDown={onKeyDown}
        value={input}
        variant="minimal"
      />
    </GrowingFieldset>
  );
};

export default CardFieldset;
