import { RawDraftContentState } from "draft-js";


export interface ICard {
	front: RawDraftContentState;
	back: RawDraftContentState;
	altAnswers: string[];
}
