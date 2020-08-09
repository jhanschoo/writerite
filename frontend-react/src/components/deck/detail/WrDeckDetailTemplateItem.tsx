import React, { useState } from "react";

import { useMutation } from "@apollo/client";
import type { CardDetail } from "src/client-models/gqlTypes/CardDetail";
import { CARDS_OF_DECK_QUERY, CARD_DELETE_MUTATION, CARD_EDIT_MUTATION } from "src/sharedGql";
import type { CardsOfDeck, CardsOfDeckVariables } from "src/gqlTypes/CardsOfDeck";
import type { CardDelete, CardDeleteVariables } from "src/gqlTypes/CardDelete";
import type { CardEdit, CardEditVariables } from "src/gqlTypes/CardEdit";

import { wrStyled } from "src/theme";
import { AnchorButton, BorderlessButton, Item } from "src/ui";
import { FrontBackCard, FrontBackCardActionsList } from "src/ui-components";

import { identity } from "src/util";
import SelfManagedAnswersEditor from "src/components/editor/SelfManagedAnswersEditor";
import SelfManagedNotesEditor from "src/components/editor/SelfManagedNotesEditor";
import WrDeckDetailCardDeleteModal from "./WrDeckDetailCardDeleteModal";

const StyledItem = wrStyled(Item)`
width: 100%;
border-bottom: 1px solid ${({ theme: { bg } }) => bg[2]};
`;

const ActionsItem = wrStyled(Item)``;

const DeleteItem = wrStyled(ActionsItem)`
flex-grow: 1;
justify-content: flex-start;
`;

const SetTemplateButton = wrStyled(BorderlessButton)`
${({ theme: { bgfg, fg } }) => bgfg(fg[2])}
padding: ${({ theme: { space } }) => `${space[1]} ${space[2]}`};
margin: ${({ theme: { space } }) => `${space[1]} ${space[1]}`};

&.active, :hover, :active, :hover:active {
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
  const [mutateEdit, { loading: loadingEdit }] = useMutation<CardEdit, CardEditVariables>(CARD_EDIT_MUTATION, {
    update(cache, { data }) {
      const newCard = data?.cardEdit;
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
            cardsOfDeck: (cardsOfDeckData?.cardsOfDeck ?? []).map((card) => card && { ...card, mainTemplate: card.id !== newCard.id }),
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
      footer={<FrontBackCardActionsList>
        <DeleteItem>
          <AnchorButton onClick={handleShowDeleteModal} disabled={loading}>delete</AnchorButton>
        </DeleteItem>
        <ActionsItem>
          <SetTemplateButton onClick={handleSetTemplate} disabled={loading}>Use Template</SetTemplateButton>
        </ActionsItem>
      </FrontBackCardActionsList>}
    />
  </StyledItem>;
};

export default WrDeckDetailTemplateItem;
