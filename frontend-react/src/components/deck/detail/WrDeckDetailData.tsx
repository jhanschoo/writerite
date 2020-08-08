import React, { useEffect, useRef, useState } from "react";
import moment from "moment";
import { useDebouncedCallback } from "use-debounce";
import { ContentState, EditorState, Editor } from "draft-js";

import { useHistory } from "react-router";

import { useMutation } from "@apollo/client";
import { DECK_EDIT_MUTATION, ROOM_CREATE_MUTATION } from "../../sharedGql";
import { DeckScalars } from "../../../client-models/gqlTypes/DeckScalars";
import { DeckEdit, DeckEditVariables } from "../../gqlTypes/DeckEdit";
import { RoomCreate } from "../../gqlTypes/RoomCreate";

import { wrStyled } from "../../../theme";
import { BorderlessButton, Item, List } from "../../../ui";

import { DEBOUNCE_DELAY } from "../../../util";
import LineEditor, { lineEditorStateFromString } from "../../editor/LineEditor";

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

export const ActionsList = wrStyled(List)`
flex-direction: row;
flex-wrap: wrap;
align-items: baseline;
margin: ${({ theme: { space } }) => `0 ${space[1]} ${space[1]} ${space[1]}`};
`;

const ActionsItem = wrStyled(Item)`
flex-grow: 1;
display: flex;
margin: ${({ theme: { space } }) => ` 0 ${space[1]} ${space[2]} ${space[1]}`};
`;

const ActionsButton = wrStyled(BorderlessButton)`
${({ theme: { bgfg, fg } }) => bgfg(fg[2])}
flex-grow: 1;
display: flex;
padding: ${({ theme: { space } }) => `${space[2]} ${space[3]}`};

&.active, :hover, :active, :hover:active {
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
  const history = useHistory<{ editTitle?: boolean, deckId?: string } | null>();
  const { editTitle } = history.location.state ?? {};
  const editorEl = useRef<Editor>(null);
  useEffect(() => {
    if (editTitle) {
      editorEl.current?.focus();
    }
    if (history.location.state) {
      history.replace(history.location.pathname, null);
    }
  }, [history, editTitle]);
  const [editorState, setEditorState] = useState(lineEditorStateFromString(deck.name));
  const [currentTitle, setCurrentTitle] = useState(deck.name);
  const [debouncing, setDebouncing] = useState(false);
  const mutateOpts = { variables: {
    id: deck.id,
    name: currentTitle,
  } };
  const [mutateEdit, { loading }] = useMutation<DeckEdit, DeckEditVariables>(DECK_EDIT_MUTATION, {
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
  const [mutateRoomCreate] = useMutation<RoomCreate>(ROOM_CREATE_MUTATION, {
    onCompleted(data) {
      if (data.roomCreate) {
        history.push(`/room/${data.roomCreate.id}`, { deckId: deck.id });
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
  const handleCreateRoom = () => mutateRoomCreate();
  const now = moment.utc();
  const deckTitleStatus = editorState.getCurrentContent().getPlainText().trim() === ""
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
        </StyledInnerBox>
      </StyledOuterBox>
      <ActionsList>
        <ActionsItem>
          <ActionsButton onClick={handleCreateRoom}>Start Contest</ActionsButton>
        </ActionsItem>
      </ActionsList>
    </DeckInfoBox>
  );
};

export default WrDeckDetailData;
