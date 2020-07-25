import React, { useState } from "react";

import gql from "graphql-tag";
import { useQuery } from "@apollo/client";
import { CARD_DETAIL } from "../../../client-models";
import type { CardDetail } from "../../../client-models/gqlTypes/CardDetail";
import type { CardsOfDeck, CardsOfDeckVariables } from "./gqlTypes/CardsOfDeck";

import { wrStyled } from "../../../theme";
import { BorderlessButton } from "../../../ui/Button";
import Loading from "../../../ui-components/Loading";
import { List } from "../../../ui/List";

import WrDeckDetailCardItem from "./WrDeckDetailCardItem";

const CARDS_OF_DECK_QUERY = gql`
${CARD_DETAIL}
query CardsOfDeck($deckId: ID!) {
  cardsOfDeck(deckId: $deckId) {
    ...CardDetail
  }
}
`;

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
flex-direction: row;
flex-wrap: wrap;
align-items: stretch;
`;

interface Props {
  deckId: string;
  readOnly?: boolean;
}

const WrDeckDetailTemplatesAndCards = ({
  deckId,
  readOnly,
}: Props): JSX.Element => {
  const [showNewModal, setShowNewModal] = useState(false);
  const { loading, error, data } = useQuery<CardsOfDeck, CardsOfDeckVariables>(CARDS_OF_DECK_QUERY, {
    variables: { deckId },
  });
  const templates = data?.cardsOfDeck?.filter((card): card is CardDetail => card?.template === true) ?? [];
  const cards = data?.cardsOfDeck?.filter((card): card is CardDetail => card?.template === false) ?? [];
  const cardItems = cards.map((card) => <WrDeckDetailCardItem deckId={deckId} card={card} key={card.id} />);
  const handleShowNewModal = () => setShowNewModal(true);
  const handleHideNewModal = () => setShowNewModal(false);
  return (
    <>
      <StyledOuterBox>
        <StyledInnerBox>
          {loading && <Loading />}
          <StyledHeader>
            <h4>Templates</h4>
          </StyledHeader>
          <StyledContent>
            <StyledList>
              {null}
            </StyledList>
          </StyledContent>
        </StyledInnerBox>
      </StyledOuterBox>
      <StyledOuterBox>
        <StyledInnerBox>
          {loading && <Loading />}
          <StyledHeader>
            <h4>Cards</h4>
            {!readOnly && <AddCardButton onClick={handleShowNewModal}>Add Card...</AddCardButton>}
          </StyledHeader>
          <StyledContent>
            <StyledList>
              {cardItems}
            </StyledList>
          </StyledContent>
        </StyledInnerBox>
      </StyledOuterBox>
    </>
  );
};

export default WrDeckDetailTemplatesAndCards;
