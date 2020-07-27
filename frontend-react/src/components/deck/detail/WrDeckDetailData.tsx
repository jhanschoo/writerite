import React, { useState } from "react";
import moment from "moment";
import { useDebouncedCallback } from "use-debounce";

import { useMutation } from "@apollo/client";
import { DECK_EDIT_MUTATION } from "../sharedGql";
import { DeckScalars } from "../../../client-models/gqlTypes/DeckScalars";
import { DeckEdit, DeckEditVariables } from "../gqlTypes/DeckEdit";

import { wrStyled } from "../../../theme";

import { DEBOUNCE_DELAY } from "../../../util";
import LineEditor from "../../editor/LineEditor";

const StyledOuterBox = wrStyled.div`
flex-direction: column;
align-items: stretch;
width: 100%;
`;

const StyledInnerBox = wrStyled.article`
display: flex;
flex-direction: column;
align-items: stretch;
margin: 0 ${({ theme: { space } }) => space[2]} ${({ theme: { space } }) => space[3]} ${({ theme: { space } }) => space[2]};
padding: 0;
${({ theme: { fgbg, bg } }) => fgbg(bg[2])}
`;

const DeckInfoBox = wrStyled.div`
width: 33%;
display: flex;
flex-direction: column;

@media (max-width: ${({ theme: { breakpoints } }) => breakpoints[1]}) {
  width: 100%;
}

`;

const StyledHeader = wrStyled.header`
display: flex;
align-items: baseline;
padding: ${({ theme: { space } }) => `${space[3]} ${space[3]} ${space[1]} ${space[3]}`};

h4 {
  margin: 0;
  max-width: fit-content;
  padding: ${({ theme: { space } }) => `${space[1]} ${space[4]} ${space[1]} ${space[2]}`};
}

.DraftEditor-root {
  flex-grow: 1;
  flex-shrink: 1;
  overflow: hidden;
  margin: 0;

  h4 {
    ${({ theme: { bgfg, fg } }) => bgfg(fg[2])}
  }
}
`;

const DeckTitleStatus = wrStyled.p`
margin: ${({ theme: { space } }) => `0 0 0 ${space[1]}`};
font-size: ${({ theme: { scale } }) => scale[0]};
`;

const DeckStatistics = wrStyled.div`
margin: ${({ theme: { space } }) => space[2]};
font-size: ${({ theme: { scale } }) => scale[0]};
padding: ${({ theme: { space } }) => `0 ${space[3]} ${space[3]} ${space[3]}`};
`;

const isNonemptyString = (s: string) => Boolean(s.trim());

interface Props {
  deck: DeckScalars;
  readOnly: boolean;
}

const WrDeckDetailData = ({
  deck,
  readOnly,
}: Props): JSX.Element => {
  const [currentTitle, setCurrentTitle] = useState(deck.name);
  const [debounceOngoing, setDebounceOngoing] = useState(false);
  const mutateOpts = { variables: {
    id: deck.id,
    name: currentTitle,
  } };
  const [mutate, { loading }] = useMutation<DeckEdit, DeckEditVariables>(DECK_EDIT_MUTATION, {
    onCompleted(data) {
      // no-op if debounce will trigger
      if (debounceOngoing) {
        return;
      }
      // debounce has fired in no-op before flight returned; we now fire a new mutation
      if (data.deckEdit && currentTitle !== data.deckEdit.name) {
        void mutate(mutateOpts);
      }
    },
  });
  const [titleCallback] = useDebouncedCallback(() => {
    setDebounceOngoing(false);
    // re: loading: no-op if a mutation is already in-flight
    if (loading || currentTitle === deck.name || !currentTitle) {
      return;
    }
    void mutate(mutateOpts);
  }, DEBOUNCE_DELAY);
  const handleChange = (newTitle: string) => {
    if (readOnly) {
      return;
    }
    const title = newTitle.trim();
    setCurrentTitle(title);
    setDebounceOngoing(true);
    titleCallback();
  };
  const now = moment.utc();
  const deckTitleStatus = currentTitle === ""
    ? "invalid"
    : loading || currentTitle !== deck.name
      ? "saving"
      : undefined;
  return (
    <DeckInfoBox>
      <StyledOuterBox>
        <StyledInnerBox>
          <StyledHeader>
            <LineEditor
              initialString={deck.name}
              onChange={handleChange}
              filterOnBlur={isNonemptyString}
              tag="h4"
              readOnly={readOnly}
            />
            <DeckTitleStatus>{deckTitleStatus}</DeckTitleStatus>
          </StyledHeader>
          <DeckStatistics>
            {`used ${moment.duration(moment.utc(deck.usedAt).diff(now)).humanize()} ago`}
            <br />
            {`edited ${moment.duration(moment.utc(deck.editedAt).diff(now)).humanize()} ago`}
          </DeckStatistics>
        </StyledInnerBox>
      </StyledOuterBox>
      <StyledOuterBox>
        <StyledInnerBox>
          <StyledHeader>
            <h4>Actions Placeholder</h4>
          </StyledHeader>
        </StyledInnerBox>
      </StyledOuterBox>
    </DeckInfoBox>
  );
};

export default WrDeckDetailData;
