import { Stack, Typography } from "@mui/material";
import Card from "../../card/Card";
import type { IDeckWithoutSubdecks } from "../types";

export interface DeckWithoutSubdeckProps {
	deck: IDeckWithoutSubdecks;
}

const DeckWithoutSubdeck = ({ deck }: DeckWithoutSubdeckProps) => {
	const cardComponents = deck.cards.map((card, index) => (
		<Card card={card} key={`card-${index}`} />
	));
	return (
		<>
			<Typography variant="h5" textAlign="center">{deck.title}</Typography>
			<Stack flexShrink={1} spacing={1}>
				{cardComponents}
			</Stack>
		</>
	);
};

export default DeckWithoutSubdeck;