import { Stack } from "@mui/material";
import { EditableCard } from "./EditableCard";
import type { IEditableCard } from "../types/IEditableCard";

export interface CardItemsListProps {
  cards: IEditableCard[];
  handleCardChange: (card: IEditableCard, index: number) => void;
  handleCardDelete: (index: number) => void;
}

export const CardItemsList = ({ cards, handleCardChange, handleCardDelete }: CardItemsListProps) => {
  const cardItems = cards.map((card, index) =>
    <EditableCard
      key={index}
      card={card}
      onCardChange={(nextCard) => handleCardChange(nextCard, index)}
      onCardDelete={() => handleCardDelete(index)}
      muiCardProps={{
        sx: {
          flexShrink: 0,
        }
      }}
    />
  );
  return <Stack spacing={2} padding={2} width="100%" maxHeight="50vh" overflow="auto">
    {cardItems}
  </Stack>;
};
