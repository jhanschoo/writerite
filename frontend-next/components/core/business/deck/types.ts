import { ICard, IEditableCard } from "../card/types";

// Note: strongly subject to change
export interface IDeck {
	title: string;
	cards: ICard[];
}

export interface IPaginatedEditableDeck {
	title: string;
	cards: IEditableCard[][];
}
