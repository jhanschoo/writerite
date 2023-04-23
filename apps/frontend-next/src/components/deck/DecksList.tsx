import { Flex } from '@mantine/core';

export interface DeckItemComponentProps<T> {
  deck: T;
}

interface Props<T> {
  decks?: T[];
  component: (props: { deck: T }) => JSX.Element;
  justifyLeading?: boolean;
}

export const DecksList = <T,>({
  decks,
  component: DeckItemComponent,
  justifyLeading,
}: Props<T>) => {
  const decksList =
    decks?.map((deck, index) => (
      <DeckItemComponent key={index} deck={deck} />
    )) || [];
  if (!justifyLeading) {
    return <Flex gap="sm">{decksList}</Flex>;
  }
  decksList.reverse();
  return (
    <Flex wrap="wrap-reverse" direction="row-reverse" gap="sm">
      {decksList}
    </Flex>
  );
};
