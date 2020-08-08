import React from "react";

import type { CardDetail } from "src/client-models/gqlTypes/CardDetail";

import { wrStyled } from "src/theme";
import { Item, List } from "src/ui";
import { Modal } from "src/ui-components";

import WrDeckDetailTemplateItem from "./WrDeckDetailTemplateItem";

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