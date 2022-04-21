import { answersEditorStateToStringArray } from "../../application/editor/AnswersEditor";
import { notesEditorStateToRaw } from "../../application/editor/NotesEditor";
import { ICard, IEditableCard } from "./types";

export function editableCardToCard({ front, back, altAnswers }: IEditableCard): ICard {
	return {
		front: notesEditorStateToRaw(front),
		back: notesEditorStateToRaw(back),
		altAnswers: answersEditorStateToStringArray(altAnswers),
	};
};
