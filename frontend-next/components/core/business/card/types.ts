import { RawDraftContentState } from "draft-js";

// Note: strongly subject to change
export interface ICard {
	front: RawDraftContentState;
	back: RawDraftContentState;
	altAnswers: string[];
}