import React from "react";

import { wrStyled } from "../../../theme";
import { Item, List } from "../../../ui";
import { Modal } from "../../../ui-components";

import WrDeckDetailTemplateItem from "./WrDeckDetailTemplateItem";
import { CardDetail } from "../../../client-models/gqlTypes/CardDetail";

const StyledList = wrStyled(List)`
flex-direction: column;
min-width: 50vw;
padding: ${({ theme: { space } }) => space[3]};
${({ theme: { fgbg, bg } }) => fgbg(bg[3])}
`;

const StyledItem = wrStyled(Item)`
width: 100%;
${({ theme: { fgbg, bg } }) => fgbg(bg[3])}
`;

const StyledEmptyMessage = wrStyled.p`
margin: 0;
padding: ${({ theme: { space } }) => space[3]};
`;

interface Props {
  handleClose: () => void;
  templates: CardDetail[];
}

const WrDeckDetailFiledTemplatesModal = ({
  handleClose,
  templates,
}: Props):JSX.Element => {
  const templateItems = templates.map((template) => <WrDeckDetailTemplateItem key={template.id} template={template} />);
  return <Modal handleClose={handleClose}>
    <StyledList>
      {!templateItems.length && <StyledItem key="empty-message">
        <StyledEmptyMessage>There are no filed templates to show.</StyledEmptyMessage>
      </StyledItem>}
      {templateItems}
    </StyledList>
  </Modal>;
};

export default WrDeckDetailFiledTemplatesModal;