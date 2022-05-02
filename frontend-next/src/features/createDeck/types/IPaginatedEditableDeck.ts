import { IEditableCard } from "../types/IEditableCard";

export interface IPaginatedEditableDeck {
	title: string;
	cards: IEditableCard[][];
}
