import React, { useRef, ClipboardEvent, ChangeEvent, KeyboardEvent, MouseEvent } from 'react';

import ContentEditable from 'react-contenteditable';

import styled from 'styled-components';
import Fieldset from '../../ui/form/Fieldset';
import Label from '../../ui/form/Label';

const GrowingFieldset = styled(Fieldset)`
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  width: 50%;
  cursor: text;
  > * {
    cursor: text;
  }
`;

const UppercaseLabel = styled(Label)`
  text-transform: uppercase;
`;

const StyledContentEditable = styled(ContentEditable)`
  min-height: 1rem;
  flex-grow: 1;
  outline: none;
`;

const handlePaste = (e: ClipboardEvent<HTMLDivElement>) => {
  e.preventDefault();
  const text = e.clipboardData.getData('text/plain');
  document.execCommand('insertHTML', false, text);
};

interface Props {
  html?: string;
  label?: string;
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
  onUnmodifiedEnter?: (e: KeyboardEvent<HTMLDivElement>) => void;
}

const CardFieldset = (props: Props) => {
  const { label, html, onChange, onUnmodifiedEnter } = { html: '', ...props };
  const ceEl = useRef<HTMLDivElement>(null);
  const handleClick = (_e: MouseEvent<HTMLDivElement>) => {
    if (ceEl.current) {
      ceEl.current.focus();
    }
  };
  const handleKeyPress = (e: KeyboardEvent<HTMLDivElement>) => {
    const { key, shiftKey } = e;
    if (key === 'Enter' && !shiftKey) {
      e.preventDefault();
    } else if (onUnmodifiedEnter) {
      onUnmodifiedEnter(e);
    }
  };
  return (
    <GrowingFieldset p={[1, 1, 2]} onClick={handleClick}>
    {label && <UppercaseLabel>{label}</UppercaseLabel>}
    {
      // tslint:disable-next-line: jsx-no-multiline-js
      // @ts-ignore
      <StyledContentEditable
        role="textbox"
        aria-multiline="true"
        html={html}
        innerRef={ceEl}
        onChange={onChange}
        onKeyDown={handleKeyPress}
        onPaste={handlePaste}
      />
    }
  </GrowingFieldset>
  );
};

export default CardFieldset;
