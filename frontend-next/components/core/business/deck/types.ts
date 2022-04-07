import { ICard } from "../card/types";

// Note: strongly subject to change
export interface IDeckWithoutSubdecks {
	title: string;
	cards: ICard[];
}
