import { Box, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";

export interface ImportInstructionsModalProps {
	open: boolean;
	handleClose: () => void;
	handleSwitchToImport: () => void;
}

const ImportInstructionsModal = ({ open, handleClose, handleSwitchToImport }: ImportInstructionsModalProps) => {
	return (
		<Dialog
			open={open}
			onClose={handleClose}
		>
			<DialogTitle>Instructions for importing from a .csv file</DialogTitle>
			<DialogContent>
				<DialogContentText>
					You can import a deck of <strong>text cards</strong> from a .csv file. When you import from .csv, the filename and contents of the .csv file will respectively be used to fill in the deck title and deck&lsquo;s cards (front, back, alternative answers).
				</DialogContentText>
				<DialogContentText>
					For example, consider a .csv representing the following table, where each row has up to 5 non-empty columns:
				</DialogContentText>
				<Box padding={1}>
					<TableContainer component={Paper}>
						<Table aria-label="contents of demo.csv">
							<TableHead>
								<TableRow>
									<TableCell colSpan={5} align="center"><strong>demo.csv</strong></TableCell>
								</TableRow>
							</TableHead>
							<TableBody>
								<TableRow>
									<TableCell>Front 1</TableCell>
									<TableCell>Back 1</TableCell>
									<TableCell>Card 1 Alt. Ans. 1</TableCell>
									<TableCell>Card 1 Alt. Ans. 2</TableCell>
									<TableCell></TableCell>
								</TableRow>
								<TableRow>
									<TableCell>Front 2</TableCell>
									<TableCell>Back 2</TableCell>
									<TableCell></TableCell>
									<TableCell></TableCell>
									<TableCell></TableCell>
								</TableRow>
								<TableRow>
									<TableCell>Front 3</TableCell>
									<TableCell>Back 4</TableCell>
									<TableCell>Card 3 Alt. Ans. 1</TableCell>
									<TableCell>Card 3 Alt. Ans. 2</TableCell>
									<TableCell>Card 3 Alt. Ans. 3</TableCell>
								</TableRow>
							</TableBody>
						</Table>
					</TableContainer>
				</Box>
				<DialogContentText>
					With such a .csv file, importing will create a deck named <strong>demo</strong>, with the following 3 cards:
				</DialogContentText>
				<ul>
					<li>Card 1</li>
					<ul>
						<li>Front: <em>Front 1</em></li>
						<li>Back: <em>Back 1</em></li>
						<li>Alternative answers: <em>Card 1 Alt. Ans. 1</em>, <em>Card 1 Alt. Ans. 2</em></li>
					</ul>
					<li>Card 2</li>
					<ul>
						<li>Front: <em>Front 2</em></li>
						<li>Back: <em>Back 2</em></li>
					</ul>
					<li>Card 3</li>
					<ul>
						<li>Front: <em>Front 3</em></li>
						<li>Back: <em>Back 3</em></li>
						<li>Alternative answers: <em>Card 3 Alt. Ans. 1</em>, <em>Card 3 Alt. Ans. 2</em>, <em>Card 3 Alt. Ans. 3</em></li>
					</ul>
				</ul>
			</DialogContent>
			<DialogActions>
				<Button onClick={handleSwitchToImport}>Import a .csv</Button>
				<Button variant="outlined" onClick={handleClose}>Back</Button>
			</DialogActions>
		</Dialog>
	);
};

export default ImportInstructionsModal;