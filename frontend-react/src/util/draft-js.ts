import { ContentState, convertToRaw } from "draft-js";

export const emptyRawContext = convertToRaw(ContentState.createFromText("")) as unknown as JsonObject;
