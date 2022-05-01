import { answersEditorStateToStringArray, notesEditorStateToRaw } from "../../../../features/editor";
import { IEditableCard } from "./editableCard";
import { ICard } from "../../model/card";

export function editableCardToCard({ front, back, altAnswers }: IEditableCard): ICard {
	return {
		front: notesEditorStateToRaw(front),
		back: notesEditorStateToRaw(back),
		altAnswers: answersEditorStateToStringArray(altAnswers),
	};
};
