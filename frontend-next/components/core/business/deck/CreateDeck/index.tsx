import { Button, ButtonGroup, Card, CardContent, Stack, TextField, Typography } from "@mui/material";
import { useState } from "react";
import { useMutation } from "urql";
import { DeckCreateDocument } from "../../../../../generated/graphql";
import { group } from "../../../../../lib/core/utilities";
import CardItemsList from "../../card/CardItemsList";
import { cardToEditableCard } from "../../card/cardToEditableCard";
import { CARD_LIST_PAGE_SIZE } from "../../card/constants";
import { ICard, IEditableCard } from "../../card/types";
import { IDeck, IPaginatedEditableDeck } from "../types";
import ImportFromCsv from "./ImportFromCsv";
import ImportInstructionsModal from "./ImportInstructionsModal";

const CreateDeck = () => {
	const [showImportInstructionsModal, setShowImportInstructionsModal] = useState(false);
	const [, deckCreateMutation] = useMutation(DeckCreateDocument);
	const [deck, setDeck] = useState<IPaginatedEditableDeck | undefined>(undefined);
	const handleToggleShowImportInstructionsModal = () =>
		setShowImportInstructionsModal(!showImportInstructionsModal);
	const handleOverwrite = (newDeck: IDeck) => {
		setDeck({
			...newDeck,
			// we use mutation here for speed
			cards: group(newDeck.cards.map(cardToEditableCard), CARD_LIST_PAGE_SIZE),
		});
	}
	const handleAppend = (newDeck: IDeck) => {
		if (deck) {
			setDeck({
				...newDeck,
				cards: group([...deck.cards.flat(), ...newDeck.cards.map( cardToEditableCard)].slice(0, 1000), CARD_LIST_PAGE_SIZE),
			});
		} else {
			handleOverwrite(newDeck);
		}
	}
	const handleCardsChange = (cards: IEditableCard[][]) => setDeck(deck && { ...deck, cards });
	return (<>
		<Stack direction="row">
			<Typography variant="h4" sx={{ flexGrow: 1 }} paddingX={2}>
				Create Deck
			</Typography>
			<ButtonGroup variant="contained" aria-label="Import deck modal toggle buttons">
				<ImportFromCsv onOverwrite={handleOverwrite} onAppend={handleAppend} />
				<Button onClick={handleToggleShowImportInstructionsModal}>?</Button>
			</ButtonGroup>
			{ showImportInstructionsModal && <ImportInstructionsModal
				open={showImportInstructionsModal}
				handleClose={handleToggleShowImportInstructionsModal}
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
					<Stack alignItems="center" spacing={2}>
						<Button variant="contained">Add new card</Button>
						{ deck?.cards && <CardItemsList cards={deck.cards} onCardsChange={handleCardsChange} /> }
					</Stack>
					<p>TODO: deck statistics on right gutter</p>
				</CardContent>
			</Card>
		</form>
	</>);
}

export default CreateDeck;
