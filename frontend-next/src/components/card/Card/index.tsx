import { Card as MuiCard, CardContent, CardTypeMap, Divider } from "@mui/material";
import { DefaultComponentProps } from "@mui/material/OverridableComponent";
import { SelfManagedAnswersEditor, SelfManagedNotesEditor } from "../../../features/editor";
import { ICard } from "../../../lib/entities/model/card";

export interface CardProps {
	card: ICard;
	muiCardProps?: Partial<DefaultComponentProps<CardTypeMap<{}, "div">>>;
}

const Card = ({ card, muiCardProps }: CardProps) => {
	return (
		<MuiCard {...muiCardProps}>
			{/* <CardContent>{card.front}, {card.back}, ({card.altAnswers.join(", ")})</CardContent> */}
			<CardContent>
				<SelfManagedNotesEditor initialContent={card.front} readOnly={true} />
				<Divider />
				<SelfManagedNotesEditor initialContent={card.back} readOnly={true} />
				{
					card.altAnswers.length
					? (
						<>
							<SelfManagedAnswersEditor initialContent={card.altAnswers} readOnly={true} />
						</>
					)
					: undefined
				}
			</CardContent>
		</MuiCard>
	);
};

export default Card;