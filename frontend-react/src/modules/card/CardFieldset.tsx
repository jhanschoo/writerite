import React, { useRef, ClipboardEvent, ChangeEvent, FC, KeyboardEvent, MouseEvent } from 'react';

import styled from 'styled-components';
import Fieldset from '../../ui/form/Fieldset';
import Label from '../../ui/form/Label';

import ContentEditable from 'react-contenteditable';

const GrowingFieldset = styled(Fieldset)`
  position: relative;
  flex-grow: 1;
  width: 50%;
  cursor: text;
  > * {
    cursor: text;
  }
  z-index: 0;
`;

const LowercaseLabel = styled(Label)`
  position: absolute;
  text-transform: lowercase;
`;

const StyledContentEditable = styled(ContentEditable)`
  min-height: 1rem;
  padding: 1rem 0 0.5rem 0;
  flex-grow: 1;
  outline: none;
  z-index: 1;
`;

const handlePaste = (e: ClipboardEvent<HTMLDivElement>) => {
  e.preventDefault();
  const text = e.clipboardData.getData('text/plain');
  document.execCommand('insertHTML', false, text);
};

interface Props {
  html?: string;
  label?: string;
  lang?: string;
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
  onKeyDown?: (e: KeyboardEvent<HTMLDivElement>) => void;
}

const CardFieldset: FC<Props> = (props: Props) => {
  const { label, html, lang, onChange, onKeyDown } = { html: '', ...props };
  return (
    <GrowingFieldset p={0} lang={lang || undefined}>
    {label && <LowercaseLabel color="fg2">{label}</LowercaseLabel>}
    {
      // tslint:disable-next-line: jsx-no-multiline-js
      // @ts-ignore
      <StyledContentEditable
        role="textbox"
        aria-multiline="true"
        html={html}
        onChange={onChange}
        onKeyDown={onKeyDown || undefined}
        onPaste={handlePaste}
      />
    }
  </GrowingFieldset>
  );
};

export default CardFieldset;
