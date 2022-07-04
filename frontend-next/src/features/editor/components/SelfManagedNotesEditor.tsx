import { RawDraftContentState } from "draft-js";
import React, { useState } from "react";

import { NotesEditor, notesEditorStateFromRaw } from "./NotesEditor";

interface Props extends Omit<Parameters<typeof NotesEditor>[0], "editorState" | "setEditorState"> {
  initialContent: RawDraftContentState;
}

export const SelfManagedNotesEditor = ({
  initialContent,
  ...props
}: Props): JSX.Element => {
  const [editorState, setEditorState] = useState(notesEditorStateFromRaw(initialContent));
  return <NotesEditor
    editorState={editorState}
    setEditorState={setEditorState}
    {...props}
  />;
};
