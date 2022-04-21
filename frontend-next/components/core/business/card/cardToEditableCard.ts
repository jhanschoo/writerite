import { answersEditorStateFromStringArray } from "../../application/editor/AnswersEditor";
import { notesEditorStateFromRaw } from "../../application/editor/NotesEditor";
import { ICard, IEditableCard } from "./types";

export function cardToEditableCard(card: ICard): IEditableCard {
	return {
		front: notesEditorStateFromRaw(card.front),
		back: notesEditorStateFromRaw(card.back),
		altAnswers: answersEditorStateFromStringArray(card.altAnswers),
	};
};
