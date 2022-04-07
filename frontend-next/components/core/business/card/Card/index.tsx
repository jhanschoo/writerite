import { Typography, Card, CardContent } from "@mui/material";
import type { ICard } from "../types";

export interface CardProps {
	card: ICard;
}

const WrCard = ({ card }: CardProps) => {
	return (
		<Card>
			<CardContent>{card.front}, {card.back}, ({card.altAnswers.join(", ")})</CardContent>
		</Card>
	);
};

export default WrCard;