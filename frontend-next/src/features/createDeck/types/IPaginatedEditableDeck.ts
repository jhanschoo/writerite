import { EditorState } from "draft-js";
import { IEditableCard } from "../types/IEditableCard";

export interface IPaginatedEditableDeck {
	name: string;
	description: EditorState;
	cards: IEditableCard[][];
}
