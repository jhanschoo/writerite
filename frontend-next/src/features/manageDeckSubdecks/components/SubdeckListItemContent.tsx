import { DeckCompactSummaryContent, DeckName } from '@/components/deck';
import { DECK_DETAIL_PATH } from '@/paths';
import { DeckSummaryFragment } from '@generated/graphql';
import { Button, Text } from '@mantine/core';
import { useRouter } from 'next/router';
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
  const router = useRouter();
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
      <DeckCompactSummaryContent deck={deck} rootProps={{ sx: { flexGrow: 1 } }} />
      <Button variant="subtle" compact onClick={() => router.push(DECK_DETAIL_PATH(id))}>
        Visit
      </Button>
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
