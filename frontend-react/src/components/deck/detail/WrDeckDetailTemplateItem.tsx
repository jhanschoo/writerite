import React, { useState } from "react";

import { useMutation } from "@apollo/client";
import { CARDS_OF_DECK_QUERY, CARD_DELETE_MUTATION } from "../../sharedGql";
import type { CardDelete, CardDeleteVariables } from "../../gqlTypes/CardDelete";
import type { CardsOfDeck, CardsOfDeckVariables } from "../../gqlTypes/CardsOfDeck";
import type { CardDetail } from "../../../client-models/gqlTypes/CardDetail";

import { wrStyled } from "../../../theme";
import { AnchorButton, Item } from "../../../ui";
import { FrontBackCard, FrontBackCardActionsList } from "../../../ui-components";

import { identity } from "../../../util";
import WrDeckDetailCardDeleteModal from "./WrDeckDetailCardDeleteModal";
import SelfManagedNotesEditor from "../../editor/SelfManagedNotesEditor";
import SelfManagedAnswersEditor from "../../editor/SelfManagedAnswersEditor";

const StyledItem = wrStyled(Item)`
width: 100%;
${({ theme: { fgbg, bg } }) => fgbg(bg[3])}
`;

const ActionsItem = wrStyled(Item)``;

const DeleteItem = wrStyled(ActionsItem)`
flex-grow: 1;
justify-content: flex-start;
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
  const [mutateDelete, { loading }] = useMutation<CardDelete, CardDeleteVariables>(CARD_DELETE_MUTATION, {
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
  const handleShowDeleteModal = () => setShowDeleteModal(true);
  const handleHideDeleteModal = () => setShowDeleteModal(false);
  const handleDelete = () => mutateDelete({ variables: {
    id,
  } });
  return (
    <StyledItem key={template.id}>
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
        </FrontBackCardActionsList>}
      />
    </StyledItem>
  );
};

export default WrDeckDetailTemplateItem;
