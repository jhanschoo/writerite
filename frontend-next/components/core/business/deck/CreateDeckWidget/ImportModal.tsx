import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Stack } from "@mui/material";
import Papa from 'papaparse';

export interface ImportInstructionsModalProps {
	open: boolean;
	handleClose: () => void;
	handleSwitchToImportInstructions: () => void;
}

const ImportModal = ({ open, handleClose, handleSwitchToImportInstructions }: ImportInstructionsModalProps) => {
	const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
		console.log("aaa")
		console.log(event.target.files);
	};
	return (
		<Dialog
			open={open}
			onClose={handleClose}
		>
			<DialogTitle>You are about to import from a .csv file</DialogTitle>
			<DialogContent>
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
			</DialogContent>
			<DialogActions>
				<Button onClick={handleSwitchToImportInstructions}>Need help?</Button>
				<Button variant="outlined" onClick={handleClose}>Cancel</Button>
			</DialogActions>
		</Dialog>
	);
};

export default ImportModal;