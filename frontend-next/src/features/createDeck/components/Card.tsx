import { Card as MuiCard, CardContent, CardTypeMap, Divider } from "@mui/material";
import { DefaultComponentProps } from "@mui/material/OverridableComponent";
import { SelfManagedAnswersEditor, SelfManagedNotesEditor } from "../../editor";
import { IImportCard } from "../types/IImportCard";

export interface CardProps {
  card: IImportCard;
  muiCardProps?: Partial<DefaultComponentProps<CardTypeMap<Record<string, unknown>, "div">>>;
}

const Card = ({ card, muiCardProps }: CardProps) => {
  return (
    <MuiCard {...muiCardProps}>
      {/* <CardContent>{card.front}, {card.back}, ({card.altAnswers.join(", ")})</CardContent> */}
      <CardContent>
        <SelfManagedNotesEditor initialContent={card.prompt} readOnly={true} />
        <Divider />
        <SelfManagedNotesEditor initialContent={card.fullAnswer} readOnly={true} />
        {
          card.answers.length
          ? (
            <>
              <SelfManagedAnswersEditor initialContent={card.answers} readOnly={true} />
            </>
          )
          : undefined
        }
      </CardContent>
    </MuiCard>
  );
};

export default Card;