import React, { useState } from "react";

import { useQuery } from "@apollo/client";
import { CARDS_OF_DECK_QUERY } from "../sharedGql";
import type { CardDetail } from "../../../client-models/gqlTypes/CardDetail";
import type { CardsOfDeck, CardsOfDeckVariables } from "../gqlTypes/CardsOfDeck";

import { wrStyled } from "../../../theme";
import { BorderlessButton } from "../../../ui/Button";
import Loading from "../../../ui-components/Loading";
import { List } from "../../../ui/List";

import WrDeckDetailMainTemplateItem from "./WrDeckDetailMainTemplateItem";
import WrDeckDetailCardItem from "./WrDeckDetailCardItem";

const groupCards = (unsortedCards: readonly (CardDetail | null)[]): [CardDetail[], CardDetail[], CardDetail | null] => {
  const templates: CardDetail[] = [];
  const cards: CardDetail[] = [];
  let mainTemplateCard = null;
  unsortedCards.forEach((card) => {
    if (!card) {
      return;
    }
    const { template, mainTemplate } = card;
    if (template) {
      if (mainTemplate) {
        mainTemplateCard = card;
      } else {
        templates.push(card);
      }
    } else {
      cards.push(card);
    }
  });
  return [cards, templates, mainTemplateCard];
};

const StyledOuterBox = wrStyled.div`
flex-direction: column;
align-items: stretch;
`;

const StyledInnerBox = wrStyled.article`
position: relative;
display: flex;
flex-direction: column;
align-items: stretch;
margin: ${({ theme: { space } }) => `0 ${space[2]} ${space[3]} ${space[2]}`};
padding: 0;
${({ theme: { fgbg, bg } }) => fgbg(bg[2])}
`;

const StyledHeader = wrStyled.header`
display: flex;
align-items: baseline;
padding: ${({ theme: { space } }) => `${space[3]} ${space[3]} ${space[1]} ${space[3]}`};

h4 {
  flex-grow: 1;
  padding: ${({ theme: { space } }) => `${space[1]} ${space[4]} ${space[1]} ${space[2]}`};
  margin: 0;
}
`;

const AddCardButton = wrStyled(BorderlessButton)`
${({ theme: { bgfg, fg } }) => bgfg(fg[2])}
padding: ${({ theme: { space } }) => `${space[2]} ${space[3]}`};

&.active, :hover, :active, :hover:active {
  ${({ theme: { bgfg, fg } }) => bgfg(fg[1])}
}
`;

const StyledContent = wrStyled.div`
margin: ${({ theme: { space } }) => space[2]};
padding: ${({ theme: { space } }) => `0 ${space[3]} ${space[3]} ${space[3]}`};
`;

const TemplateBox = wrStyled(List)`
flex-direction: column;
${({ theme: { fgbg, bg } }) => fgbg(bg[3])}
`;

const SubdeckModalContent = wrStyled.div`
`;

const SubdeckModalTitle = wrStyled.h3`
margin: 0;
padding: ${({ theme: { space } }) => `${space[4]} ${space[4]} ${space[3]} ${space[4]}`};
${({ theme: { bgfg, fg } }) => bgfg(fg[2])}
`;

const SubdeckListBox = wrStyled.div`
padding: ${({ theme: { space } }) => `0 ${space[3]} ${space[3]} ${space[3]}`};
${({ theme: { fgbg, bg } }) => fgbg(bg[3])}
`;

const AddSubdeckButton = wrStyled(BorderlessButton)`
${({ theme: { bgfg, fg } }) => bgfg(fg[2])}
padding: ${({ theme: { space } }) => `${space[2]} ${space[3]}`};

&.active, :hover, :active, :hover:active {
  ${({ theme: { bgfg, fg } }) => bgfg(fg[1])}
}
`;

const StyledList = wrStyled(List)`
flex-direction: column;
`;

interface Props {
  deckId: string;
  readOnly?: boolean;
}

const WrDeckDetailCards = ({
  deckId,
  readOnly,
}: Props): JSX.Element => {
  const [showNewCardModal, setShowNewModal] = useState(false);
  const { loading, error, data } = useQuery<CardsOfDeck, CardsOfDeckVariables>(CARDS_OF_DECK_QUERY, {
    variables: { deckId },
  });
  const [cards, templates, mainTemplate] = groupCards(data?.cardsOfDeck ?? []);
  const cardItems = cards.map((card) => <WrDeckDetailCardItem deckId={deckId} card={card} key={card.id} />);
  const handleShowNewModal = () => setShowNewModal(true);
  const handleHideNewModal = () => setShowNewModal(false);
  return (
    <StyledOuterBox>
      <StyledInnerBox>
        {loading && <Loading />}
        <StyledHeader>
          <h4>Cards</h4>
        </StyledHeader>
        <StyledContent>
          <StyledList>
            {!readOnly && <WrDeckDetailMainTemplateItem deckId={deckId} card={null} key="empty-main-template" />}
            {cardItems}
          </StyledList>
        </StyledContent>
      </StyledInnerBox>
    </StyledOuterBox>
  );
};

export default WrDeckDetailCards;
