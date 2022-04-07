import { Card, CardContent, Divider } from "@mui/material";
import SelfManagedAnswersEditor from "../../../application/editor/SelfManagedAnswersEditor";
import SelfManagedNotesEditor from "../../../application/editor/SelfManagedNotesEditor";
import type { ICard } from "../types";

export interface CardProps {
	card: ICard;
}

const WrCard = ({ card }: CardProps) => {
	return (
		<Card>
			{/* <CardContent>{card.front}, {card.back}, ({card.altAnswers.join(", ")})</CardContent> */}
			<CardContent>
				<SelfManagedNotesEditor initialContent={card.front} readOnly={true} />
				<Divider />
				<SelfManagedNotesEditor initialContent={card.back} readOnly={true} />
				{
					card.altAnswers.length > 0 && (
						<>
							<Divider />
							<SelfManagedAnswersEditor initialContent={card.altAnswers} readOnly={true} />
						</>
					)
				}
			</CardContent>
		</Card>
	);
};

export default WrCard;