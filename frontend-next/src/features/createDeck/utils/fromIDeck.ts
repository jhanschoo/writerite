import { group } from "@/utils";
import { IDeck } from "../types/IImportDeck";
import { importCardToEditableCard } from "./importCardToEditableCard";
import { IPaginatedEditableDeck } from "../types/IPaginatedEditableDeck";

export const fromIDeck = (deck: IDeck, pageSize: number): IPaginatedEditableDeck => {
	return {
		...deck,
		cards: group(deck.cards.map(importCardToEditableCard), pageSize),
	};
}
