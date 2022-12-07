import { DeckRemoveSubdeckDocument } from '@generated/graphql';
import { FC, MouseEvent } from 'react';
import { useMutation } from 'urql';
import type { ManageDeckProps } from '@/features/manageDeck';
import { Button, Card, createStyles, LoadingOverlay, Stack, UnstyledButton } from '@mantine/core';
import { DeckSummaryContent } from '@/components/deck/DeckSummaryContent';
import { DecksList, DeckItemComponentProps } from '@/components/deck';
import { IconLinkOff } from '@tabler/icons';
import Link, { LinkProps } from 'next/link';

interface DeckItemProps extends DeckItemComponentProps {
  added?: boolean;
}

const useStyles = createStyles((_theme, _params, getRef) => {
  return {
    cardRoot: {
      [`&:hover .${getRef('cardCloseButton')}`]: {
        visibility: 'visible',
      },
    },
    cardCloseButton: {
      ref: getRef('cardCloseButton'),
      position: 'absolute',
      top: 0,
      right: 0,
      visibility: 'hidden',
      borderTopLeftRadius: 0,
      borderBottomRightRadius: 0,
    },
  };
});

const DeckItem: (parentId: string) => FC<DeckItemProps> =
  (parentId) =>
  ({ deck }) => {
    const { classes } = useStyles();
    const [{ fetching }, deckRemoveSubdeck] = useMutation(DeckRemoveSubdeckDocument);
    const handleCardDelete = async (e: MouseEvent<HTMLButtonElement>) => {
      e.stopPropagation();
      deckRemoveSubdeck({ id: parentId, subdeckId: deck.id });
    };
    return (
      <Link href={`/app/deck/${deck.id}`}>
        <UnstyledButton sx={{ height: 'unset' }} component="div">
          <Card
            shadow="md"
            radius="md"
            p="md"
            withBorder
            className={classes.cardRoot}
            sx={(theme) => {
              const { border, background, color, hover } = theme.fn.variant({ variant: 'default' });
              return {
                backgroundColor: background,
                color,
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                borderColor: border,
                ...theme.fn.hover({ backgroundColor: hover }),
              };
            }}
          >
            <Card.Section inheritPadding pt="sm">
              <Button
                size="xs"
                radius="xs"
                compact
                rightIcon={<IconLinkOff />}
                variant="filled"
                className={classes.cardCloseButton}
                disabled={fetching}
                onClick={handleCardDelete}
              >
                remove
              </Button>
            </Card.Section>
            <LoadingOverlay onClick={(e) => e.stopPropagation()} visible={fetching} />
            <DeckSummaryContent deck={deck} />
          </Card>
        </UnstyledButton>
      </Link>
    );
  };

export const ManageDeckSubdecksBrowse: FC<ManageDeckProps> = ({
  deck: { id: deckId, subdecks },
}) => {
  return (
    <Stack p="md" spacing={2}>
      <DecksList decks={subdecks} component={DeckItem(deckId)} />
    </Stack>
  );
};
