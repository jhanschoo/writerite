import { NotesEditor, notesEditorStateFromRaw, notesEditorStateToRaw } from "@/features/editor";
import { STANDARD_DEBOUNCE_MS, STANDARD_MAX_WAIT_DEBOUNCE_MS } from "@/utils";
import { DeckEditDocument } from "@generated/graphql";
import { EditorState } from "draft-js";
import { FC, useState } from "react";
import { useMutation } from "urql";
import { useDebouncedCallback } from "use-debounce";
import { ManageDeckProps } from "../types/ManageDeckProps";

export const ManageDeckDescription: FC<ManageDeckProps> = ({ deck: { id, description } }) => {
	const [{ fetching }, mutateDescription] = useMutation(DeckEditDocument);

	// TODO: implement https://github.com/vercel/next.js/issues/2476#issuecomment-563190607 to prevent leaving if unsaved data present
	const [editorState, setEditorState] = useState(notesEditorStateFromRaw(description));
	const debouncedSaveEditorState = useDebouncedCallback((editorState) => {
		mutateDescription({ id, description: notesEditorStateToRaw(editorState) });
	}, STANDARD_DEBOUNCE_MS, { maxWait: STANDARD_MAX_WAIT_DEBOUNCE_MS });
	const setAndSaveEditorState = (newEditorState: EditorState) => {
		setEditorState(newEditorState);
		debouncedSaveEditorState(editorState);
	}
	return <NotesEditor
		editorState={editorState}
		setEditorState={setAndSaveEditorState}
		placeholder="Enter a description..."
		spinner={debouncedSaveEditorState.isPending() || fetching}
	/>
}
