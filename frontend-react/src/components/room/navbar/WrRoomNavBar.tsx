import React, { useState } from "react";
import { useHistory } from "react-router";

import { wrStyled } from "src/theme";
import { BorderlessButton, Item, List, NavBar, NavBarItem, NavBarList } from "src/ui";
import { Modal } from "src/ui-components";

import WrBrandText from "../../brand/WrBrandText";
import { RoomState } from "../../../gqlGlobalTypes";

const BrandHeading = wrStyled.h3`
margin: 0;
`;

const StyledNavBar = wrStyled(NavBar)`
margin: 0;
flex-wrap: nowrap;
@media (max-width: ${({ theme: { breakpoints } }) => breakpoints[1]}) {
  font-size: 75%;
}
`;

const ModalBox = wrStyled.div`
display: flex;
flex-direction: column;
padding: ${({ theme: { space } }) => `${space[2]} ${space[3]}`};

p {
  flex-grow: 1;
  padding: ${({ theme: { space } }) => space[2]};
  margin: 0;
}
`;

export const ActionsList = wrStyled(List)`
flex-direction: row;
flex-wrap: wrap;
align-items: baseline;
justify-content: flex-end;
width: 100%;
margin: ${({ theme: { space } }) => space[2]};
padding: ${({ theme: { space } }) => `0 ${space[3]} ${space[1]} ${space[3]}`};
`;

const ActionsItem = wrStyled(Item)``;

const ConfirmExitButton = wrStyled(BorderlessButton)`
${({ theme: { bgfg, fg } }) => bgfg(fg[2])}
padding: ${({ theme: { space } }) => `${space[1]} ${space[2]}`};
margin: ${({ theme: { space } }) => `${space[1]} ${space[1]}`};

&.active, :hover, :active, :hover:active {
  ${({ theme: { bgfg, fg } }) => bgfg(fg[1])}
}
`;

const SecondaryButton = wrStyled(BorderlessButton)`
${({ theme: { fgbg, bg } }) => fgbg(bg[3])}
padding: ${({ theme: { space } }) => `${space[1]} ${space[2]}`};
margin: ${({ theme: { space } }) => `${space[1]} ${space[1]}`};
`;

const BrandNavBarItem = wrStyled(NavBarItem)`
padding: ${({ theme: { space } }) => space[2]};
`;

const NavBarListRight = wrStyled(NavBarList)`
justify-content: flex-end;
`;

const ExitButton = wrStyled(BorderlessButton)`
padding: ${({ theme: { space } }) => `${space[2]} ${space[3]}`};
@media (max-width: ${({ theme: { breakpoints } }) => breakpoints[1]}) {
  padding: ${({ theme: { space } }) => `${space[1]} ${space[2]}`};
}
`;

interface Props {
  roomState?: RoomState;
}

const WrRoomNavBar = ({ roomState }: Props): JSX.Element => {
  const history = useHistory();
  const [showExitModal, setShowExitModal] = useState(false);
  const handleExit = () => history.push("/deck/list");
  const handleShowExitModal = () => setShowExitModal(true);
  const handleHideExitModal = () => {
    if (roomState === RoomState.SERVED) {
      handleExit();
    } else {
      setShowExitModal(false);
    }
  };
  return (
    <StyledNavBar>
      {showExitModal && <Modal handleClose={handleHideExitModal}>
        <ModalBox>
          <p>You are about to leave the room.{roomState === RoomState.SERVING && " You will forfeit if you do this!"} Do you still want to proceed?</p>
          <ActionsList>
            <ActionsItem><SecondaryButton onClick={handleHideExitModal}>No</SecondaryButton></ActionsItem>
            <ActionsItem><ConfirmExitButton onClick={handleExit}>Yes</ConfirmExitButton></ActionsItem>
          </ActionsList>
        </ModalBox>
      </Modal>}
      <NavBarList>
        <BrandNavBarItem>
          <BrandHeading>
            <WrBrandText short={true} />
          </BrandHeading>
        </BrandNavBarItem>
      </NavBarList>
      <NavBarListRight>
        <NavBarItem>
          <ExitButton onClick={handleShowExitModal}>
            Leave Room
          </ExitButton>
        </NavBarItem>
      </NavBarListRight>
    </StyledNavBar>
  );
};

export default WrRoomNavBar;

