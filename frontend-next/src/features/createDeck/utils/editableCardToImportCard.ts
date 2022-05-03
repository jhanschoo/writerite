import { answersEditorStateToStringArray, notesEditorStateToRaw } from "@features/editor";
import { IEditableCard } from "../types/IEditableCard";
import { IImportCard } from "../types/IImportCard";

export function editableCardToImportCard({ prompt, fullAnswer, answers }: IEditableCard): IImportCard {
	return {
		prompt: notesEditorStateToRaw(prompt),
		fullAnswer: notesEditorStateToRaw(fullAnswer),
		answers: answersEditorStateToStringArray(answers),
	};
}
