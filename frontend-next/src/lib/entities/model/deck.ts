import { ICard } from "./card";

// Note: strongly subject to change

export interface IDeck {
	title: string;
	cards: ICard[];
}
