import React from "react";

import type { CardDetail } from "src/gqlTypes";

import { wrStyled } from "src/theme";
import { BorderlessButton } from "src/ui";
import { FrontBackCard, FrontBackCardButtonsBox, Modal } from "src/ui-components";

import { emptyRawContent, identity } from "src/util";
import SelfManagedAnswersEditor from "src/components/editor/SelfManagedAnswersEditor";
import SelfManagedNotesEditor from "src/components/editor/SelfManagedNotesEditor";

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

const DeleteCardButton = wrStyled(BorderlessButton)`
${({ theme: { bgfg, fg } }) => bgfg(fg[2])}
padding: ${({ theme: { space } }) => `${space[1]} ${space[2]}`};
margin: 0;

&.active, :hover, :focus, :active {
  ${({ theme: { bgfg, fg } }) => bgfg(fg[1])}
}
`;

const SecondaryButton = wrStyled(BorderlessButton)`
${({ theme: { fgbg, bg } }) => fgbg(bg[3])}
padding: ${({ theme: { space } }) => `${space[1]} ${space[2]}`};
margin: ${({ theme: { space } }) => `0 ${space[2]} 0 0`};
`;

interface Props {
  handleClose: () => void;
  handleDelete: () => void;
  template?: boolean;
  card: CardDetail | null;
}

const WrDeckDetailCardDeleteModal = ({
  handleClose, handleDelete, template, card,
}: Props): JSX.Element => {
  const {
    // eslint-disable-next-line no-shadow
    prompt, fullAnswer, answers,
  } = card ?? {
    prompt: emptyRawContent,
    fullAnswer: emptyRawContent,
    answers: [],
  };
  return <Modal handleClose={handleClose}>
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
      answersContent={<SelfManagedAnswersEditor
        initialContent={answers}
        handleChange={identity}
        readOnly={true}
      />}
      footer={<FrontBackCardButtonsBox>
        <SecondaryButton onClick={handleClose}>cancel</SecondaryButton>
        <DeleteCardButton onClick={handleDelete}>Delete</DeleteCardButton>
      </FrontBackCardButtonsBox>}
    />
  </Modal>;
};

export default WrDeckDetailCardDeleteModal;
