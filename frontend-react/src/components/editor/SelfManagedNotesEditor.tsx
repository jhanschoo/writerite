import React, { useState } from "react";
import NotesEditor, { notesEditorStateFromRaw } from "./NotesEditor";

interface Props extends Omit<Parameters<typeof NotesEditor>[0], "editorState" | "setEditorState"> {
  initialContent: Record<string, unknown> | null;
}

const SelfManagedNotesEditor = ({
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

export default SelfManagedNotesEditor;
