import { RawDraftContentState } from "draft-js";


export interface IImportCard {
  prompt: RawDraftContentState;
  fullAnswer: RawDraftContentState;
  answers: string[];
}
