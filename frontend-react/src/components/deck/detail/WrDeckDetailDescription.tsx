import React, { useEffect, useState } from "react";
import { EditorState, convertToRaw } from "draft-js";
import { useDebouncedCallback } from "use-debounce";
import equal from "fast-deep-equal/es6/react";

import { useMutation } from "@apollo/client";
import { DECK_EDIT_MUTATION } from "../../sharedGql";
import { DeckEdit, DeckEditVariables } from "../../gqlTypes/DeckEdit";

import { wrStyled } from "src/theme";

import { DEBOUNCE_DELAY } from "src/util";
import NotesEditor, { notesEditorStateFromRaw } from "../../editor/NotesEditor";

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

const DescriptionStatus = wrStyled.p`
margin: ${({ theme: { space } }) => `0 0 0 ${space[1]}`};
font-size: ${({ theme: { scale } }) => scale[0]};
`;

const StyledContent = wrStyled.div`
margin: ${({ theme: { space } }) => space[2]};
padding: ${({ theme: { space } }) => `0 ${space[3]} ${space[3]} ${space[3]}`};
`;

interface Props {
  deckId: string;
  description: Record<string, unknown>;
  readOnly?: boolean;
}

const WrDeckDetailDescription = ({
  deckId,
  description,
  readOnly,
}: Props): JSX.Element => {
  const [editorState, setEditorState] = useState(notesEditorStateFromRaw(description));
  const [currentDescription, setCurrentDescription] = useState(description);
  const [debouncing, setDebouncing] = useState(false);
  const mutateOpts = { variables: {
    id: deckId,
    description: currentDescription,
  } };
  const [mutate, { loading }] = useMutation<DeckEdit, DeckEditVariables>(DECK_EDIT_MUTATION, {
    onCompleted(data) {
      // no-op if debounce will trigger
      if (debouncing) {
        return;
      }
      // debounce has fired a no-op before flight returned; we now fire a new mutation
      if (data.deckEdit && !equal(currentDescription, data.deckEdit.description)) {
        void mutate(mutateOpts);
      }
    },
  });
  const [debounce,, call] = useDebouncedCallback(() => {
    setDebouncing(false);
    // no-op if a mutation is already in-flight
    if (loading || equal(currentDescription, description)) {
      return;
    }
    void mutate(mutateOpts);
  }, DEBOUNCE_DELAY);
  useEffect(() => call, [call]);
  const handleChange = (nextEditorState: EditorState) => {
    setCurrentDescription(convertToRaw(nextEditorState.getCurrentContent()) as unknown as Record<string, unknown>);
    setDebouncing(true);
    debounce();
    return nextEditorState;
  };
  const descriptionStatus = loading || !equal(currentDescription, description)
    ? "saving"
    : undefined;
  return (
    <StyledOuterBox>
      <StyledInnerBox>
        <StyledHeader>
          <h4>About this deck</h4>
          <DescriptionStatus>{descriptionStatus}</DescriptionStatus>
        </StyledHeader>
        <StyledContent>
          <NotesEditor
            editorState={editorState}
            setEditorState={setEditorState}
            handleChange={handleChange}
            placeholder={readOnly ? "No description" : "Enter a description..."}
            readOnly={readOnly}
          />
        </StyledContent>
      </StyledInnerBox>
    </StyledOuterBox>
  );
};
export default WrDeckDetailDescription;
