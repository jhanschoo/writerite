import React, { useState } from "react";
import { useDebouncedCallback } from "use-debounce";
import { RawDraftContentState } from "draft-js";
import equal from "fast-deep-equal/es6/react";


import { wrStyled } from "../../../theme";

import { DEBOUNCE_DELAY } from "../../../util";
import { DeckEditVariables } from "./gqlTypes/DeckEdit";
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
  description: RawDraftContentState | Record<string, unknown>;
  onMutation: () => void;
  mutateWithVariables: (variables: Partial<DeckEditVariables>) => void;
  saving: boolean;
  readOnly?: boolean;
}

const WrDeckDetailDescription = ({
  description,
  onMutation,
  mutateWithVariables,
  saving,
  readOnly,
}: Props): JSX.Element => {
  const [currentDescription, setCurrentDescription] = useState(description);
  const [debouncedDescription, setDebouncedDescription] = useState(description);
  const [descriptionCallback] = useDebouncedCallback((newDescription: RawDraftContentState) => {
    if (equal(newDescription, debouncedDescription)) {
      return;
    }
    setDebouncedDescription(newDescription);
    onMutation();
    mutateWithVariables({ description: newDescription as unknown as Record<string, unknown> });
  }, DEBOUNCE_DELAY);
  const handleChange = (newDescription: RawDraftContentState) => {
    if (equal(newDescription, currentDescription)) {
      return;
    }
    setCurrentDescription(newDescription);
    descriptionCallback(newDescription);
  };
  const descriptionStatus = currentDescription !== debouncedDescription || saving
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
            placeholder="Enter a description..."
            onChange={handleChange}
            readOnly={readOnly}
          />
        </StyledContent>
      </StyledInnerBox>
    </StyledOuterBox>
  );
};
export default WrDeckDetailDescription;
