import { answersEditorStateFromStringArray } from "../../../../../components/core/application/editor/AnswersEditor";
import { notesEditorStateFromRaw } from "../../../../../components/core/application/editor/NotesEditor";
import { IEditableCard } from "./editableCard";
import { ICard } from "../../model/card";

export function cardToEditableCard(card: ICard): IEditableCard {
	return {
		front: notesEditorStateFromRaw(card.front),
		back: notesEditorStateFromRaw(card.back),
		altAnswers: answersEditorStateFromStringArray(card.altAnswers),
	};
};
