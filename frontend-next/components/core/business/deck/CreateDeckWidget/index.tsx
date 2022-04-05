import { Button, ButtonGroup, Card, CardContent, Stack, TextField, Typography } from "@mui/material";
import { useState } from "react";
import ImportInstructionsModal from "./ImportInstructionsModal";
import ImportModal from "./ImportModal";

const CreateDeckWidget = () => {
	const [showImportInstructionsModal, setShowImportInstructionsModal] = useState(false);
	const [showImportModal, setShowImportModal] = useState(false);
	const handleToggleShowImportInstructionsModal = () =>
		setShowImportInstructionsModal(!showImportInstructionsModal);
	const handleToggleShowImportModal = () => setShowImportModal(!showImportModal);
	const handleSwitchImportAndIstructionsModals = () => {
		handleToggleShowImportInstructionsModal();
		handleToggleShowImportModal();
	}
	return (<>
		<Stack direction="row">
			<Typography variant="h4" sx={{ flexGrow: 1 }} paddingX={2}>
				Create Deck
			</Typography>
			<ButtonGroup variant="contained" aria-label="Import deck modal toggle buttons">
				<Button onClick={handleToggleShowImportModal}>Import from .csv</Button>
				<Button onClick={handleToggleShowImportInstructionsModal}>?</Button>
			</ButtonGroup>
			{ showImportModal && <ImportModal
				open={showImportModal}
				handleClose={handleToggleShowImportModal}
				handleSwitchToImportInstructions={handleSwitchImportAndIstructionsModals}
			/> }
			{ showImportInstructionsModal && <ImportInstructionsModal
				open={showImportInstructionsModal}
				handleClose={handleToggleShowImportInstructionsModal}
				handleSwitchToImport={handleSwitchImportAndIstructionsModals}
			/> }
		</Stack>
		<form>
			<Card>
				<CardContent>
					<TextField
						id="deck-title"
						label="Title"
						variant="filled"
						size="largecentered"
						sx={{ width: "100%" }}
						margin="normal"
					/>
					<Typography variant="h6" textAlign="center" margin={2}>Subdecks</Typography>
					<Typography variant="h6" textAlign="center" margin={2}>Cards</Typography>
					<p>TODO: deck statistics on right gutter</p>
				</CardContent>
			</Card>
		</form>
	</>);
}

export default CreateDeckWidget;