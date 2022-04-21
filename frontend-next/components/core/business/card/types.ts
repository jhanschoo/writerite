import { EditorState, RawDraftContentState } from "draft-js";

// Note: strongly subject to change
export interface ICard {
	front: RawDraftContentState;
	back: RawDraftContentState;
	altAnswers: string[];
}
export interface IEditableCard {
	front: EditorState;
	back: EditorState;
	altAnswers: EditorState;
}
