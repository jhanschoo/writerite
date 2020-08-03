import React from "react";

import { wrStyled } from "../../../theme";
import { BorderlessButton, Item, List } from "../../../ui";
import { CardDetail } from "../../../client-models/gqlTypes/CardDetail";

import { emptyRawContent, identity } from "../../../util";
import { FrontBackCard, FrontBackCardActionsList, Modal } from "../../../ui-components";
import SelfManagedNotesEditor from "../../editor/SelfManagedNotesEditor";

const StyledDeletePrompt = wrStyled.div`
display: flex;
width: 100%;
align-items: baseline;
padding: ${({ theme: { space } }) => `${space[2]} ${space[3]}`};

p {
  flex-grow: 1;
  padding: ${({ theme: { space } }) => `0 ${space[4]} 0 ${space[2]}`};
  margin: 0;
}
`;

const ActionsItem = wrStyled(Item)``;

const DeleteCardButton = wrStyled(BorderlessButton)`
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

interface Props {
  handleClose: () => void;
  handleDelete: () => void;
  template?: boolean;
  card: CardDetail | null;
}

const WrDeckDetailCardDeleteModal = ({
  handleClose, handleDelete, template, card,
}: Props): JSX.Element =>{
  const {
    prompt, fullAnswer, answers
  } = card ?? {
    prompt: emptyRawContent,
    fullAnswer: emptyRawContent,
    answers: [],
  };
  return (
    <Modal handleClose={handleClose}>
      <FrontBackCard
        header={<StyledDeletePrompt>
          <p>Delete this{template ? " template" : " card"}?</p>
        </StyledDeletePrompt>}
        promptContent={<SelfManagedNotesEditor
          initialContent={prompt as Record<string, unknown>}
          placeholder="Empty"
          handleChange={identity}
          readOnly={true}
        />}
        fullAnswerContent={<SelfManagedNotesEditor
          initialContent={fullAnswer as Record<string, unknown>}
          placeholder="Empty"
          handleChange={identity}
          readOnly={true}
        />}
        answersContent="TODO"
        footer={<FrontBackCardActionsList>
          <ActionsItem>
            <SecondaryButton onClick={handleClose}>cancel</SecondaryButton>
          </ActionsItem>
          <ActionsItem>
            <DeleteCardButton onClick={handleDelete}>Delete</DeleteCardButton>
          </ActionsItem>
        </FrontBackCardActionsList>}
      />
    </Modal>
  );
};

export default WrDeckDetailCardDeleteModal;
