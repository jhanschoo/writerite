import React, { useState } from "react";
import { DraftEditorCommand, Editor, EditorProps, EditorState, RawDraftContentState, RichUtils, convertFromRaw, convertToRaw } from "draft-js";

import { wrStyled } from "../../theme";
import { Item, List } from "../../ui/List";
import { BorderlessButton } from "../../ui/Button";

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
margin: ${({ theme: { space } }) => `0 0 ${space[2]} 0`};
@media (max-width: ${({ theme: { breakpoints } }) => breakpoints[1]}) {
  margin: ${({ theme: { space } }) => `0 0 ${space[1]} 0`};
}
`;

const ToolbarItem = wrStyled(Item)``;

const ToolbarButton = wrStyled(BorderlessButton)`
padding: ${({ theme: { space } }) => `${space[1]} ${space[2]}`};
margin: ${({ theme: { space } }) => space[1]};
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
  initialContent: RawDraftContentState | Record<string, unknown>;
  onChange: (rawDraftContentState: RawDraftContentState) => void;
  placeholder?: EditorProps["placeholder"];
  readOnly?: boolean;
}

const NotesEditor = ({
  initialContent,
  onChange,
  placeholder,
  readOnly,
}: Props): JSX.Element => {
  const [editorState, setEditorState] = useState(() => isEmpty(initialContent)
    ? EditorState.createEmpty()
    : EditorState.createWithContent(convertFromRaw(initialContent)));
  const currentStyle = editorState.getCurrentInlineStyle();
  const currentSelection = editorState.getSelection();
  const currentType = editorState.getCurrentContent().getBlockForKey(currentSelection.getStartKey()).getType();
  // eslint-disable-next-line no-shadow
  const handleChange = (editorState: EditorState) => {
    setEditorState(editorState);
    onChange(convertToRaw(editorState.getCurrentContent()));
  };
  const handleKeyCommand = (command: DraftEditorCommand, state: EditorState, _eventTimeStamp: number) => {
    const newState = RichUtils.handleKeyCommand(state, command);
    if (newState) {
      handleChange(newState);
      return "handled";
    }
    return "not-handled";
  };
  const handleBold = () => handleChange(RichUtils.toggleInlineStyle(editorState, "BOLD"));
  const handleItalic = () => handleChange(RichUtils.toggleInlineStyle(editorState, "ITALIC"));
  const handleUnderline = () => handleChange(RichUtils.toggleInlineStyle(editorState, "UNDERLINE"));
  const handleUnorderedList = () => handleChange(RichUtils.toggleBlockType(editorState, "unordered-list-item"));
  const handleOrderedList = () => handleChange(RichUtils.toggleBlockType(editorState, "ordered-list-item"));

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
        onChange={handleChange}
        placeholder={placeholder}
        handleKeyCommand={handleKeyCommand}
        readOnly={readOnly}
      />
    </NotesBox>
  );
};

export default NotesEditor;
