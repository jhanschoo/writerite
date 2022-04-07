import React, { Dispatch, SetStateAction } from "react";
import { DraftEditorCommand, Editor, EditorProps, EditorState, RawDraftContentState, RichUtils, convertFromRaw, ContentState } from "draft-js";
import { Button, Stack, Typography } from "@mui/material";

const isEmpty = (o: RawDraftContentState | Record<string, unknown>): o is Record<string, unknown> => !Object.keys(o).length;

const activeIf = (active: boolean) => active ? "active" : undefined;

// const Toolbar = wrStyled(List)`
// width: 100%;
// font-size: 75%;
// display: none;
// flex-wrap: wrap;
// margin: ${({ theme: { space } }) => `${space[1]} 0 0 0`};
// `;

// const ToolbarItem = wrStyled(Item)`
// margin: ${({ theme: { space } }) => `0 ${space[1]} 0 0`};
// :last-child {
//   margin: 0;
// }
// `;

// const NotesBox = wrStyled.div`
// @media (max-width: ${({ theme: { breakpoints } }) => breakpoints[1]}) {
//   font-size: 75%;
// }
// // &.active, :active, :focus-within {
// //   ${Toolbar} {
// //     display: flex;
// //   }
// // }
// `;

// const ToolbarButton = wrStyled(BorderlessButton)`
// padding: ${({ theme: { space } }) => space[1]};
// color: ${({ theme: { fg } }) => fg[3]};
// font-weight: normal;
// @media (max-width: ${({ theme: { breakpoints } }) => breakpoints[1]}) {
//   padding: ${({ theme: { space } }) => space[1]};
// }
// `;

// const BoldButton = wrStyled(ToolbarButton)`
// font-weight: bold;
// `;

// const UnderlineButton = wrStyled(ToolbarButton)`
// text-decoration: underline;
// `;

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

	return <Stack>
		<Editor
			editorState={editorState}
			onChange={handleEditorChange}
			placeholder={placeholder}
			handleKeyCommand={handleKeyCommand}
			readOnly={readOnly}
		/>
		{!readOnly &&
			<Stack direction="row">
				<Button onClick={handleBold} className={activeIf(currentStyle.has("BOLD"))}><Typography fontWeight="bold">bold</Typography></Button>
				<Button onClick={handleUnderline} className={activeIf(currentStyle.has("UNDERLINE"))}><Typography sx={{ textDecoration: "underline" }}>underline</Typography></Button>
				<Button onClick={handleUnorderedList} className={activeIf(currentType === "unordered-list-item")}>• list</Button>
				<Button onClick={handleOrderedList} className={activeIf(currentType === "ordered-list-item")}>1. list</Button>
			</Stack>
		}
	</Stack>;
};

export default NotesEditor;
