import React, { useState } from "react";
import { RawDraftContentState } from "draft-js";
import { useDebouncedCallback } from "use-debounce";
import equal from "fast-deep-equal/es6/react";

import { useMutation } from "@apollo/client";
import { DECK_EDIT_MUTATION } from "../sharedGql";
import { DeckEdit, DeckEditVariables } from "../gqlTypes/DeckEdit";

import { wrStyled } from "../../../theme";

import { DEBOUNCE_DELAY } from "../../../util";
import NotesEditor from "../../editor/NotesEditor";

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
  description: RawDraftContentState | Record<string, unknown>;
  readOnly?: boolean;
}

const WrDeckDetailDescription = ({
  deckId,
  description,
  readOnly,
}: Props): JSX.Element => {
  const [currentDescription, setCurrentDescription] = useState(description);
  const [mutate, { loading }] = useMutation<DeckEdit, DeckEditVariables>(DECK_EDIT_MUTATION);
  const [descriptionCallback] = useDebouncedCallback((newDescription: RawDraftContentState) => {
    void mutate({ variables: {
      id: deckId,
      description: newDescription as unknown as Record<string, unknown>,
    } });
  }, DEBOUNCE_DELAY);
  const handleChange = (newDescription: RawDraftContentState) => {
    if (readOnly) {
      return;
    }
    setCurrentDescription(newDescription);
    descriptionCallback(newDescription);
  };
  const descriptionStatus = !equal(description, currentDescription) || loading
    ? "saving"
    : undefined;
  return (
    <StyledOuterBox>
      <StyledInnerBox>
        <StyledHeader>
          <h4>About This Deck</h4>
          <DescriptionStatus>{descriptionStatus}</DescriptionStatus>
        </StyledHeader>
        <StyledContent>
          <NotesEditor
            initialContent={description}
            placeholder={readOnly ? "No description" : "Enter a description..."}
            onChange={handleChange}
            readOnly={readOnly}
          />
        </StyledContent>
      </StyledInnerBox>
    </StyledOuterBox>
  );
};
export default WrDeckDetailDescription;
