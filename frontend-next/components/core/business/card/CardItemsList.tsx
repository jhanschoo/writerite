import { Stack } from "@mui/material";
import EditableCard from "./EditableCard";
import type { IEditableCard } from "../../../../lib/core/entities/viewModel/card/editableCard";
import { updateCardOfCurrentCards } from "../../../../lib/core/entities/viewModel/deck/paginatedEditableDeck";

export interface CardItemsListProps {
	cards: IEditableCard[];
	onCardsChange: (cards: IEditableCard[]) => void;
}

// This is as opposed to receiving an array of data elements and calling a callback on only the data elements on the page. TODO: determine location of state management
const CardItemsList = ({ cards, onCardsChange }: CardItemsListProps) => {
	const cardItems = cards.map((card, index) =>
		<EditableCard
			key={index}
			card={card}
			onCardChange={updateCardOfCurrentCards(onCardsChange, cards, index)}
		/>
	);
	return <Stack spacing={2} paddingY={2} width="100%">
		{cardItems}
	</Stack>;
};

export default CardItemsList;