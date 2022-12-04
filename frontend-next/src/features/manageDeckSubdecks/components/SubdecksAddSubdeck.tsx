import { DeckAddSubdeckDocument, DecksDocument, DecksQueryScope } from '@generated/graphql';
import { FC, useState, ChangeEvent, MouseEvent } from 'react';
import { useMutation, useQuery } from 'urql';
import type { ManageDeckProps } from '@/features/manageDeck';
import { useDebounce } from 'use-debounce';
import { STANDARD_DEBOUNCE_MS } from '@/utils';
import {
  Button,
  Card,
  LoadingOverlay,
  LoadingOverlayProps,
  MantineTheme,
  Stack,
  Text,
  TextInput,
  UnstyledButton,
  useMantineTheme,
} from '@mantine/core';
import { DeckSummaryContent } from '@/components/deck/DeckSummaryContent';
import { DecksList, DeckItemComponentProps } from '@/components/deck';
import { CheckIcon, Link2Icon } from '@radix-ui/react-icons';
import { useHover } from '@mantine/hooks';
import Link from 'next/link';

export const MANAGE_DECKS_DECKS_NUM = 12;

interface DeckItemFactoryProps {
  parentId: string;
  added: string[];
  onAdded: (subdeckId: string) => void;
}

interface DeckItemProps extends DeckItemComponentProps {
  added?: boolean;
}

const addSubdeckProps: LoadingOverlayProps = {
  visible: true,
  loader: (
    <Stack align="center" spacing={1}>
      <Link2Icon width="40" height="40" />
      <Text size="xl" weight="bold">
        Link
      </Text>
    </Stack>
  ),
};

const fetchingProps: LoadingOverlayProps = {
  onClick(e) {
    e.stopPropagation();
  },
  visible: true,
};

const addedProps = ({
  background,
  color,
}: ReturnType<MantineTheme['fn']['variant']>): LoadingOverlayProps => ({
  onClick(e) {
    e.stopPropagation();
  },
  visible: true,
  loader: (
    <Stack align="center" spacing={1}>
      <CheckIcon width="40" height="40" color={color} />
      <Text color={color} size="xl" weight="bold">
        Added
      </Text>
    </Stack>
  ),
  overlayColor: background,
});

const DeckItem =
  ({ parentId, added, onAdded }: DeckItemFactoryProps): FC<DeckItemProps> =>
  ({ deck }) => {
    const theme = useMantineTheme();
    const { hovered: cardHovered, ref: cardRef } = useHover();
    const variantOutput = theme.fn.variant({ variant: 'filled' });
    const [{ fetching }, deckAddSubdeck] = useMutation(DeckAddSubdeckDocument);
    const handleAddSubdeck = async (e: MouseEvent<HTMLDivElement>) => {
      e.stopPropagation();
      await deckAddSubdeck({ id: parentId, subdeckId: deck.id });
      onAdded(deck.id);
    };
    const thisAdded = added.includes(deck.id);
    const readyState = !thisAdded && !fetching;
    return (
      <Card
        shadow="md"
        radius="md"
        p="md"
        withBorder
        sx={(theme) => {
          const { border, background, color, hover } = theme.fn.variant({ variant: 'default' });
          return {
            backgroundColor: background,
            color,
            height: 'unset',
            display: 'flex',
            flexDirection: 'column',
            borderColor: border,
            ...theme.fn.hover({ backgroundColor: hover }),
          };
        }}
      >
        <Card.Section ref={cardRef}>
          <UnstyledButton
            sx={{ position: 'relative' }}
            component="div"
            p="md"
            onClick={handleAddSubdeck}
          >
            <LoadingOverlay
              {...(readyState && cardHovered ? addSubdeckProps : { visible: false })}
            />
            <DeckSummaryContent deck={deck} />
          </UnstyledButton>
        </Card.Section>
        <LoadingOverlay
          visible={false}
          {...(fetching && fetchingProps)}
          {...(thisAdded && addedProps(variantOutput))}
        />
        <Card.Section>
          <Link href={`/app/deck/${deck.id}`}>
            <Button fullWidth variant="subtle" sx={{ borderRadius: 0 }}>
              View
            </Button>
          </Link>
        </Card.Section>
      </Card>
    );
  };

export const ManageDeckSubdecksAddSubdeck: FC<ManageDeckProps> = ({
  deck: { id: deckId, subdecks },
}) => {
  const [titleFilter, setTitleFilter] = useState('');
  const [debouncedTitleFilter] = useDebounce(titleFilter, STANDARD_DEBOUNCE_MS);
  const [added, setAdded] = useState<string[]>([]);
  const [cursor, setCursor] = useState<string | undefined>();
  const [{ data, fetching, error }, refetchDecks] = useQuery({
    query: DecksDocument,
    variables: {
      scope: DecksQueryScope.Owned,
      take: MANAGE_DECKS_DECKS_NUM,
      titleFilter: debouncedTitleFilter,
      cursor,
    },
  });
  const onAdded = (subdeckId: string) => {
    setAdded(added.concat([subdeckId]));
  };
  const candidateDecks = data?.decks.filter(
    ({ name, id }) =>
      // if title filter is specified, filter deck names by it
      (!titleFilter || name.includes(titleFilter)) &&
      // never show ownself as subdeck candidate
      id !== deckId &&
      // if a subdeck candidate is already a subdeck, show with special formatting if presently added
      //   else don't show
      (added.includes(id) || !subdecks.some((subdeck) => subdeck.id === id))
  );
  return (
    <Stack p="md" spacing={2}>
      <TextInput
        variant="filled"
        label="title must contain..."
        placeholder="e.g. ocabular"
        size="md"
        mb="md"
        value={titleFilter}
        onChange={(e: ChangeEvent<HTMLInputElement>) => {
          setTitleFilter(e.target.value);
          setAdded([]);
        }}
      />
      <DecksList
        decks={candidateDecks}
        component={DeckItem({ parentId: deckId, added, onAdded })}
      />
    </Stack>
  );
};
