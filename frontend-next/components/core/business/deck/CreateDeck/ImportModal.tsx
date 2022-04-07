import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Divider, Stack, Typography } from "@mui/material";
import Papa from 'papaparse';
import { useState } from "react";
import type { ICard } from "../../card/types";
import DeckWithoutSubdeck from "../DeckWithoutSubdeck";
import type { IDeckWithoutSubdecks } from "../types";

const matchFilename = /^(.*)\.csv$/;
const MAX_CARDS_PER_DECK = parseInt(process.env.NEXT_PUBLIC_MAX_CARDS_PER_DECK as string);

export interface ImportInstructionsModalProps {
	open: boolean;
	handleClose: () => void;
	handleSwitchToImportInstructions: () => void;
}

const ImportModal = ({ open, handleClose, handleSwitchToImportInstructions }: ImportInstructionsModalProps) => {
	const [deck, setDeck] = useState<IDeckWithoutSubdecks | undefined>(undefined);
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
		let cards: ICard[];
		try {
			cards = await new Promise<ICard[]>((resolve, reject) => {
				let ret: ICard[] = [];
				Papa.parse<string[], File>(csvFile, {
					skipEmptyLines: "greedy",
					chunk: (results, parser) => {
						if (results.errors.length > 0) {
							reject(results.errors);
							parser.abort();
						}
						let lastChunk = false;
						if (results.data.length + ret.length > MAX_CARDS_PER_DECK) {
							results.data.length = MAX_CARDS_PER_DECK - ret.length;
							lastChunk = true;
						}
						ret = ret.concat(results.data.map(([front, back, ...altAnswers]) => ({
							front: front ?? "",
							back: back ?? "",
							altAnswers: altAnswers.filter((answer) => answer.trim())
						})));
						if (lastChunk) {
							parser.abort();
						} else {
							parser.resume();
						}
					},
					complete: () => resolve(ret),
					error: () => console.log("error"),
				});
			});
		} catch (e) {
			console.error(e);
			return; // TODO: consider properly handling errors
		}
		setDeck({
			title,
			cards,
		});
	};
	return (
		<Dialog
			open={open}
			onClose={handleClose}
		>
			<DialogTitle>You are about to import from a .csv file</DialogTitle>
			<DialogContent>
				<Stack spacing={2}>
					<Stack direction="row" justifyContent="center">
						<input
							type="file"
							accept=".csv"
							onChange={handleFileSelect}
							id="upload-deck-csv-input"
							style={{ display: 'none' }}
						/>
						<label htmlFor="upload-deck-csv-input">
							<Button variant="contained" size="large" component="span">
								Upload a .csv file
							</Button>
						</label>
					</Stack>
					{
						deck && (
							<>
								<Divider>▼Preview▼</Divider>
								<DeckWithoutSubdeck deck={deck} />
							</>
						)
					}
				</Stack>
			</DialogContent>
			<DialogActions>
				<Button onClick={handleSwitchToImportInstructions}>Need help?</Button>
				<Button variant="outlined" onClick={handleClose}>Cancel</Button>
			</DialogActions>
		</Dialog>
	);
};

export default ImportModal;