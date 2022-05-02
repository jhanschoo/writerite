import { IImportCard } from "./IImportCard";

// Note: strongly subject to change

export interface IDeck {
	title: string;
	cards: IImportCard[];
}
