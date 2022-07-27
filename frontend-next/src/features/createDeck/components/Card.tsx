import { SelfManagedAnswersEditor, SelfManagedNotesEditor } from "../../editor";
import { IImportCard } from "../types/IImportCard";

export interface CardProps {
  card: IImportCard;
}

const Card = ({ card }: CardProps) => {
  return null;
  // return (
  //   <MuiCard {...muiCardProps}>
  //     {/* <CardContent>{card.front}, {card.back}, ({card.altAnswers.join(", ")})</CardContent> */}
  //     <CardContent>
  //       <SelfManagedNotesEditor initialContent={card.prompt} readOnly={true} />
  //       <Divider />
  //       <SelfManagedNotesEditor initialContent={card.fullAnswer} readOnly={true} />
  //       {
  //         card.answers.length
  //         ? (
  //           <>
  //             <SelfManagedAnswersEditor initialContent={card.answers} readOnly={true} />
  //           </>
  //         )
  //         : undefined
  //       }
  //     </CardContent>
  //   </MuiCard>
  // );
};

export default Card;