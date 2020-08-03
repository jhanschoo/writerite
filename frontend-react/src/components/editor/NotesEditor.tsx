import React, { Dispatch, SetStateAction } from "react";
import { DraftEditorCommand, Editor, EditorProps, EditorState, RawDraftContentState, RichUtils, convertFromRaw } from "draft-js";

import { wrStyled } from "../../theme";
import { BorderlessButton, Item, List } from "../../ui";

const isEmpty = (o: RawDraftContentState | Record<string, unknown>): o is Record<string, unknown> => !Object.keys(o).length;

const activeIf = (active: boolean) => active ? "active" : undefined;

const NotesBox = wrStyled.div`
@media (max-width: ${({ theme: { breakpoints } }) => breakpoints[1]}) {
  font-size: 75%;
}
`;

const Toolbar = wrStyled(List)`
width: 100%;
display: flex;
flex-wrap: wrap;
margin: ${({ theme: { space } }) => `0 0 ${space[1]} 0`};
@media (max-width: ${({ theme: { breakpoints } }) => breakpoints[1]}) {
  margin: ${({ theme: { space } }) => `0 0 ${space[1]} 0`};
}
`;

const ToolbarItem = wrStyled(Item)`
margin: ${({ theme: { space } }) => `0 ${space[1]} 0 0`};
:last-child {
  margin: 0;
}
`;

const ToolbarButton = wrStyled(BorderlessButton)`
padding: ${({ theme: { space } }) => space[1]};
color: ${({ theme: { fg } }) => fg[3]};
font-weight: normal;
@media (max-width: ${({ theme: { breakpoints } }) => breakpoints[1]}) {
  padding: ${({ theme: { space } }) => space[1]};
}
`;

const BoldButton = wrStyled(ToolbarButton)`
font-weight: bold;
`;

const ItalicButton = wrStyled(ToolbarButton)`
font-style: italic;
`;

const UnderlineButton = wrStyled(ToolbarButton)`
text-decoration: underline;
`;

interface Props {
  editorState: EditorState;
  setEditorState: Dispatch<SetStateAction<EditorState>>;
  handleChange?: (newEditorState: EditorState) => EditorState | null;
  placeholder?: EditorProps["placeholder"];
  readOnly?: boolean;
}

export const notesEditorStateFromRaw = (c: Record<string, unknown> | null): EditorState => {
  const emptyState = EditorState.createEmpty();
  if (isEmpty(c ?? {})) {
    return emptyState;
  }
  return EditorState.push(emptyState, convertFromRaw(c as unknown as RawDraftContentState), "insert-fragment");
};

const NotesEditor = ({
  editorState,
  setEditorState,
  handleChange,
  placeholder,
  readOnly,
}: Props): JSX.Element => {
  const currentStyle = editorState.getCurrentInlineStyle();
  const currentSelection = editorState.getSelection();
  const currentType = editorState.getCurrentContent().getBlockForKey(currentSelection.getStartKey()).getType();
  const handleEditorChange = (nextEditorState: EditorState) => {
    setEditorState(handleChange?.(nextEditorState) ?? nextEditorState);
  };
  const handleKeyCommand = (command: DraftEditorCommand, state: EditorState, _eventTimeStamp: number) => {
    const newState = RichUtils.handleKeyCommand(state, command);
    if (newState) {
      handleEditorChange(newState);
      return "handled";
    }
    return "not-handled";
  };
  const handleBold = () => handleEditorChange(RichUtils.toggleInlineStyle(editorState, "BOLD"));
  const handleItalic = () => handleEditorChange(RichUtils.toggleInlineStyle(editorState, "ITALIC"));
  const handleUnderline = () => handleEditorChange(RichUtils.toggleInlineStyle(editorState, "UNDERLINE"));
  const handleUnorderedList = () => handleEditorChange(RichUtils.toggleBlockType(editorState, "unordered-list-item"));
  const handleOrderedList = () => handleEditorChange(RichUtils.toggleBlockType(editorState, "ordered-list-item"));

  return (
    <NotesBox>
      {!readOnly &&
        <Toolbar>
          <ToolbarItem><BoldButton onClick={handleBold} className={activeIf(currentStyle.has("BOLD"))}>bold</BoldButton></ToolbarItem>
          <ToolbarItem><ItalicButton onClick={handleItalic} className={activeIf(currentStyle.has("ITALIC"))}>italic</ItalicButton></ToolbarItem>
          <ToolbarItem><UnderlineButton onClick={handleUnderline} className={activeIf(currentStyle.has("UNDERLINE"))}>underline</UnderlineButton></ToolbarItem>
          <ToolbarItem><ToolbarButton onClick={handleUnorderedList} className={activeIf(currentType === "unordered-list-item")}>• list</ToolbarButton></ToolbarItem>
          <ToolbarItem><ToolbarButton onClick={handleOrderedList} className={activeIf(currentType === "ordered-list-item")}>1. list</ToolbarButton></ToolbarItem>
        </Toolbar>
      }
      <Editor
        editorState={editorState}
        onChange={handleEditorChange}
        placeholder={placeholder}
        handleKeyCommand={handleKeyCommand}
        readOnly={readOnly}
      />
    </NotesBox>
  );
};

export default NotesEditor;
