import { Button, ButtonGroup, Card, CardContent, Pagination, Stack, TextField, Typography } from "@mui/material";
import { ChangeEvent, useState } from "react";
import { useMutation } from "urql";
import { DeckCreateDocument } from "@generated/graphql";
import { group } from "@/utils";
import CardItemsList from "./CardItemsList";
import { cardToEditableCard } from "../utils/cardToEditableCard";
import { CARD_LIST_PAGE_SIZE } from "../constants";
import { fromIDeck, IPaginatedEditableDeck, updateCurrentCardsOfExistingDeck } from "../utils/paginatedEditableDeck";
import { IDeck } from "../utils/deck";
import { ImportFromCsv } from "./ImportFromCsv";
import ImportInstructionsModal from "./ImportInstructionsModal";

export const CreateDeck = () => {
	const [showImportInstructionsModal, setShowImportInstructionsModal] = useState(false);
	const [, deckCreateMutation] = useMutation(DeckCreateDocument);
	// Note: all mutations of setDeck and setPage must satisfy consistency property that if deck.cards.length is truthy, then 0 < page <= deck.cards.length
	const [deck, setDeck] = useState<IPaginatedEditableDeck | undefined>(undefined);
	const [page, setPage] = useState(1);
	const pageIndex = page - 1;
	const pages = deck?.cards.length;
	const currentCards = deck?.cards.length && deck.cards[pageIndex];
	const handlePageChange = (_e: ChangeEvent<unknown>, value: number) => setPage(value);
	const handleToggleShowImportInstructionsModal = () =>
		setShowImportInstructionsModal(!showImportInstructionsModal);
	const handleOverwrite = (newDeck: IDeck) => {
		setDeck(fromIDeck(newDeck, CARD_LIST_PAGE_SIZE));
	}
	const handleAppend = (newDeck: IDeck) => {
		if (deck) {
			setDeck({
				...newDeck,
				cards: group([...deck.cards.flat(), ...newDeck.cards.map(cardToEditableCard)].slice(0, 1000), CARD_LIST_PAGE_SIZE),
			});
		} else {
			handleOverwrite(newDeck);
		}
	}
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
						{ pages && currentCards &&
							<>
								<Pagination count={pages} page={page} onChange={handlePageChange} />
								<CardItemsList cards={currentCards} onCardsChange={updateCurrentCardsOfExistingDeck(setDeck, deck, pageIndex)} />
								<Pagination count={pages} page={page} onChange={handlePageChange} />
							</>
						}
					</Stack>
					<p>TODO: deck statistics on right gutter</p>
				</CardContent>
			</Card>
		</form>
	</>);
}
