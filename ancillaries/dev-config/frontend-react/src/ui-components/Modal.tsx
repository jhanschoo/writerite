import React, { PropsWithChildren, SyntheticEvent } from "react";

import { ModalBackground, ModalCloseButton, ModalContainer } from "src/ui";

interface Props {
  handleClose: () => void;
}

export const Modal = ({
  children,
  handleClose,
}: PropsWithChildren<Props>): JSX.Element => (
  <ModalBackground onClick={handleClose}>
    <ModalContainer onClick={(e: SyntheticEvent) => e.stopPropagation()}>
      <ModalCloseButton onClick={handleClose}>cancel</ModalCloseButton>
      {children}
    </ModalContainer>
  </ModalBackground>
);
