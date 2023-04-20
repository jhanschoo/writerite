import {
  DeckCompactSummaryContent,
  DeckCompactSummaryContentFragment,
  DeckName,
} from "@/components/deck";
import { DECK_DETAIL_PATH } from "@/paths";
import { FragmentType, graphql, useFragment } from "@generated/gql";
import { Button, Flex } from "@mantine/core";
import { useRouter } from "next/router";
import { ReactNode, useState } from "react";

export const SubdeckListItemContentFragment = graphql(/* GraphQL */ `
  fragment SubdeckListItemContent on Deck {
    ...DeckCompactSummaryContent
    id
  }
`);

interface SubdeckListItemContentProps {
  deck: FragmentType<typeof SubdeckListItemContentFragment>;
  onAction(): Promise<unknown>;
  actionIcon: ReactNode;
  actionedIcon: ReactNode;
  actioned: boolean;
  actionText: string;
  actionedText: string;
}

export const SubdeckListItemContent = ({
  actioned,
  actionText,
  actionedText,
  actionIcon,
  actionedIcon,
  deck,
  onAction,
}: SubdeckListItemContentProps) => {
  const deckFragment = useFragment(SubdeckListItemContentFragment, deck);
  const { id } = deckFragment;
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
      <DeckCompactSummaryContent
        deck={deckFragment}
        rootProps={{ sx: { flexGrow: 1 } }}
      />
      <Flex wrap="wrap" justify="flex-end">
        <Button
          variant="subtle"
          onClick={() => router.push(DECK_DETAIL_PATH(id))}
        >
          Visit
        </Button>
        <Button
          leftIcon={actioned ? actionedIcon : actionIcon}
          variant="subtle"
          disabled={isAdding || actioned}
          onClick={handleClick}
        >
          {actioned ? actionedText : actionText}
        </Button>
      </Flex>
    </>
  );
};
