import { Typography } from "@mui/material";
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
			{cardComponents}
		</>
	);
};

export default DeckWithoutSubdeck;