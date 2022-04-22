import { Pagination, Stack } from "@mui/material";
import { ChangeEvent, ReactNode, useState } from "react";
import BasicPagination from "../../basic/pagination/BasicPagination";
import EditableCard from "./EditableCard";
import type { IEditableCard } from "./types";

export interface CardItemsListProps {
	cards: IEditableCard[][];
	onCardsChange: (cards: IEditableCard[][]) => void;
}

const parametrizedStack = (({ children }: { children: ReactNode }) => <Stack spacing={2} paddingY={2}>{children}</Stack>)

// This is as opposed to receiving an array of data elements and calling a callback on only the data elements on the page. TODO: determine location of state management
const CardItemsList = ({ cards, onCardsChange }: CardItemsListProps) => {
	const [page, setPage] = useState(1);
	const currentCards = cards[page - 1];
	const cardItems = currentCards.map((card, index) =>
	(<EditableCard
		key={index}
		card={card}
		onCardChange={(newCard) => onCardsChange([
			...cards.slice(0, page),
			[...currentCards.slice(0, index), newCard, ...currentCards.slice(index + 1)],
			...cards.slice(page + 1)])}
	/>));
	const handlePageChange = (_e: ChangeEvent<unknown>, value: number) => setPage(value)
	return (
		<>
		<Stack direction="row" justifyContent="center">
			<Pagination count={cards.length} page={page} onChange={handlePageChange} />
		</Stack>
		<Stack spacing={2} paddingY={2}>
			{cardItems}
		</Stack>
		<Stack direction="row" justifyContent="center">
			<Pagination count={cards.length} page={page} onChange={handlePageChange} />
		</Stack>
		</>
	);
};

export default CardItemsList;