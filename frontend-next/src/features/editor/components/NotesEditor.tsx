import { Box, Sx } from "@mantine/core";
import { DraftEditorCommand, Editor, EditorProps, EditorState, RawDraftContentState, RichUtils, convertFromRaw, convertToRaw } from "draft-js";
import React, { useRef } from "react";

const isEmpty = (o: RawDraftContentState | Record<string, unknown>): o is Record<string, unknown> => !Object.keys(o).length;

const activeIf = (active: boolean) => active ? "notes-editor-active" : undefined;

// const EditorButton = styled(Button)<ButtonProps>(({ theme }) => ({
//   color: theme.palette.text.secondary,
//   "&.notes-editor-active": {
//     color: theme.palette.text.primary,
//   },
// }));


interface Props {
  editorState: EditorState;
  setEditorState: (nextEditorState: EditorState) => void;
  handleChange?: (newEditorState: EditorState) => EditorState | null;
  placeholder?: EditorProps["placeholder"];
  readOnly?: boolean;
  stackSx?: Sx;
  spinner?: boolean;
}

export const notesEditorStateFromRaw = (c: RawDraftContentState): EditorState => {
  const emptyState = EditorState.createEmpty();
  if (isEmpty(c ?? {})) {
    return emptyState;
  }
  return EditorState.push(emptyState, convertFromRaw(c), "insert-fragment");
};

export const notesEditorStateToRaw = (editorState: EditorState): RawDraftContentState => convertToRaw(editorState.getCurrentContent());

export const NotesEditor = ({
  editorState,
  setEditorState,
  handleChange,
  placeholder,
  readOnly,
  stackSx,
  spinner,
}: Props): JSX.Element => {
  return <Box />;
  // const editorRef = useRef<Editor>(null);
  // const currentStyle = editorState.getCurrentInlineStyle();
  // const currentSelection = editorState.getSelection();
  // const currentType = editorState.getCurrentContent().getBlockForKey(currentSelection.getStartKey()).getType();
  // const handleClick = () => {
  //   if (editorRef.current) {
  //     editorRef.current.focus();
  //   }
  // }
  // const handleEditorChange = (nextEditorState: EditorState) => {
  //   setEditorState(handleChange?.(nextEditorState) ?? nextEditorState);
  // };
  // const handleKeyCommand = (command: DraftEditorCommand, state: EditorState) => {
  //   const newState = RichUtils.handleKeyCommand(state, command);
  //   if (newState) {
  //     handleEditorChange(newState);
  //     return "handled";
  //   }
  //   return "not-handled";
  // };
  // const handleBold = () => handleEditorChange(RichUtils.toggleInlineStyle(editorState, "BOLD"));
  // const handleUnderline = () => handleEditorChange(RichUtils.toggleInlineStyle(editorState, "UNDERLINE"));
  // const handleUnorderedList = () => handleEditorChange(RichUtils.toggleBlockType(editorState, "unordered-list-item"));
  // const handleOrderedList = () => handleEditorChange(RichUtils.toggleBlockType(editorState, "ordered-list-item"));

  // return <Stack paddingY={1} spacing={2} direction="row" sx={stackSx} onClick={handleClick}>
  //   <Box sx={{ flexGrow: 1, position: "relative" }}>
  //     <Editor
  //       editorState={editorState}
  //       onChange={handleEditorChange}
  //       placeholder={placeholder}
  //       handleKeyCommand={handleKeyCommand}
  //       readOnly={readOnly}
  //       ref={editorRef}
  //     />
  //     { spinner &&
  //       <Box sx={{ position: "absolute", bottom: 0, right: 0}}>
  //         <CircularProgress />
  //       </Box>
  //     }
  //   </Box>
  //   { !readOnly &&
  //     <Box onClick={(e) => e.preventDefault()}>
  //       <ButtonGroup variant="text" orientation="vertical" size="small">
  //         <EditorButton onClick={handleBold} className={activeIf(currentStyle.has("BOLD"))}><Typography fontWeight="bold">bold</Typography></EditorButton>
  //         <EditorButton onClick={handleUnderline} className={activeIf(currentStyle.has("UNDERLINE"))}><Typography sx={{ textDecoration: "underline" }}>underline</Typography></EditorButton>
  //         <EditorButton onClick={handleUnorderedList} className={activeIf(currentType === "unordered-list-item")}><Typography>• list</Typography></EditorButton>
  //         <EditorButton onClick={handleOrderedList} className={activeIf(currentType === "ordered-list-item")}><Typography>1. list</Typography></EditorButton>
  //       </ButtonGroup>
  //     </Box>
  //   }
  // </Stack>;
};
