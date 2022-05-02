import { Button, ButtonGroup, Card, CardActions, CardContent, Pagination, Paper, Stack, TextField, Typography } from "@mui/material";
import { ChangeEvent, useRef, useState } from "react";
import { useMutation } from "urql";
import { DeckCreateDocument } from "@generated/graphql";
import { CardItemsList } from "./CardItemsList";
import { importCardToEditableCard } from "../utils/importCardToEditableCard";
import { IDeck } from "../types/IImportDeck";
import { ImportFromCsv } from "./ImportFromCsv";
import { ImportInstructionsModal } from "./ImportInstructionsModal";
import { PaginatedEditableDeckActionType, usePaginatedEditableDeckReducer } from "../stores/paginatedEditableDeck";
import { IEditableCard } from "../types/IEditableCard";
import { newEditableCard } from "../utils/newEditableCard";
import { answersEditorStateToStringArray } from "@/features/editor";

export const CreateDeck = () => {
	const [showImportInstructionsModal, setShowImportInstructionsModal] = useState(false);
	const [, deckCreateMutation] = useMutation(DeckCreateDocument);
	// Note: all mutations of setDeck and setPage must satisfy consistency property that if deck.cards.length is truthy, then 0 < page <= deck.cards.length
	const [deck, dispatchDeck] = usePaginatedEditableDeckReducer();
	const [page, setPage] = useState(1);
	const cardsHeaderRef = useRef<HTMLHeadingElement>(null);
	const majorIndex = page - 1;
	const pages = deck?.cards.length;
	const currentCards = deck?.cards.length && deck.cards[majorIndex];
	const handleDeckCreate = () => {
		deckCreateMutation({
			answerLang: "",
			archived: false,
			cards: deck.cards.flat().map((card) => ({
				...card,
				answers: answersEditorStateToStringArray(card.answers),
			})),
			description: "",
			name: deck.title,
			promptLang: "",
			published: true,
		})
	}
	const handlePrependNewCard = () => {
		dispatchDeck({ type: PaginatedEditableDeckActionType.PREPEND_CARD, card: newEditableCard() });
	}
	const handlePageChange = (_e: ChangeEvent<unknown>, value: number) => {
		setPage(value);
		// scroll to Cards heading
		cardsHeaderRef.current?.scrollIntoView({ behavior: "smooth" });
	}
	const handleToggleShowImportInstructionsModal = () =>
		setShowImportInstructionsModal(!showImportInstructionsModal);
	const handleOverwrite = (newDeck: IDeck) => {
		dispatchDeck({ type: PaginatedEditableDeckActionType.REINITIALIZE_DECK, deck: newDeck });
	}
	const handleAppend = (newDeck: IDeck) => {
		dispatchDeck({ type: PaginatedEditableDeckActionType.APPEND_N_CARDS, cards: newDeck.cards.map(importCardToEditableCard) });
	}
	const handleCurrentCardUpdate = (card: IEditableCard, minorIndex: number) => {
		dispatchDeck({ type: PaginatedEditableDeckActionType.REPLACE_CARD, majorIndex, minorIndex, card });
	}
	const handleCurrentCardDelete = (minorIndex: number) => {
		dispatchDeck({ type: PaginatedEditableDeckActionType.REMOVE_CARD, majorIndex, minorIndex });
	}
	return <form>
		<Stack spacing={2}>
			<Stack direction="row">
				<Typography variant="h4" sx={{ flexGrow: 1 }} paddingX={2}>
					Create a New Deck
				</Typography>
				<ButtonGroup variant="contained" aria-label="Import deck modal toggle buttons">
					<ImportFromCsv onOverwrite={handleOverwrite} onAppend={deck.cards.length ? handleAppend : undefined} />
					<Button onClick={handleToggleShowImportInstructionsModal}>?</Button>
				</ButtonGroup>
				{ showImportInstructionsModal && <ImportInstructionsModal
					open={showImportInstructionsModal}
					handleClose={handleToggleShowImportInstructionsModal}
				/> }
			</Stack>
			<Paper>
				<Stack alignItems="center" spacing={2} padding={2}>
				<TextField
					id="deck-title"
					label="Title"
					variant="filled"
					size="largecentered"
					sx={{ width: "80%" }}
					margin="normal"
				/>
				<Typography variant="h6" textAlign="center">Subdecks</Typography>
				<Typography variant="h6" textAlign="center" id="create-deck-cards" ref={cardsHeaderRef}>Cards</Typography>
					<Button variant="outlined" onClick={handlePrependNewCard}>Add new card</Button>
					{ (pages && currentCards)
						? <>
							<Pagination count={pages} page={page} onChange={handlePageChange} />
							<CardItemsList cards={currentCards} handleCardChange={handleCurrentCardUpdate} handleCardDelete={handleCurrentCardDelete} />
							<Pagination count={pages} page={page} onChange={handlePageChange} />
						</>
						: undefined
					}
				</Stack>
			</Paper>
			<Button variant="contained" size="large" sx={{alignSelf: "center"}} onClick={handleDeckCreate}>Create Deck</Button>
		</Stack>
	</form>;
}
