import React, { useState } from "react";
import { EditorChangeType, EditorState, convertToRaw } from "draft-js";

import { MutationUpdaterFn, useMutation } from "@apollo/client";
import type { CardDetail } from "src/client-models/gqlTypes/CardDetail";
import { CARDS_OF_DECK_QUERY, CARD_CREATE_MUTATION, CARD_DELETE_MUTATION, CARD_EDIT_MUTATION } from "src/sharedGql";
import type { CardsOfDeck, CardsOfDeckVariables } from "src/gqlTypes/CardsOfDeck";
import type { CardCreate, CardCreateVariables } from "src/gqlTypes/CardCreate";
import type { CardDelete, CardDeleteVariables } from "src/gqlTypes/CardDelete";
import type { CardEdit, CardEditVariables } from "src/gqlTypes/CardEdit";

import { wrStyled } from "src/theme";
import { AnchorButton, BorderlessButton, Item } from "src/ui";
import { FrontBackCard, FrontBackCardActionsList } from "src/ui-components";

import { emptyFields, emptyRawContent, pushRawContent } from "src/util";
import AnswersEditor, { answersEditorStateFromStringArray, answersEditorStateToStringArray, prependAnswer, pushStringArray, rawToAnswer } from "src/components/editor/AnswersEditor";
import NotesEditor, { notesEditorStateFromRaw } from "src/components/editor/NotesEditor";
import WrDeckDetailCardDeleteModal from "./WrDeckDetailCardDeleteModal";
import WrDeckDetailFiledTemplatesModal from "./WrDeckDetailFiledTemplatesModal";

const StyledItem = wrStyled(Item)`
width: 100%;
${({ theme: { fgbg, bg } }) => fgbg(bg[3])}
`;

const StyledHeader = wrStyled.header`
display: flex;
width: 100%;
align-items: baseline;
padding: ${({ theme: { space } }) => `${space[2]} ${space[3]}`};

h4, h5, h6 {
  flex-grow: 1;
  padding: ${({ theme: { space } }) => `0 ${space[4]} 0 ${space[2]}`};
  margin: 0;
}
`;

const ShowTemplatesButton = wrStyled(BorderlessButton)`
${({ theme: { bgfg, fg } }) => bgfg(fg[2])}
padding: ${({ theme: { space } }) => `${space[2]} ${space[3]}`};

&.active, :hover, :active, :hover:active {
  ${({ theme: { bgfg, fg } }) => bgfg(fg[1])}
}
`;

const ActionsItem = wrStyled(Item)``;

const DeleteItem = wrStyled(ActionsItem)`
flex-grow: 1;
justify-content: flex-start;
`;

const AddCardButton = wrStyled(BorderlessButton)`
${({ theme: { bgfg, fg } }) => bgfg(fg[2])}
padding: ${({ theme: { space } }) => `${space[1]} ${space[2]}`};
margin: ${({ theme: { space } }) => `${space[1]} ${space[1]}`};

&.active, :hover, :active, :hover:active {
  ${({ theme: { bgfg, fg } }) => bgfg(fg[1])}
}
`;

const SecondaryButton = wrStyled(BorderlessButton)`
${({ theme: { fgbg, bg } }) => fgbg(bg[2])}
padding: ${({ theme: { space } }) => `${space[1]} ${space[2]}`};
margin: ${({ theme: { space } }) => `${space[1]} ${space[1]}`};
`;

const StyledAnswer = wrStyled.span`
${({ theme: { bgfg, fg } }) => bgfg(fg[2])}
padding: ${({ theme: { space } }) => space[1]};
font-weight: normal;
`;

interface Props {
  deckId: string;
  card: CardDetail | null;
  templates: CardDetail[];
}

interface Fields {
  prompt: Record<string, unknown>;
  fullAnswer: Record<string, unknown>;
  answers: string[];
}

type FieldsEditorStates = [EditorState, EditorState, EditorState];
type Pusher<T> = (state: EditorState, content: T, changeType: EditorChangeType) => EditorState;
const pushEmptyStates = (states: FieldsEditorStates): FieldsEditorStates =>
  states.map((state) => pushRawContent(state, emptyRawContent, "remove-range")) as FieldsEditorStates;
const pushContent = <T, U, V>(states: FieldsEditorStates, pushers: [Pusher<T>, Pusher<U>, Pusher<V>], contents: [T, U, V]) =>
  [null, null, null].map((_null, n: number) => pushers[n](states[n], contents[n] as T & U & V, "insert-fragment")) as FieldsEditorStates;
const fieldPushers: [Pusher<Record<string, unknown>>, Pusher<Record<string, unknown>>, Pusher<readonly string[]>] = [pushRawContent, pushRawContent, pushStringArray];

const WrDeckDetailMainTemplateItem = ({
  deckId,
  card,
  templates,
}: Props): JSX.Element => {
  const {
    // eslint-disable-next-line no-shadow
    id, prompt, fullAnswer, answers,
  } = card ?? {
    id: null,
    ...emptyFields,
  };
  const initialFields = { prompt, fullAnswer, answers } as Fields;
  const [promptEditorState, setPromptEditorState] =
    useState(notesEditorStateFromRaw(prompt as Record<string, unknown>));
  const [fullAnswerEditorState, setFullAnswerEditorState] =
    useState(notesEditorStateFromRaw(fullAnswer as Record<string, unknown>));
  const [answersEditorState, setAnswersEditorState] =
    useState(answersEditorStateFromStringArray(answers));
  const [currentFields, setCurrentFields] = useState(initialFields);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showTemplatesModal, setShowTemplatesModal] = useState(false);
  const setEditorStates = ([promptState, fullAnswerState, answersState]: FieldsEditorStates) => {
    setPromptEditorState(promptState);
    setFullAnswerEditorState(fullAnswerState);
    setAnswersEditorState(answersState);
  };
  const update: MutationUpdaterFn<CardCreate> = (cache, { data }) => {
    const newCard = data?.cardCreate;
    if (newCard) {
      // update CardsOfDeck query of the same deckId
      try {
        const cardsOfDeckQuery = {
          query: CARDS_OF_DECK_QUERY,
          variables: { deckId: newCard.deckId },
        };
        const cardsOfDeckData = cache.readQuery<CardsOfDeck, CardsOfDeckVariables>(cardsOfDeckQuery);
        const newCardsOfDeckData: CardsOfDeck = {
          ...cardsOfDeckData ?? {},
          cardsOfDeck: [newCard, ...cardsOfDeckData?.cardsOfDeck ?? []],
        };
        cache.writeQuery<CardsOfDeck, CardsOfDeckVariables>({
          ...cardsOfDeckQuery,
          data: newCardsOfDeckData,
        });
      } catch (_e) {
        // noop
      }
    }
  };
  const [mutateAddCard] = useMutation<CardCreate, CardCreateVariables>(CARD_CREATE_MUTATION, {
    update,
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
  const [mutateEditTemplate, { loading: loadingEdit }] =
    useMutation<CardEdit, CardEditVariables>(CARD_EDIT_MUTATION);
  const [mutateCreateTemplate, { loading: loadingCreate }] =
    useMutation<CardCreate, CardCreateVariables>(CARD_CREATE_MUTATION, { update });
  const handleAddCard = () => {
    void mutateAddCard({ variables: {
      deckId,
      card: currentFields,
      mainTemplate: false,
    } });
    setCurrentFields(initialFields);
    setEditorStates(pushContent(
      pushEmptyStates([promptEditorState, fullAnswerEditorState, answersEditorState]),
      fieldPushers,
      [prompt as Record<string, unknown>, fullAnswer as Record<string, unknown>, answers],
    ));
  };
  const handleSave = () => {
    if (id) {
      void mutateEditTemplate({ variables: { id, ...currentFields } });
    } else {
      void mutateCreateTemplate({ variables: { deckId, card: { ...currentFields, template: true }, mainTemplate: true } });
    }
    // note: id field is wrong value while creation in-flight, thus handleSave, handleFileAway are disabled till it resolves
  };
  const handleFileAway = () => {
    if (id) {
      void mutateEditTemplate({ variables: { id, ...currentFields, mainTemplate: false } });
    } else {
      void mutateCreateTemplate({ variables: { deckId, card: { ...currentFields, template: true }, mainTemplate: false } });
    }
    // note: id field is wrong value while creation in-flight, thus handleSave, handleFileAway are disabled till it resolves
    setCurrentFields(emptyFields);
    setEditorStates(pushEmptyStates([promptEditorState, fullAnswerEditorState, answersEditorState]));
  };
  const handleChange = (newFields: Partial<Fields>) => setCurrentFields({ ...currentFields, ...newFields });
  const handlePromptChange = (nextEditorState: EditorState) => {
    handleChange({
      prompt: convertToRaw(nextEditorState.getCurrentContent()) as unknown as Record<string, unknown>,
    });
    return nextEditorState;
  };
  const handleFullAnswerChange = (nextEditorState: EditorState) => {
    handleChange({
      fullAnswer: convertToRaw(nextEditorState.getCurrentContent()) as unknown as Record<string, unknown>,
    });
    return nextEditorState;
  };
  const handleAnswersChange = (nextEditorState: EditorState) => {
    handleChange({ answers: answersEditorStateToStringArray(nextEditorState) });
    return nextEditorState;
  };
  const handleShowDeleteModal = () => setShowDeleteModal(true);
  const handleHideDeleteModal = () => setShowDeleteModal(false);
  const handleShowTemplatesModal = () => setShowTemplatesModal(true);
  const handleHideTemplatesModal = () => setShowTemplatesModal(false);
  const generatedAnswer = rawToAnswer(currentFields.fullAnswer);
  const addGeneratedAnswer = () => {
    const nextEditorState = prependAnswer(answersEditorState, generatedAnswer);
    setAnswersEditorState(nextEditorState);
    handleAnswersChange(nextEditorState);
  };
  const handleDelete = () => {
    if (id) {
      void mutateDelete({ variables: {
        id,
      } });
    }
    setCurrentFields(emptyFields);
    setEditorStates(pushEmptyStates([promptEditorState, fullAnswerEditorState, answersEditorState]));
  };
  const loading = loadingCreate || loadingEdit || loadingDelete;
  return (
    <StyledItem>
      {showTemplatesModal && <WrDeckDetailFiledTemplatesModal
        handleClose={handleHideTemplatesModal}
        templates={templates}
      />}
      {showDeleteModal && <WrDeckDetailCardDeleteModal
        handleClose={handleHideDeleteModal}
        handleDelete={handleDelete}
        template={true}
        card={card}
      />}
      <FrontBackCard
        header={<StyledHeader>
          <h4>Current template</h4>
          <ShowTemplatesButton onClick={handleShowTemplatesModal}>Filed Templates</ShowTemplatesButton>
        </StyledHeader>}
        promptContent={<NotesEditor
          editorState={promptEditorState}
          setEditorState={setPromptEditorState}
          handleChange={handlePromptChange}
          placeholder={"Empty prompt. Try writing something..."}
        />}
        fullAnswerContent={<NotesEditor
          editorState={fullAnswerEditorState}
          setEditorState={setFullAnswerEditorState}
          handleChange={handleFullAnswerChange}
          placeholder={"Empty answer. Try writing something..."}
        />}
        beforeAnswersContent={generatedAnswer &&
          <SecondaryButton onClick={addGeneratedAnswer}>
            add answer:&nbsp;<StyledAnswer>{generatedAnswer}</StyledAnswer>
          </SecondaryButton>
        }
        answersContent={<AnswersEditor
          editorState={answersEditorState}
          setEditorState={setAnswersEditorState}
          handleChange={handleAnswersChange}
        />}
        footer={<FrontBackCardActionsList>
          <DeleteItem>
            <AnchorButton onClick={handleShowDeleteModal} disabled={loading}>delete</AnchorButton>
          </DeleteItem>
          <ActionsItem>
            {/* Following button intentionally does not become disabled upon loading, since unnecessary */}
            <SecondaryButton onClick={handleSave}>Save</SecondaryButton>
          </ActionsItem>
          <ActionsItem>
            <SecondaryButton onClick={handleFileAway} disabled={loading}>File away</SecondaryButton>
          </ActionsItem>
          <ActionsItem>
            <AddCardButton onClick={handleAddCard} disabled={loading}>Save as Card</AddCardButton>
          </ActionsItem>
        </FrontBackCardActionsList>}
      />
    </StyledItem>
  );
};

export default WrDeckDetailMainTemplateItem;
