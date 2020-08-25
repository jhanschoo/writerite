import React from "react";

import { Dispatch } from "redux";
import { useDispatch, useSelector } from "react-redux";
import type { WrState } from "src/store";
import { SetAllAction, createSetAll } from "./actions";

import { useParams } from "react-router";

import { useQuery } from "@apollo/client";
import { DECK_DETAIL_QUERY } from "src/gql";
import type { CardDetail, DeckDetailQuery, DeckDetailQueryVariables, DeckScalars } from "src/gqlTypes";

import { wrStyled } from "src/theme";
import { Main, MinimalLink } from "src/ui";

import WrDeckDetailCards from "./WrDeckDetailCards";
import WrDeckDetailData from "./WrDeckDetailData";
import WrDeckDetailDescription from "./WrDeckDetailDescription";
import WrDeckDetailPersonalNotes from "./WrDeckDetailPersonalNotes";
import WrDeckDetailSubdecks from "./WrDeckDetailSubdecks";

const BackLink = wrStyled(MinimalLink)`
align-self: flex-start;
font-weight: normal;
font-size: ${({ theme: { scale } }) => scale[0]};
margin: ${({ theme: { space } }) => `${space[1]} 0 ${space[3]} 0`};
`;

const StyledMain = wrStyled(Main)`
padding: ${({ theme: { space } }) => `0 ${space[3]}`};
`;

const DeckDataBox = wrStyled.div`
display: flex;
flex-wrap: wrap;
`;

const NotesBox = wrStyled.div`
width: 67%;
display: flex;
flex-direction: column;

@media (max-width: ${({ theme: { breakpoints } }) => breakpoints[1]}) {
  width: 100%;
}
`;

const WrDeckDetail = (): JSX.Element => {
  const { deckId } = useParams<{ deckId: string }>();
  const id = useSelector<WrState, string | undefined>((state) => state.signin?.session?.user.id);
  const dispatch = useDispatch<Dispatch<SetAllAction>>();
  const { error, data } = useQuery<DeckDetailQuery, DeckDetailQueryVariables>(DECK_DETAIL_QUERY, {
    variables: { id: deckId },
    onCompleted(newData) {
      const cards = newData.deck?.cards?.filter((card): card is CardDetail => card?.template === false);
      if (cards) {
        dispatch(createSetAll(cards));
      }
    },
  });
  if (error) {
    return <StyledMain/>;
  }
  if (!data?.deck) {
    return <StyledMain><p>Retrieving deck...</p></StyledMain>;
  }
  const { deck } = data;
  const readOnly = deck.ownerId !== id;
  const subdecks = deck.subdecks?.filter((subdeck): subdeck is DeckScalars => subdeck !== null) ?? [];
  const cards = deck.cards?.filter((card): card is CardDetail => card !== null) ?? [];
  // Note: component is keyed to force refresh on route change.
  return <StyledMain key={`${deck.id}-WrDeckDetail`}>
    <BackLink to="/deck/list">←back to Decks</BackLink>
    <DeckDataBox>
      <WrDeckDetailData
        deck={deck}
        readOnly={readOnly}
      />
      <NotesBox>
        <WrDeckDetailDescription
          deckId={deck.id}
          description={deck.description as Record<string, unknown>}
          readOnly={readOnly}
        />
        <WrDeckDetailPersonalNotes
          deckId={deck.id}
        />
      </NotesBox>
    </DeckDataBox>
    <WrDeckDetailSubdecks
      deckId={deckId}
      subdecks={subdecks}
      readOnly={readOnly}
    />
    <WrDeckDetailCards
      deckId={deckId}
      cards={cards}
    />
  </StyledMain>;
};

export default WrDeckDetail;
