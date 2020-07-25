import React, { useState } from "react";
import type { RawDraftContentState } from "draft-js";

import { useParams } from "react-router";

import { useSelector } from "react-redux";
import type { WrState } from "../../../store";

import gql from "graphql-tag";
import { useMutation, useQuery } from "@apollo/client";
import { DECK_DETAIL, DECK_SCALARS } from "../../../client-models";
import type { DeckScalars } from "../../../client-models/gqlTypes/DeckScalars";
import type { DeckDetail, DeckDetailVariables } from "./gqlTypes/DeckDetail";
import type { DeckEdit, DeckEditVariables } from "./gqlTypes/DeckEdit";

import { wrStyled } from "../../../theme";
import Main from "../../../ui/layout/Main";
import { MinimalLink } from "../../../ui/Link";

import WrDeckDetailData from "./WrDeckDetailData";
import WrDeckDetailDescription from "./WrDeckDetailDescription";
import WrDeckDetailPersonalNotes from "./WrDeckDetailPersonalNotes";
import WrDeckDetailSubdecks from "./WrDeckDetailSubdecks";
import WrDeckDetailTemplatesAndCards from "./WrDeckDetailTemplatesAndCards";

const DECK_DETAIL_QUERY = gql`
${DECK_DETAIL}
query DeckDetail($deckId: ID!) {
  deck(id: $deckId) {
    ...DeckDetail
  }
}
`;

const DECK_EDIT_MUTATION = gql`
${DECK_SCALARS}
mutation DeckEdit(
  $deckId: ID!
  $name: String
  $description: JsonObject
  $promptLang: String
  $answerLang: String
  $published: Boolean
) {
  deckEdit(
    id: $deckId
    name: $name
    description: $description
    promptLang: $promptLang
    answerLang: $answerLang
    published: $published
  ) {
    ...DeckScalars
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

enum LastMutated {
  TITLE,
  DESCRIPTION,
}

const WrDeckDetail = (): JSX.Element => {
  const { deckId } = useParams<{ deckId: string }>();
  const [lastMutated, setLastMutated] = useState(LastMutated.TITLE);
  const id = useSelector<WrState, string | undefined>((state) => state.signin?.session?.user.id);
  const {
    loading, error, data,
  } = useQuery<DeckDetail, DeckDetailVariables>(DECK_DETAIL_QUERY, {
    variables: { deckId },
  });
  const [mutate, { loading: mutationLoading }] = useMutation<DeckEdit, DeckEditVariables>(DECK_EDIT_MUTATION);
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
  const mutateWithVariables = (variables: Partial<DeckEditVariables>) => mutate({ variables: {
    deckId,
    name: deck.name,
    ...variables,
  } });
  const subdecks = deck.subdecks?.filter((subdeck): subdeck is DeckScalars => subdeck !== null) ?? [];
  // Note: component is keyed to force refresh on route change.
  return (
    <StyledMain key={`${deckId}-WrDeckDetail`}>
      <BackLink to="/deck/list">←back to Decks</BackLink>
      <DeckDataBox>
        <WrDeckDetailData
          deck={deck}
          mutateWithVariables={mutateWithVariables}
          onMutation={() => setLastMutated(LastMutated.TITLE)}
          // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
          saving={mutationLoading && lastMutated === LastMutated.TITLE}
          readOnly={readOnly}
        />
        <NotesBox>
          <WrDeckDetailDescription
            description={deck.description as (RawDraftContentState | Record<string, unknown>)}
            mutateWithVariables={mutateWithVariables}
            onMutation={() => setLastMutated(LastMutated.DESCRIPTION)}
            saving={mutationLoading && lastMutated === LastMutated.DESCRIPTION}
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
      <WrDeckDetailTemplatesAndCards
        deckId={deckId}
      />
    </StyledMain>
  );
};

export default WrDeckDetail;
