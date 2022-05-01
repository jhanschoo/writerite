import { group } from "../../../../utils/group";
import { IDeck } from "../../model/deck";
import { cardToEditableCard } from "../card/cardToEditableCard";
import { IEditableCard } from "../card/editableCard";

export interface IPaginatedEditableDeck {
	title: string;
	cards: IEditableCard[][];
}

export const fromIDeck = (deck: IDeck, pageSize: number): IPaginatedEditableDeck => {
	return {
		...deck,
		cards: group(deck.cards.map(cardToEditableCard), pageSize),
	};
}

export const updateCardsOfExistingDeck =
	(setDeck: (deck: IPaginatedEditableDeck) => void, deck: IPaginatedEditableDeck | undefined) =>
		(cards: IEditableCard[][]): void =>
			deck && setDeck({ ...deck, cards })

export const updateCurrentCardsOfCards =
	(setCards: (cards: IEditableCard[][]) => void, cards: IEditableCard[][], index: number) =>
		(newCurrentCards: IEditableCard[]): void =>
			setCards(cards.map((currentCards, i) => i === index ? newCurrentCards : currentCards))

export const updateCardOfCurrentCards =
	(setCurrentCards: (cards: IEditableCard[]) => void, currentCards: IEditableCard[], index: number) =>
		(newCard: IEditableCard): void =>
			setCurrentCards(currentCards.map((card, i) => i === index ? newCard : card))

export const updateCurrentCardsOfExistingDeck =
	(setDeck: (deck: IPaginatedEditableDeck) => void, deck: IPaginatedEditableDeck | undefined, index: number) => 
		deck ? updateCurrentCardsOfCards(updateCardsOfExistingDeck(setDeck, deck), deck.cards, index) : () => undefined;