import React, { MouseEvent } from 'react';
import { MessageCircle, Settings } from 'react-feather';

import styled from 'styled-components';
import { AuxillaryButton } from '../../../ui/form/Button';

const DeckHeader = styled.header`
  display: flex;
  flex-direction: column;
  align-items: center;

  .auxillary {
    visibility: hidden;
  }

  :hover .auxillary {
    visibility: visible;
  }

  padding: ${({ theme }) => theme.space[2]} 12.5%;

  @media (max-width: ${({ theme }) => theme.breakpoints[1]}) {
    padding: ${({ theme }) => theme.space[1]} ${({ theme }) => theme.space[2]};
  }
`;

const StyledAuxillaryButton = styled(AuxillaryButton)`
  display: inline;
`;

const DeckHeading = styled.h2`
  margin: ${({ theme }) => theme.space[1]};
  text-align: center;
  font-size: 250%;
`;

interface Props {
  name: string;
  toggleSettings: (e: MouseEvent<HTMLButtonElement>) => void;
  handleCreateRoom: (e: MouseEvent<HTMLButtonElement>) => void;
}

const WrDetailHeader = (props: Props) => {
  const { name, handleCreateRoom, toggleSettings } = props;
  return (
    <DeckHeader>
      <DeckHeading>
        {name}
        <StyledAuxillaryButton
          className="auxillary"
          onClick={handleCreateRoom}
        >
          <MessageCircle size={16} />
        </StyledAuxillaryButton>
        <StyledAuxillaryButton
          className="auxillary"
          onClick={toggleSettings}
        >
          <Settings size={16} />
        </StyledAuxillaryButton>
      </DeckHeading>
    </DeckHeader>
  );
};

export default WrDetailHeader;
