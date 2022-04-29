import { answersEditorStateToStringArray } from "../../../../../components/core/application/editor/AnswersEditor";
import { notesEditorStateToRaw } from "../../../../../components/core/application/editor/NotesEditor";
import { IEditableCard } from "./editableCard";
import { ICard } from "../../model/card";

export function editableCardToCard({ front, back, altAnswers }: IEditableCard): ICard {
	return {
		front: notesEditorStateToRaw(front),
		back: notesEditorStateToRaw(back),
		altAnswers: answersEditorStateToStringArray(altAnswers),
	};
};
