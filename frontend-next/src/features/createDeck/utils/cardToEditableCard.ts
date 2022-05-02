import { answersEditorStateFromStringArray, notesEditorStateFromRaw } from "../../editor";
import { IEditableCard } from "./editableCard";
import { ICard } from "../utils/card";

export function cardToEditableCard(card: ICard): IEditableCard {
	return {
		front: notesEditorStateFromRaw(card.front),
		back: notesEditorStateFromRaw(card.back),
		altAnswers: answersEditorStateFromStringArray(card.altAnswers),
	};
};
