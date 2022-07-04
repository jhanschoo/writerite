import { NotesEditor, notesEditorStateFromRaw, notesEditorStateToRaw } from "@/features/editor";
import { STANDARD_DEBOUNCE_MS, STANDARD_MAX_WAIT_DEBOUNCE_MS } from "@/utils";
import { DeckEditDocument } from "@generated/graphql";
import { EditorState } from "draft-js";
import { FC, useState } from "react";
import { useMutation } from "urql";
import { useDebouncedCallback } from "use-debounce";
import { ManageDeckProps } from "../types/ManageDeckProps";

// TODO: WIP
export const ManageDeckSubdecks: FC<ManageDeckProps> = ({ deck: { id, description } }) => {
	const [{ fetching }, mutateDescription] = useMutation(DeckEditDocument);
	return null;
}
