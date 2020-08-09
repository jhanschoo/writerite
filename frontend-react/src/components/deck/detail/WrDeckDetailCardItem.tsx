import React, { useEffect, useState } from "react";
import { EditorState, convertToRaw } from "draft-js";
import equal from "fast-deep-equal/es6/react";
import { useDebouncedCallback } from "use-debounce";

import { useMutation } from "@apollo/client";
import { CARD_DELETE_MUTATION, CARD_EDIT_MUTATION, cardDeleteMutationUpdate } from "src/gql";
import type { CardDeleteMutation, CardDeleteMutationVariables, CardDetail, CardEditMutation, CardEditMutationVariables } from "src/gqlTypes";

import { wrStyled } from "src/theme";
import { AnchorButton, BorderlessButton, Item } from "src/ui";
import { FrontBackCard, FrontBackCardActionsList } from "src/ui-components";

import { DEBOUNCE_DELAY } from "src/util";
import type { CardFields } from "src/types";
import AnswersEditor, { answersEditorStateFromStringArray, answersEditorStateToStringArray, prependAnswer, rawToAnswer } from "src/components/editor/AnswersEditor";
import SelfManagedNotesEditor from "src/components/editor/SelfManagedNotesEditor";
import WrDeckDetailCardDeleteModal from "./WrDeckDetailCardDeleteModal";

const StyledItem = wrStyled(Item)`
width: 100%;
border-bottom: 1px solid ${({ theme: { bg } }) => bg[3]};
`;

const DeleteItem = wrStyled(Item)`
display: flex;
flex-grow: 1;
justify-content: flex-start;
`;

const AddGeneratedAnswer = wrStyled(BorderlessButton)`
${({ theme: { fgbg, bg } }) => fgbg(bg[3])}
padding: ${({ theme: { space } }) => `${space[1]} ${space[2]}`};
margin: ${({ theme: { space } }) => `${space[1]} ${space[1]}`};
`;

const StyledAnswer = wrStyled.span`
${({ theme: { bgfg, fg } }) => bgfg(fg[2])}
padding: ${({ theme: { space } }) => space[1]};
font-weight: normal;
`;

const DeleteButton = wrStyled(AnchorButton)`
`;

interface Props {
  deckId: string;
  card: CardDetail;
  readOnly?: boolean;
}

const WrDeckDetailCardItem = ({
  card, readOnly,
}: Props): JSX.Element => {
  // eslint-disable-next-line no-shadow
  const { id, prompt, fullAnswer, answers } = card;
  const initialFields = { prompt, fullAnswer, answers } as CardFields;
  const [answersEditorState, setAnswersEditorState] =
    useState(answersEditorStateFromStringArray(answers));
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [currentFields, setCurrentFields] = useState(initialFields);
  const [debouncing, setDebouncing] = useState(false);
  const mutateOpts = { variables: {
    id,
    ...currentFields,
  } };
  const [mutate, { loading }] = useMutation<CardEditMutation, CardEditMutationVariables>(CARD_EDIT_MUTATION, {
    onCompleted(data) {
      if (debouncing) {
        return;
      }
      if (data.cardEdit) {
        // eslint-disable-next-line no-shadow
        const { prompt, fullAnswer, answers } = data.cardEdit;
        if (!equal(currentFields, { prompt, fullAnswer, answers })) {
          void mutate(mutateOpts);
        }
      }
    },
  });
  const [mutateDelete, { loading: loadingDelete }] = useMutation<CardDeleteMutation, CardDeleteMutationVariables>(CARD_DELETE_MUTATION, {
    update: cardDeleteMutationUpdate,
  });
  const [debounce, , call] = useDebouncedCallback(() => {
    setDebouncing(false);
    if (loading || equal(currentFields, initialFields)) {
      return;
    }
    void mutate(mutateOpts);
  }, DEBOUNCE_DELAY);
  useEffect(() => call, [call]);
  const handleChange = (newFields: Partial<CardFields>) => {
    setCurrentFields({ ...currentFields, ...newFields });
    setDebouncing(true);
    debounce();
  };
  const handlePromptChange = (nextEditorState: EditorState) => {
    handleChange({ prompt: convertToRaw(nextEditorState.getCurrentContent()) as unknown as Record<string, unknown> });
    return nextEditorState;
  };
  const handleFullAnswerChange = (nextEditorState: EditorState) => {
    handleChange({ fullAnswer: convertToRaw(nextEditorState.getCurrentContent()) as unknown as Record<string, unknown> });
    return nextEditorState;
  };
  const handleAnswersChange = (nextEditorState: EditorState) => {
    handleChange({ answers: answersEditorStateToStringArray(nextEditorState) });
    return nextEditorState;
  };
  const handleShowDeleteModal = () => setShowDeleteModal(true);
  const handleHideDeleteModal = () => setShowDeleteModal(false);
  const generatedAnswer = rawToAnswer(currentFields.fullAnswer);
  const addGeneratedAnswer = () => {
    const nextAnswersEditorState = prependAnswer(answersEditorState, generatedAnswer);
    setAnswersEditorState(nextAnswersEditorState);
    handleAnswersChange(nextAnswersEditorState);
  };
  const handleDelete = () => {
    if (id) {
      void mutateDelete({ variables: {
        id,
      } });
    }
  };
  const saveStatus = loading || !equal(currentFields, initialFields)
    ? "saving"
    : undefined;
  const disabled = readOnly === true || loadingDelete;
  return <StyledItem>
    {showDeleteModal && <WrDeckDetailCardDeleteModal
      handleClose={handleHideDeleteModal}
      handleDelete={handleDelete}
      template={false}
      card={card}
    />}
    <FrontBackCard
      status={saveStatus}
      promptContent={<SelfManagedNotesEditor
        initialContent={prompt as Record<string, unknown>}
        placeholder={readOnly ? "Empty prompt" : "Write a prompt..."}
        handleChange={handlePromptChange}
        readOnly={disabled}
      />}
      beforeAnswersContent={!readOnly && generatedAnswer &&
        <AddGeneratedAnswer onClick={addGeneratedAnswer}>
          add answer:&nbsp;<StyledAnswer>{generatedAnswer}</StyledAnswer>
        </AddGeneratedAnswer>
      }
      fullAnswerContent={<SelfManagedNotesEditor
        initialContent={fullAnswer as Record<string, unknown>}
        placeholder={readOnly ? "Empty answer" : "Write an answer..."}
        handleChange={handleFullAnswerChange}
        readOnly={disabled}
      />}
      answersContent={<AnswersEditor
        editorState={answersEditorState}
        setEditorState={setAnswersEditorState}
        handleChange={handleAnswersChange}
        readOnly={disabled}
      />}
      footer={<FrontBackCardActionsList>
        <DeleteItem>
          <DeleteButton onClick={handleShowDeleteModal} disabled={disabled}>delete</DeleteButton>
        </DeleteItem>
      </FrontBackCardActionsList>}
    />
  </StyledItem>;
};

export default WrDeckDetailCardItem;
