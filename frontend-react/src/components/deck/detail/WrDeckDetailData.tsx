import React, { useEffect, useRef, useState } from "react";
import { ContentState, Editor, EditorState } from "draft-js";
import moment from "moment";
import { useDebouncedCallback } from "use-debounce";

import { useHistory } from "react-router";

import { useMutation } from "@apollo/client";
import { DECK_EDIT_MUTATION, ROOM_CREATE_MUTATION, roomCreateMutationUpdate } from "src/gql";
import type { DeckEditMutation, DeckEditMutationVariables, DeckScalars, RoomCreateMutation, RoomCreateMutationVariables } from "src/gqlTypes";

import { wrStyled } from "src/theme";
import { BorderlessButton } from "src/ui";

import { DEBOUNCE_DELAY } from "src/util";
import LineEditor, { lineEditorStateFromString } from "src/components/editor/LineEditor";
import WrDeckDetailDownloadCsv from "./WrDeckDetailDownloadCsv";
import WrDeckDetailArchive from "./WrDeckDetailArchive";

const DeckDataBox = wrStyled.div`
width: 33%;
display: flex;
flex-direction: column;

@media (max-width: ${({ theme: { breakpoints } }) => breakpoints[1]}) {
  width: 100%;
}
`;

const DeckInfoBox = wrStyled.article`
display: flex;
flex-direction: column;
align-items: stretch;
margin: 0 ${({ theme: { space } }) => space[2]} ${({ theme: { space } }) => space[3]} ${({ theme: { space } }) => space[2]};
padding: 0;
${({ theme: { fgbg, bg } }) => fgbg(bg[2])}
`;

const StyledHeader = wrStyled.header`
display: flex;
align-items: baseline;
padding: ${({ theme: { space } }) => `${space[3]} ${space[3]} ${space[1]} ${space[3]}`};

h4 {
  margin: 0;
  max-width: fit-content;
  padding: ${({ theme: { space } }) => `${space[1]} ${space[4]} ${space[1]} ${space[2]}`};
  ${({ theme: { bgfg, fg } }) => bgfg(fg[2])}
}

.DraftEditor-root {
  flex-grow: 1;
  flex-shrink: 1;
  overflow: hidden;
  margin: 0;
}
`;

export const ButtonsDiv = wrStyled.div`
display: flex;
flex-direction: row;
flex-wrap: wrap;
align-items: baseline;
margin: ${({ theme: { space } }) => `0 ${space[1]} ${space[1]} ${space[1]}`};
`;

const PrimaryButton = wrStyled(BorderlessButton)`
${({ theme: { bgfg, fg } }) => bgfg(fg[2])}
width: 100%;
flex-grow: 1;
display: flex;
margin: ${({ theme: { space } }) => ` 0 ${space[1]} ${space[2]} ${space[1]}`};
padding: ${({ theme: { space } }) => `${space[2]} ${space[3]}`};

&.active, :hover, :focus, :active {
  ${({ theme: { bgfg, fg } }) => bgfg(fg[1])}
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

interface Props {
  deck: DeckScalars;
  readOnly: boolean;
}

const WrDeckDetailData = ({
  deck,
  readOnly,
}: Props): JSX.Element => {
  // eslint-disable-next-line no-shadow
  const history = useHistory<{ editTitle: boolean } | null>();
  const { editTitle } = history.location.state ?? {};
  const editorEl = useRef<Editor>(null);
  useEffect(() => {
    if (editTitle && readOnly) {
      editorEl.current?.focus();
    }
    if (history.location.state) {
      history.replace(history.location.pathname, null);
    }
  }, [history, editTitle, readOnly]);
  const [editorState, setEditorState] = useState(lineEditorStateFromString(deck.name));
  const [currentTitle, setCurrentTitle] = useState(deck.name);
  const [debouncing, setDebouncing] = useState(false);
  const mutateOpts = { variables: {
    id: deck.id,
    name: currentTitle,
  } };
  const [mutateEdit, { loading }] = useMutation<DeckEditMutation, DeckEditMutationVariables>(DECK_EDIT_MUTATION, {
    onCompleted(data) {
      // no-op if debounce will trigger
      if (debouncing) {
        return;
      }
      // debounce has fired in no-op before flight returned; we now fire a new mutation
      if (data.deckEdit && currentTitle !== data.deckEdit.name) {
        void mutateEdit(mutateOpts);
      }
    },
  });
  const [mutateRoomCreate] = useMutation<RoomCreateMutation, RoomCreateMutationVariables>(ROOM_CREATE_MUTATION, {
    update: roomCreateMutationUpdate,
    onCompleted(data) {
      if (data.roomCreate) {
        history.push(`/room/${data.roomCreate.id}`);
      }
    },
  });
  const [debounce,, call] = useDebouncedCallback(() => {
    setDebouncing(false);
    // re: loading: no-op if a mutation is already in-flight
    if (loading || currentTitle === deck.name || !currentTitle) {
      return;
    }
    void mutateEdit(mutateOpts);
  }, DEBOUNCE_DELAY);
  useEffect(() => call, [call]);
  const handleChange = (newEditorState: EditorState) => {
    const title = newEditorState.getCurrentContent().getPlainText().trim();
    if (title) {
      setCurrentTitle(title);
      setDebouncing(true);
      debounce();
    } else if (!newEditorState.getSelection().getHasFocus()) {
      // changed to empty string: set to single value if blurred
      return EditorState.push(newEditorState, ContentState.createFromText(currentTitle), "insert-characters");
    }
    return newEditorState;
  };
  const handleCreateRoom = () => mutateRoomCreate({ variables: { ownerConfig: { deckId: deck.id } } });
  const now = moment.utc();
  const deckTitleStatus = editorState.getCurrentContent().getPlainText().trim() === ""
    ? "invalid"
    : loading || currentTitle !== deck.name
      ? "saving"
      : undefined;
  return <DeckDataBox>
    <DeckInfoBox>
      <StyledHeader>
        <LineEditor
          editorState={editorState}
          setEditorState={setEditorState}
          handleChange={handleChange}
          tag="h4"
          readOnly={readOnly}
          ref={editorEl}
        />
        <DeckTitleStatus>{deckTitleStatus}</DeckTitleStatus>
      </StyledHeader>
      <DeckStatistics>
        {`used ${moment.duration(moment.utc(deck.usedAt).diff(now)).humanize()} ago`}
        <br />
        {`edited ${moment.duration(moment.utc(deck.editedAt).diff(now)).humanize()} ago`}
      </DeckStatistics>
    </DeckInfoBox>
    <ButtonsDiv>
      <PrimaryButton onClick={handleCreateRoom}>Start Contest</PrimaryButton>
      <WrDeckDetailDownloadCsv name={currentTitle} />
      <WrDeckDetailArchive id={deck.id} />
    </ButtonsDiv>
  </DeckDataBox>;
};

export default WrDeckDetailData;
