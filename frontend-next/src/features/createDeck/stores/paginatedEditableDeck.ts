import { group } from "@/utils";
import { useReducer } from "react";
import { IDeck } from "../types/IImportDeck";
import { IEditableCard } from "../types/IEditableCard";
import { IPaginatedEditableDeck } from "../types/IPaginatedEditableDeck";
import { fromIDeck } from "../utils/fromIDeck";
import { notesEditorStateFromRaw, rawFromText } from "@/features/editor";
import { EditorState } from "draft-js";

export const CARD_LIST_PAGE_SIZE = 10;
export const MAX_CARDS_PER_DECK = parseInt(process.env.NEXT_PUBLIC_MAX_CARDS_PER_DECK as string);

export enum PaginatedEditableDeckActionType {
	SET_NAME,
	SET_DESCRIPTION,
	PREPEND_CARD,
	APPEND_N_CARDS,
	REMOVE_CARD,
	REPLACE_CARD,
	REINITIALIZE_DECK,
}

export interface PaginatedEditableDeckActionPayloads {
	[PaginatedEditableDeckActionType.SET_NAME]: {
		name: string;
	};
	[PaginatedEditableDeckActionType.SET_DESCRIPTION]: {
		description: EditorState;
	};
	[PaginatedEditableDeckActionType.PREPEND_CARD]: {
		card: IEditableCard;
	};
	[PaginatedEditableDeckActionType.APPEND_N_CARDS]: {
		cards: IEditableCard[];
	}
	[PaginatedEditableDeckActionType.REMOVE_CARD]: {
		majorIndex: number;
		minorIndex: number;
	}
	[PaginatedEditableDeckActionType.REPLACE_CARD]: {
		card: IEditableCard;
		majorIndex: number;
		minorIndex: number;
	}
	[PaginatedEditableDeckActionType.REINITIALIZE_DECK]: {
		deck: IDeck;
	}
}

type PaginatedEditableDeckActionPayloadsWithType = {
	[V in keyof PaginatedEditableDeckActionPayloads]: {
		type: V;
	} & PaginatedEditableDeckActionPayloads[V];
}

export type PaginatedEditableDeckAction = PaginatedEditableDeckActionPayloadsWithType[PaginatedEditableDeckActionType];

export const INITIAL_PAGINATED_EDITABLE_DECK_STATE: IPaginatedEditableDeck = {
	name: "",
	description: notesEditorStateFromRaw(rawFromText("")),
	cards: [],
}

export const paginatedEditableDeckReducer = (state: IPaginatedEditableDeck, action: PaginatedEditableDeckAction): IPaginatedEditableDeck => {
	switch (action.type) {
		case PaginatedEditableDeckActionType.SET_NAME:
			return {
				...state,
				name: action.name,
			};
		case PaginatedEditableDeckActionType.SET_DESCRIPTION:
			return {
				...state,
				description: action.description,
			};
		case PaginatedEditableDeckActionType.PREPEND_CARD:
			return {
				...state,
				cards: group([action.card, ...state.cards.flat()].slice(0, MAX_CARDS_PER_DECK), CARD_LIST_PAGE_SIZE),
			};
		case PaginatedEditableDeckActionType.APPEND_N_CARDS:
			return {
				...state,
				cards: group([...state.cards.flat(), ...action.cards].slice(0, MAX_CARDS_PER_DECK), CARD_LIST_PAGE_SIZE),
			};
		case PaginatedEditableDeckActionType.REMOVE_CARD: {
			const { majorIndex, minorIndex } = action;
			const toRemove = state.cards[majorIndex][minorIndex];
			return {
				...state,
				cards: group([...state.cards.flat().filter((card) => card !== toRemove)], CARD_LIST_PAGE_SIZE),
			};
		}
		case PaginatedEditableDeckActionType.REPLACE_CARD: {
			const { card, majorIndex, minorIndex } = action;
			const { cards } = state;
			const page = cards[majorIndex];
			return {
				...state,
				cards: cards.slice(0, majorIndex)
					.concat([
						page.slice(0, minorIndex)
							.concat([card])
							.concat(page.slice(minorIndex + 1))
					])
					.concat(cards.slice(majorIndex + 1)),
			};
		}
		case PaginatedEditableDeckActionType.REINITIALIZE_DECK:
			return fromIDeck(action.deck, CARD_LIST_PAGE_SIZE);
	}
}

export const usePaginatedEditableDeckReducer = () => useReducer(paginatedEditableDeckReducer, INITIAL_PAGINATED_EDITABLE_DECK_STATE);
