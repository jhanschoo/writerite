import React from "react";

import { useQuery } from "@apollo/client";
import { CARDS_OF_DECK_QUERY } from "src/sharedGql";
import type { CardDetail } from "src/client-models/gqlTypes/CardDetail";
import type { CardsOfDeck, CardsOfDeckVariables } from "src/gqlTypes/CardsOfDeck";

import { wrStyled } from "src/theme";
import { Item, List } from "src/ui";

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

const StyledContent = wrStyled.div`
margin: ${({ theme: { space } }) => space[2]};
padding: ${({ theme: { space } }) => `0 ${space[3]} ${space[3]} ${space[3]}`};
`;

const StyledList = wrStyled(List)`
flex-direction: column;
`;

const StyledItem = wrStyled(Item)`
width: 100%;
`;

const StyledEmptyMessage = wrStyled.p`
margin: 0;
padding: ${({ theme: { space } }) => space[3]};
`;

interface Props {
  deckId: string;
  readOnly?: boolean;
}

const WrDeckDetailCards = ({
  deckId,
  readOnly,
}: Props): JSX.Element => {
  const { data } = useQuery<CardsOfDeck, CardsOfDeckVariables>(CARDS_OF_DECK_QUERY, {
    variables: { deckId },
  });
  const [cards, templates, mainTemplate] = groupCards(data?.cardsOfDeck ?? []);
  const cardItems = cards.map((card) => <WrDeckDetailCardItem deckId={deckId} card={card} key={card.id} />);
  return (
    <StyledOuterBox>
      <StyledInnerBox>
        <StyledHeader>
          <h4>Cards</h4>
        </StyledHeader>
        <StyledContent>
          <StyledList>
            {!readOnly && <WrDeckDetailMainTemplateItem
              deckId={deckId}
              card={mainTemplate}
              key={mainTemplate?.id ?? "empty-main-template"}
              templates={templates}
            />}
            {!cardItems.length && <StyledItem key="empty-message">
              <StyledEmptyMessage>There are no cards to show.</StyledEmptyMessage>
            </StyledItem>}
            {cardItems}
          </StyledList>
        </StyledContent>
      </StyledInnerBox>
    </StyledOuterBox>
  );
};

export default WrDeckDetailCards;
