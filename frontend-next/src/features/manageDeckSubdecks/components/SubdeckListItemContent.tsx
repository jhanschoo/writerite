import { DeckSummaryFragment } from '@generated/graphql';
import { Button, Text } from '@mantine/core';
import Link from 'next/link';
import { FC, ReactNode, useState } from 'react';

interface SubdeckListItemContentProps {
  deck: DeckSummaryFragment;
  onAction(): Promise<unknown>;
  actionIcon: ReactNode;
  actionedIcon: ReactNode;
  actioned: boolean;
  actionText: string;
  actionedText: string;
}

export const SubdeckListItemContent: FC<SubdeckListItemContentProps> = ({
  actioned,
  actionText,
  actionedText,
  actionIcon,
  actionedIcon,
  deck,
  onAction,
}) => {
  const { id, name, cardsDirectCount, subdecksCount } = deck;
  const [isAdding, setIsAdding] = useState(false);
  const handleClick = async () => {
    try {
      setIsAdding(true);
      await onAction();
    } finally {
      setIsAdding(false);
    }
  };
  return (
    <>
      <Text sx={{ flexGrow: 1 }}>
        <Text component="span" fw="bold">
          {name}
        </Text>
        <br />
        {cardsDirectCount ? `${cardsDirectCount} cards` : ''}
        {cardsDirectCount && subdecksCount ? ' / ' : ''}
        {subdecksCount ? `${subdecksCount} subdecks` : ''}
        {!(cardsDirectCount || subdecksCount) ? 'Empty deck' : ''}
      </Text>
      <Link href={`/app/deck/${id}`}>
        <Button variant="subtle" compact>
          Visit
        </Button>
      </Link>
      <Button
        leftIcon={actioned ? actionedIcon : actionIcon}
        variant="subtle"
        compact
        disabled={isAdding || actioned}
        onClick={handleClick}
      >
        {actioned ? actionedText : actionText}
      </Button>
    </>
  );
};
