import React from "react";

import { useParams } from "react-router";

import { useSelector } from "react-redux";
import type { WrState } from "../../../store";

import gql from "graphql-tag";
import { useQuery } from "@apollo/client";
import { DECK_DETAIL } from "../../../client-models";
import type { DeckScalars } from "../../../client-models/gqlTypes/DeckScalars";
import type { DeckDetail, DeckDetailVariables } from "./gqlTypes/DeckDetail";

import { wrStyled } from "../../../theme";
import { Main, MinimalLink } from "../../../ui";

import WrDeckDetailData from "./WrDeckDetailData";
import WrDeckDetailDescription from "./WrDeckDetailDescription";
import WrDeckDetailPersonalNotes from "./WrDeckDetailPersonalNotes";
import WrDeckDetailSubdecks from "./WrDeckDetailSubdecks";
import WrDeckDetailCards from "./WrDeckDetailCards";

const DECK_DETAIL_QUERY = gql`
${DECK_DETAIL}
query DeckDetail($deckId: ID!) {
  deck(id: $deckId) {
    ...DeckDetail
  }
}
`;

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
  const {
    loading, error, data,
  } = useQuery<DeckDetail, DeckDetailVariables>(DECK_DETAIL_QUERY, {
    variables: { deckId },
  });
  if (error) {
    return <Main/>;
  }
  if (loading) {
    return <Main><p>Retrieving deck...</p></Main>;
  }
  if (!data?.deck) {
    return <Main><p>Error retrieving deck. Please try again later.</p></Main>;
  }
  const { deck } = data;
  const readOnly = deck.ownerId !== id;
  const subdecks = deck.subdecks?.filter((subdeck): subdeck is DeckScalars => subdeck !== null) ?? [];
  // Note: component is keyed to force refresh on route change.
  return (
    <StyledMain key={`${deckId}-WrDeckDetail`}>
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
      />
    </StyledMain>
  );
};

export default WrDeckDetail;
