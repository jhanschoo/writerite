import { DraftEditorCommand, Editor, EditorProps, EditorState, RawDraftContentState, RichUtils, convertFromRaw, convertToRaw } from "draft-js";
import { Box, Button, ButtonGroup, Divider, Stack, Typography } from "@mui/material";
import React, { Dispatch, SetStateAction } from "react";

const isEmpty = (o: RawDraftContentState | Record<string, unknown>): o is Record<string, unknown> => !Object.keys(o).length;

const activeIf = (active: boolean) => active ? undefined : "secondary";

interface Props {
	editorState: EditorState;
	setEditorState: Dispatch<SetStateAction<EditorState>>;
	handleChange?: (newEditorState: EditorState) => EditorState | null;
	placeholder?: EditorProps["placeholder"];
	readOnly?: boolean;
}

export const notesEditorStateFromRaw = (c: RawDraftContentState): EditorState => {
	const emptyState = EditorState.createEmpty();
	if (isEmpty(c ?? {})) {
		return emptyState;
	}
	return EditorState.push(emptyState, convertFromRaw(c), "insert-fragment");
};

export const notesEditorStateToRaw = (editorState: EditorState): RawDraftContentState => convertToRaw(editorState.getCurrentContent());

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
	const handleUnderline = () => handleEditorChange(RichUtils.toggleInlineStyle(editorState, "UNDERLINE"));
	const handleUnorderedList = () => handleEditorChange(RichUtils.toggleBlockType(editorState, "unordered-list-item"));
	const handleOrderedList = () => handleEditorChange(RichUtils.toggleBlockType(editorState, "ordered-list-item"));

	return <Stack paddingY={1} spacing={1} direction="row">
		{!readOnly &&
			<Box>
				<ButtonGroup variant="text" orientation="vertical" size="small">
					<Button onClick={handleBold} color={activeIf(currentStyle.has("BOLD"))}><Typography fontWeight="bold">bold</Typography></Button>
					<Button onClick={handleUnderline} color={activeIf(currentStyle.has("UNDERLINE"))}><Typography sx={{ textDecoration: "underline" }}>underline</Typography></Button>
					<Button onClick={handleUnorderedList} color={activeIf(currentType === "unordered-list-item")}><Typography>• list</Typography></Button>
					<Button onClick={handleOrderedList} color={activeIf(currentType === "ordered-list-item")}><Typography>1. list</Typography></Button>
				</ButtonGroup>
			</Box>
		}
		<Divider orientation="vertical" flexItem />
		<Editor
			editorState={editorState}
			onChange={handleEditorChange}
			placeholder={placeholder}
			handleKeyCommand={handleKeyCommand}
			readOnly={readOnly}
		/>
	</Stack>;
};

export default NotesEditor;
