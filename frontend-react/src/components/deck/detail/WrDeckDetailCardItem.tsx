import React, { useEffect, useState } from "react";
import { useDebouncedCallback } from "use-debounce";
import { EditorState, convertToRaw } from "draft-js";
import equal from "fast-deep-equal/es6/react";

import { useMutation } from "@apollo/client";
import { CARDS_OF_DECK_QUERY, CARD_DELETE_MUTATION, CARD_EDIT_MUTATION } from "../../sharedGql";
import type { CardEdit, CardEditVariables } from "../../gqlTypes/CardEdit";
import type { CardDelete, CardDeleteVariables } from "../../gqlTypes/CardDelete";
import type { CardsOfDeck, CardsOfDeckVariables } from "../../gqlTypes/CardsOfDeck";
import type { CardDetail } from "../../../client-models/gqlTypes/CardDetail";

import { wrStyled } from "../../../theme";
import { AnchorButton, BorderlessButton, Item } from "../../../ui";
import { FrontBackCard, FrontBackCardActionsList } from "../../../ui-components";
import { DEBOUNCE_DELAY } from "../../../util";

import type { CardFields } from "../../../types";
import WrDeckDetailCardDeleteModal from "./WrDeckDetailCardDeleteModal";
import AnswersEditor, { answersEditorStateFromStringArray, answersEditorStateToStringArray, prependAnswer, rawToAnswer } from "../../editor/AnswersEditor";
import SelfManagedNotesEditor from "../../editor/SelfManagedNotesEditor";

const StyledItem = wrStyled(Item)`
width: 100%;
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
  const [mutate, { loading }] = useMutation<CardEdit, CardEditVariables>(CARD_EDIT_MUTATION, {
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
  const [mutateDelete, { loading: loadingDelete }] = useMutation<CardDelete, CardDeleteVariables>(CARD_DELETE_MUTATION, {
    update(cache, { data }) {
      const deletedCard = data?.cardDelete;
      if (deletedCard) {
        // update CardsOfDeck query of the same deckId
        try {
          const cardsOfDeckQuery = {
            query: CARDS_OF_DECK_QUERY,
            variables: { deckId: deletedCard.deckId },
          };
          const cardsOfDeckData = cache.readQuery<CardsOfDeck, CardsOfDeckVariables>(cardsOfDeckQuery);
          if (!cardsOfDeckData?.cardsOfDeck) {
            return;
          }
          const newCardsOfDeckData: CardsOfDeck = {
            ...cardsOfDeckData,
            // eslint-disable-next-line no-shadow
            cardsOfDeck: cardsOfDeckData.cardsOfDeck.filter((card) => card?.id !== deletedCard.id),
          };
          cache.writeQuery<CardsOfDeck, CardsOfDeckVariables>({
            ...cardsOfDeckQuery,
            data: newCardsOfDeckData,
          });
        } catch (_e) {
          // noop
        }
      }
    },
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
  return (
    <StyledItem>
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
    </StyledItem>
  );
};

export default WrDeckDetailCardItem;
