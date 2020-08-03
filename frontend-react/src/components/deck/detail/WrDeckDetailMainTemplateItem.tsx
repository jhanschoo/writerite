import React, { useState } from "react";
import { EditorState, convertToRaw } from "draft-js";

import { MutationUpdaterFn, useMutation } from "@apollo/client";
import { CARDS_OF_DECK_QUERY, CARD_CREATE_MUTATION, CARD_DELETE_MUTATION, CARD_EDIT_MUTATION } from "../../sharedGql";
import type { CardCreate, CardCreateVariables } from "../../gqlTypes/CardCreate";
import type { CardEdit, CardEditVariables } from "../../gqlTypes/CardEdit";
import type { CardDelete, CardDeleteVariables } from "../../gqlTypes/CardDelete";
import type { CardsOfDeck, CardsOfDeckVariables } from "../../gqlTypes/CardsOfDeck";
import type { CardDetail } from "../../../client-models/gqlTypes/CardDetail";

import { wrStyled } from "../../../theme";
import { AnchorButton, BorderlessButton, Item, List } from "../../../ui";
import { FrontBackCard, FrontBackCardActionsList, Modal } from "../../../ui-components";

import { emptyFields, emptyRawContent, identity, pushRawContent } from "../../../util";
import NotesEditor, { notesEditorStateFromRaw } from "../../editor/NotesEditor";
import WrDeckDetailCardDeleteModal from "./WrDeckDetailCardDeleteModal";
import WrDeckDetailTemplateItem from "./WrDeckDetailTemplateItem";
import AnswersEditor, { answersEditorStateFromStringArray, answersEditorStateToStringArray, pushStringArray } from "../../editor/AnswersEditor";

const StyledList = wrStyled(List)`
flex-direction: column;
min-width: 50vw;
`;

const StyledEmptyMessage = wrStyled.p`
margin: 0;
padding: ${({ theme: { space } }) => space[3]};
`;

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
${({ theme: { fgbg, bg } }) => fgbg(bg[1])}
padding: ${({ theme: { space } }) => `${space[1]} ${space[2]}`};
margin: ${({ theme: { space } }) => `${space[1]} ${space[1]}`};
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
  const [promptEditorState, setPromptEditorState] = useState(notesEditorStateFromRaw(prompt as Record<string, unknown>));
  const [fullAnswerEditorState, setFullAnswerEditorState] = useState(notesEditorStateFromRaw(fullAnswer as Record<string, unknown>));
  const [answersEditorState, setAnswersEditorState] = useState(answersEditorStateFromStringArray(answers));
  const [currentFields, setCurrentFields] = useState(initialFields);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showTemplatesModal, setShowTemplatesModal] = useState(false);
  console.log(convertToRaw(answersEditorState.getCurrentContent()));
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
    setPromptEditorState(pushRawContent(pushRawContent(promptEditorState, emptyRawContent, "remove-range"), prompt as Record<string, unknown>, "insert-fragment"));
    setFullAnswerEditorState(pushRawContent(pushRawContent(fullAnswerEditorState, emptyRawContent, "remove-range"), fullAnswer as Record<string, unknown>, "insert-fragment"));
    setAnswersEditorState(pushStringArray(pushRawContent(answersEditorState, emptyRawContent, "remove-range"), answers, "insert-fragment"));
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
    setPromptEditorState(pushRawContent(promptEditorState, emptyRawContent, "remove-range"));
    setFullAnswerEditorState(pushRawContent(fullAnswerEditorState, emptyRawContent, "remove-range"));
    setAnswersEditorState(pushRawContent(answersEditorState, emptyRawContent, "remove-range"));
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
  const handleDelete = () => {
    if (id) {
      void mutateDelete({ variables: {
        id,
      } });
    }
    setCurrentFields(emptyFields);
    setPromptEditorState(pushRawContent(promptEditorState, emptyRawContent, "remove-range"));
    setFullAnswerEditorState(pushRawContent(fullAnswerEditorState, emptyRawContent, "remove-range"));
    setAnswersEditorState(pushRawContent(answersEditorState, emptyRawContent, "remove-range"));
  };
  const loading = loadingCreate || loadingEdit || loadingDelete;
  const templateItems = templates.map((template) => <WrDeckDetailTemplateItem key={template.id} template={template} />);
  return (
    <StyledItem>
      {showTemplatesModal && <Modal handleClose={handleHideTemplatesModal}>
        <StyledList>
          {!templateItems.length && <StyledItem key="empty-message">
            <StyledEmptyMessage>There are no filed templates to show.</StyledEmptyMessage>
          </StyledItem>}
          {templateItems}
        </StyledList>
      </Modal>}
      {showDeleteModal && <WrDeckDetailCardDeleteModal
        handleClose={handleHideDeleteModal}
        handleDelete={handleDelete}
        template={true}
        card={card}
      />}
      <FrontBackCard
        header={<StyledHeader>
          <h4>current template</h4>
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
            <SecondaryButton onClick={handleFileAway} disabled={loading}>File Away</SecondaryButton>
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
