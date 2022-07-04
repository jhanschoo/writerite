import { answersEditorStateFromStringArray, notesEditorStateFromRaw, rawFromText } from "@/features/editor"
import { IEditableCard } from "../types/IEditableCard"

export const newEditableCard = (): IEditableCard => ({
  prompt: notesEditorStateFromRaw(rawFromText("")),
  fullAnswer: notesEditorStateFromRaw(rawFromText("")),
  answers: answersEditorStateFromStringArray([]),
});
