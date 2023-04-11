import { ContentState, EditorChangeType, EditorState, RawDraftContentState, convertFromRaw, convertToRaw } from "draft-js";

import type { CardFields } from "src/types";

export const emptyRawContent = convertToRaw(ContentState.createFromText("")) as unknown as GraphQLJSONObject;

export const emptyFields: CardFields = {
  prompt: emptyRawContent,
  fullAnswer: emptyRawContent,
  answers: [],
};

export const pushRawContent = (editorState: EditorState, raw: Record<string, unknown>, changeType: EditorChangeType): EditorState =>
  EditorState.push(editorState, convertFromRaw(raw as unknown as RawDraftContentState), changeType);
