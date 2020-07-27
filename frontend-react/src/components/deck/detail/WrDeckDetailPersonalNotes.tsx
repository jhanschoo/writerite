import React, { useState } from "react";
import { useDebouncedCallback } from "use-debounce";
import { RawDraftContentState } from "draft-js";
import equal from "fast-deep-equal/es6/react";

import gql from "graphql-tag";
import { useMutation, useQuery } from "@apollo/client";
import { DEBOUNCE_DELAY } from "../../../util";
import { USER_DECK_RECORD_SCALARS } from "../../../client-models";
import { OwnDeckRecord, OwnDeckRecordVariables } from "./gqlTypes/OwnDeckRecord";
import { OwnDeckRecordSet, OwnDeckRecordSetVariables } from "./gqlTypes/OwnDeckRecordSet";

import { wrStyled } from "../../../theme";

import NotesEditor from "../../editor/NotesEditor";

const OWN_DECK_RECORD_QUERY = gql`
${USER_DECK_RECORD_SCALARS}
query OwnDeckRecord($deckId: ID!) {
  ownDeckRecord(deckId: $deckId) {
    ...UserDeckRecordScalars
  }
}
`;

const OWN_DECK_RECORD_SET_MUTATION = gql`
${USER_DECK_RECORD_SCALARS}
mutation OwnDeckRecordSet(
  $deckId: ID!
  $notes: JsonObject
) {
  ownDeckRecordSet(
    deckId: $deckId
    notes: $notes
  ) {
    ...UserDeckRecordScalars
  }
}
`;

const StyledOuterBox = wrStyled.div`
flex-direction: column;
align-items: stretch;
`;

const StyledInnerBox = wrStyled.article`
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

const NotesStatus = wrStyled.p`
margin: ${({ theme: { space } }) => `0 0 0 ${space[1]}`};
font-size: ${({ theme: { scale } }) => scale[0]};
`;

const StyledContent = wrStyled.div`
margin: ${({ theme: { space } }) => space[2]};
padding: ${({ theme: { space } }) => `0 ${space[3]} ${space[3]} ${space[3]}`};
`;

interface Props {
  deckId: string;
}

const WrDeckDetailPersonalNotes = ({
  deckId,
}: Props): JSX.Element => {
  const {
    loading, data,
  } = useQuery<OwnDeckRecord, OwnDeckRecordVariables>(OWN_DECK_RECORD_QUERY, {
    variables: { deckId },
  });
  const notes = (data?.ownDeckRecord?.notes ?? {}) as RawDraftContentState | Record<string, unknown>;
  const [currentNotes, setCurrentNotes] = useState(notes);
  const [debounceOngoing, setDebounceOngoing] = useState(false);
  const mutateOpts = { variables: {
    deckId,
    notes: currentNotes as Record<string, unknown>,
  } };
  const [mutate, { loading: loadingMutation }] = useMutation<OwnDeckRecordSet, OwnDeckRecordSetVariables>(OWN_DECK_RECORD_SET_MUTATION, {
    onCompleted(data) {
      // no-op if debounce will trigger
      if (debounceOngoing) {
        return;
      }
      // debounce has fired a no-op before flight returned; we now fire a new mutation
      if (data.ownDeckRecordSet && !equal(currentNotes, data.ownDeckRecordSet.notes)) {
        void mutate(mutateOpts);
      }
    },
  });
  const [notesCallback] = useDebouncedCallback(() => {
    setDebounceOngoing(false);
    // no-op if a mutation is already in-flight
    if (loadingMutation || currentNotes === notes) {
      return;
    }
    void mutate(mutateOpts);
  }, DEBOUNCE_DELAY);
  const handleChange = (newNotes: RawDraftContentState) => {
    setCurrentNotes(newNotes);
    setDebounceOngoing(true);
    notesCallback();
  };
  const notesStatus = loadingMutation || !equal(currentNotes, notes)
    ? "saving"
    : undefined;
  return (
    <StyledOuterBox>
      <StyledInnerBox>
        <StyledHeader>
          <h4>Your Goals</h4>
          <NotesStatus>{notesStatus}</NotesStatus>
        </StyledHeader>
        {!loading &&
          <StyledContent>
            <NotesEditor
              initialContent={notes}
              placeholder="Enter a description..."
              onChange={handleChange}
            />
          </StyledContent>
        }
      </StyledInnerBox>
    </StyledOuterBox>
  );
};
export default WrDeckDetailPersonalNotes;
