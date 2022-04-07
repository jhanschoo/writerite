import { convertToRaw, ContentState } from "draft-js";

export const rawFromText = (text: string) => convertToRaw(ContentState.createFromText(text));