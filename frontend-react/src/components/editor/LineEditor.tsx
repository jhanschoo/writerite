import React, { useState } from "react";
import { ContentState, Editor, EditorState } from "draft-js";
// eslint-disable-next-line no-shadow
import { Map } from "immutable";

interface Props {
  initialString: string;
  tag?: string;
  onChange: (newString: string) => void;
  /*
   * Function returns true if undo is not triggered,
   * false if undo is triggered.
   */
  filterOnBlur?: (newString: string) => boolean;
  readOnly?: boolean;
}

const LineEditor = (props: Props): JSX.Element => {
  const {
    initialString,
    tag,
    onChange,
    filterOnBlur,
    readOnly,
  } = props;
  const element = tag ?? "div";
  // eslint-disable-next-line new-cap
  const blockRenderMap = Map({ unstyled: { element } });
  const initialContent = ContentState.createFromText(initialString);
  const [editorState, setEditorState] = useState(() =>
    initialContent.getBlockMap().size === 1
      ? EditorState.createWithContent(initialContent)
      : EditorState.createEmpty());
  const handleChange = (nextEditorState: EditorState) => {
    const nextContent = nextEditorState.getCurrentContent();
    if (nextContent.getBlockMap().size <= 1) {
      setEditorState(nextEditorState);
      onChange(nextContent.getPlainText());
    } else {
      setEditorState(EditorState.undo(nextEditorState));
    }
  };
  const handleBlur = filterOnBlur ? () => {
    if (!filterOnBlur(editorState.getCurrentContent().getPlainText())) {
      setEditorState(EditorState.undo(editorState));
    }
  } : undefined;
  return (
    <Editor
      blockRenderMap={blockRenderMap}
      editorState={editorState}
      onChange={handleChange}
      onBlur={handleBlur}
      readOnly={readOnly}
    />
  );
};

export default LineEditor;
