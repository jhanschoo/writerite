import React, { useState } from "react";

import { useMutation } from "@apollo/client";
import { CARD_DELETE_MUTATION, CARD_EDIT_MUTATION, cardDeleteMutationUpdate, cardEditMutationUpdate } from "src/gql";
import type { CardDeleteMutation, CardDeleteMutationVariables, CardDetail, CardEditMutation, CardEditMutationVariables } from "src/gqlTypes";

import { wrStyled } from "src/theme";
import { AnchorButton, BorderlessButton, Item } from "src/ui";
import { FrontBackCard, FrontBackCardButtonsBox } from "src/ui-components";

import { identity } from "src/util";
import SelfManagedAnswersEditor from "src/components/editor/SelfManagedAnswersEditor";
import SelfManagedNotesEditor from "src/components/editor/SelfManagedNotesEditor";
import WrDeckDetailCardDeleteModal from "./WrDeckDetailCardDeleteModal";

const StyledItem = wrStyled(Item)`
width: 100%;
border-bottom: 1px solid ${({ theme: { bg } }) => bg[2]};
`;

const DeleteButton = wrStyled(AnchorButton)`
margin: ${({ theme: { space } }) => `0 ${space[2]} 0 0`};
`;

const SetTemplateButton = wrStyled(BorderlessButton)`
${({ theme: { bgfg, fg } }) => bgfg(fg[2])}
padding: ${({ theme: { space } }) => `${space[1]} ${space[2]}`};
margin: ${({ theme: { space } }) => `0 ${space[2]} 0 0`};

&.active, :hover, :focus, :active {
  ${({ theme: { bgfg, fg } }) => bgfg(fg[1])}
}
`;

interface Props {
  template: CardDetail;
}

const WrDeckDetailTemplateItem = ({
  template,
}: Props): JSX.Element => {
  const {
    // eslint-disable-next-line no-shadow
    id, prompt, fullAnswer, answers,
  } = template;
  // eslint-disable-next-line no-shadow
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [mutateDelete, { loading: loadingDelete }] = useMutation<CardDeleteMutation, CardDeleteMutationVariables>(CARD_DELETE_MUTATION, {
    update: cardDeleteMutationUpdate,
  });
  const [mutateEdit, { loading: loadingEdit }] = useMutation<CardEditMutation, CardEditMutationVariables>(CARD_EDIT_MUTATION, {
    update: cardEditMutationUpdate
  });
  const loading = loadingDelete || loadingEdit;
  const handleShowDeleteModal = () => setShowDeleteModal(true);
  const handleHideDeleteModal = () => setShowDeleteModal(false);
  const handleDelete = () => mutateDelete({ variables: {
    id,
  } });
  const handleSetTemplate = () => mutateEdit({ variables: {
    id,
    mainTemplate: true,
  } });
  return <StyledItem key={template.id}>
    {showDeleteModal && <WrDeckDetailCardDeleteModal
      handleClose={handleHideDeleteModal}
      handleDelete={handleDelete}
      template={true}
      card={template}
    />}
    <FrontBackCard
      promptContent={<SelfManagedNotesEditor
        initialContent={prompt as Record<string, unknown>}
        placeholder="Empty prompt"
        handleChange={identity}
        readOnly={true}
      />}
      fullAnswerContent={<SelfManagedNotesEditor
        initialContent={fullAnswer as Record<string, unknown>}
        placeholder="Empty answer"
        handleChange={identity}
        readOnly={true}
      />}
      answersContent={<SelfManagedAnswersEditor
        initialContent={answers}
        handleChange={identity}
        readOnly={true}
      />}
      footer={<FrontBackCardButtonsBox>
        <DeleteButton onClick={handleShowDeleteModal} disabled={loading}>delete</DeleteButton>
        <SetTemplateButton onClick={handleSetTemplate} disabled={loading}>Use Template</SetTemplateButton>
      </FrontBackCardButtonsBox>}
    />
  </StyledItem>;
};

export default WrDeckDetailTemplateItem;
