import { Stack, Typography } from "@mui/material";
import Card, { CardProps } from "./Card";
import { CARD_LIST_PAGE_SIZE } from "../constants";
import { IDeck } from "../utils/deck";

export interface DeckWithoutSubdeckProps {
	deck: IDeck;
	cardComponentProps?: Partial<CardProps>;
	isExceeded?: boolean;
}

const ImportFromCsvPreview = ({ deck, cardComponentProps, isExceeded }: DeckWithoutSubdeckProps) => {
	const { title, cards } = deck;
	const cardComponents = cards.slice(0, CARD_LIST_PAGE_SIZE).map((card, index) =>
		<Card {...cardComponentProps} card={card} key={`card-${index}`} />
	);
	return <>
		<Typography variant="h5" textAlign="center">{title}</Typography>
		<Typography variant="body1" textAlign="center">{cards.length}{isExceeded && '+'} cards</Typography>
		<Typography variant="body2" textAlign="center">The first few cards are as follows</Typography>
		<Stack spacing={1} paddingY={1} overflow="auto">
			{cardComponents}
		</Stack>
		{isExceeded && <Typography variant="body2">If replacing, the first 1000 rows of the .csv file will be imported. If overwriting, only the first few cards will be added until the deck has 1000 cards.</Typography>}
	</>;
};

export default ImportFromCsvPreview;