import React, { useState } from "react";

import { AnswersEditor, answersEditorStateFromStringArray } from "./AnswersEditor";

interface Props extends Omit<Parameters<typeof AnswersEditor>[0], "editorState" | "setEditorState"> {
  initialContent: readonly string[];
}

export const SelfManagedAnswersEditor = ({
  initialContent,
  ...props
}: Props): JSX.Element => {
  const [editorState, setEditorState] = useState(answersEditorStateFromStringArray(initialContent));
  return <AnswersEditor
    editorState={editorState}
    setEditorState={setEditorState}
    {...props}
  />;
};

