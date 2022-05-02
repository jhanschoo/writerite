import { answersEditorStateFromStringArray, notesEditorStateFromRaw } from "../../editor";
import { IEditableCard } from "../types/IEditableCard";
import { IImportCard } from "../types/IImportCard";

export function importCardToEditableCard({ prompt, fullAnswer, answers }: IImportCard): IEditableCard {
	return {
		prompt: notesEditorStateFromRaw(prompt),
		fullAnswer: notesEditorStateFromRaw(fullAnswer),
		answers: answersEditorStateFromStringArray(answers),
	};
};
