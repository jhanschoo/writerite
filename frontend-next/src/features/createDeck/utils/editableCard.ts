import { EditorState } from "draft-js";

export interface IEditableCard {
	front: EditorState;
	back: EditorState;
	altAnswers: EditorState;
}
