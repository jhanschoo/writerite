import { EditorState } from "draft-js";

export interface IEditableCard {
	prompt: EditorState;
	fullAnswer: EditorState;
	answers: EditorState;
}
