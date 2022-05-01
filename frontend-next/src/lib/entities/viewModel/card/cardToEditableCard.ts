import { answersEditorStateFromStringArray, notesEditorStateFromRaw } from "../../../../features/editor";
import { IEditableCard } from "./editableCard";
import { ICard } from "../../model/card";

export function cardToEditableCard(card: ICard): IEditableCard {
	return {
		front: notesEditorStateFromRaw(card.front),
		back: notesEditorStateFromRaw(card.back),
		altAnswers: answersEditorStateFromStringArray(card.altAnswers),
	};
};
