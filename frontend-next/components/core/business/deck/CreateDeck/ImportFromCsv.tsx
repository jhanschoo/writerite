import { Backdrop, Button, Dialog, DialogActions, DialogContent, Stack, Typography } from "@mui/material";
import Papa from 'papaparse';
import { nextTick } from "process";
import { useRef, useState, MouseEvent } from "react";
import { rawFromText } from "../../../application/editor/rawFromText";
import type { ICard } from "../../card/types";
import ImportFromCsvPreview from "./ImportFromCsvPreview";
import type { IDeck } from "../types";

const matchFilename = /^(.*)\.csv$/;
const MAX_CARDS_PER_DECK = parseInt(process.env.NEXT_PUBLIC_MAX_CARDS_PER_DECK as string);

enum ImportState {
	EMPTY,
	IMPORTING,
	IMPORTED_NORMAL,
	IMPORTED_EXCEEDED,
	IMPORTED_ERRORS
}

export interface ImportInstructionsModalProps {
	onAppend: (deck: IDeck) => void;
	onOverwrite: (deck: IDeck) => void;
}

// TODO: show errors for limit reached
const ImportFromCsv = ({ onAppend, onOverwrite }: ImportInstructionsModalProps) => {
	const fileInputRef = useRef<HTMLInputElement>(null);
	const [importState, setImportState] = useState<ImportState>(ImportState.EMPTY);
	const [deck, setDeck] = useState<IDeck | undefined>(undefined);
	const handleFileInputButtonClick = () => fileInputRef.current?.click();
	const handleFileInputClick = (event: MouseEvent<HTMLInputElement>) => {
		(event.target as HTMLInputElement).value = "";
	}
	const handleCloseModal = () => setImportState(ImportState.EMPTY);
	const handleAppend = () => {
		if (deck) {
			onAppend(deck);
		}
		handleCloseModal();
	}
	const handleOverwrite = () => {
		if (deck) {
			onOverwrite(deck);
		}
		handleCloseModal();
	}
	const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
		if (!event.target.files || event.target.files.length !== 1) {
			return; // TODO: consider showing an error message, consider try-catch
		}
		const csvFile = event.target.files[0];
		const filenameWithExtension = csvFile.name.trim();
		const match = filenameWithExtension.match(matchFilename);
		if (!match || !match[1]) { // match[1] is the captured group matching the filename without .csv
			return; // TODO: consider showing an error message, consider try-catch
		}
		const title = match[1];
		setImportState(ImportState.IMPORTING);
		await nextTick(async () => {
			try {
				const { cards, exceeded } = await new Promise<{ cards: ICard[], exceeded: boolean }>((resolve, reject) => {
					let retCards: ICard[] = [];
					let exceeded = false;
					Papa.parse<string[], File>(csvFile, {
						skipEmptyLines: "greedy",
						chunk: (results, parser) => {
							if (results.errors.length > 0) {
								reject(results.errors);
								parser.abort();
							}
							if (results.data.length + retCards.length > MAX_CARDS_PER_DECK) {
								results.data.length = MAX_CARDS_PER_DECK - retCards.length;
								exceeded = true;
							}
							retCards = retCards.concat(results.data.map(([front, back, ...altAnswers]) => ({
								front: rawFromText(front ?? ""),
								back: rawFromText(back ?? ""),
								altAnswers: altAnswers.filter((answer) => answer.trim())
							})));
							if (exceeded) {
								parser.abort();
							} else {
								parser.resume();
							}
						},
						complete: () => resolve({ cards: retCards, exceeded }),
						error: (e) => reject(e),
					});
				});
				setDeck({
					title,
					cards,
				});
				setImportState(exceeded ? ImportState.IMPORTED_EXCEEDED : ImportState.IMPORTED_NORMAL);
			} catch (e) {
				console.error(e);
				setImportState(ImportState.IMPORTED_ERRORS);
			}
		});
	};
	return (
		<>
			<input
				type="file"
				accept=".csv"
				onChange={handleFileSelect}
				onClick={handleFileInputClick}
				ref={fileInputRef}
				style={{ display: 'none' }}
			/>
			<Button onClick={handleFileInputButtonClick} aria-label="file upload">
				Import a .csv file
			</Button>
			<Backdrop open={importState === ImportState.IMPORTING}>
				<Typography variant="h2" color="primary.contrastText">Importing...</Typography>
			</Backdrop>
			<Dialog
				open={importState === ImportState.IMPORTED_EXCEEDED || importState === ImportState.IMPORTED_NORMAL}
				onClose={handleCloseModal}
			>
				{/* flex is necessary if we want to have the cards list scroll when it overflows the dialog's max-height, and not the whole dialogcontent */}
				<DialogContent sx={{ display: "flex", flexDirection: "column" }}>
					<Stack spacing={2} minHeight={0}>
						{
							deck && (
								<ImportFromCsvPreview deck={deck} cardComponentProps={{ muiCardProps: { sx: { flexShrink: 0 } } }} isExceeded={importState == ImportState.IMPORTED_EXCEEDED} />
							)
						}
					</Stack>
				</DialogContent>
				<DialogActions>
					<Button variant="text" onClick={handleCloseModal}>Cancel</Button>
					<Button variant="outlined" onClick={handleAppend}>Add Cards to Existing</Button>
					<Button onClick={handleOverwrite}>Import and Replace</Button>
				</DialogActions>
			</Dialog>
		</>
	);
};

export default ImportFromCsv;
