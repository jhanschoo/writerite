import {
  DeckAddSubdeckDocument,
  DeckCreateDocument,
  DecksQueryOrder,
  DeckSummaryFragment,
} from '@generated/graphql';
import { FC, useState, ChangeEvent, MouseEvent, useEffect } from 'react';
import { useMutation } from 'urql';
import type { ManageDeckProps } from '@/features/manageDeck';
import {
  Button,
  Card,
  Divider,
  Flex,
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
import { DeckItemComponentProps } from '@/components/deck';
import { IconArrowLeft, IconCheck, IconLink, IconPlus, IconUpload, IconX } from '@tabler/icons';
import { useHover } from '@mantine/hooks';
import Link from 'next/link';
import { useQueryRecentDecks } from '@/hooks/datasource/useQueryRecentDecks';
import { BasicList } from '@/components/BasicList';
import { SubdeckListItemContent } from './SubdeckListItemContent';
import { useRouter } from 'next/router';

export const INITIAL_RECENT_DECKS = 5;

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
      <IconLink size={40} />
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
      <IconCheck size={40} color={color} />
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

interface Props extends ManageDeckProps {
  onFinishedAddingSubdecks(): void;
}

export const ManageDeckSubdecksAddSubdeck: FC<Props> = ({
  deck: { id: deckId, subdecks },
  onFinishedAddingSubdecks,
}) => {
  const stoplist = subdecks.map(({ id }) => id);
  stoplist.push(deckId);
  const router = useRouter();
  const [titleFilter, setTitleFilter] = useState('');
  const [recentShowMore, setRecentShowMore] = useState(false);
  const [added, setAdded] = useState<string[]>([]);
  const [persistedRecentDecks, setPersistedDecks] = useState<DeckSummaryFragment[]>([]);
  const [{ data, fetching, error }] = useQueryRecentDecks({
    stoplist,
    order: DecksQueryOrder.EditedRecency,
  });
  useEffect(() => {
    if (data && persistedRecentDecks.length === 0) {
      setPersistedDecks(data.decks);
    }
  }, [data]);
  const [, addSubdeck] = useMutation(DeckAddSubdeckDocument);
  const [, deckCreateMutation] = useMutation(DeckCreateDocument);
  const handleCreateSubdeck = async () => {
    const createdDeck = await deckCreateMutation({
      answerLang: 'en',
      cards: [],
      description: null,
      name: '',
      promptLang: 'en',
      published: false,
      parentDeckId: deckId,
    });
    if (createdDeck.data?.deckCreate.id) {
      router.push(`/app/deck/${createdDeck.data.deckCreate.id}`);
    }
  };
  const handleAddSubdeck = async (subdeckId: string) => {
    await addSubdeck({ id: deckId, subdeckId });
    setAdded(added.concat([subdeckId]));
  };
  const recentDeckItems = (persistedRecentDecks ?? []).map((deck, index) => (
    <SubdeckListItemContent
      key={index}
      deck={deck}
      onAction={() => handleAddSubdeck(deck.id)}
      actioned={added.includes(deck.id)}
      actionText="Link"
      actionedText="Linked"
      actionIcon={<IconLink />}
      actionedIcon={<IconCheck />}
    />
  ));
  const canShowMoreRecentDecks = recentDeckItems.length > INITIAL_RECENT_DECKS && !recentShowMore;
  if (canShowMoreRecentDecks) {
    recentDeckItems.length = INITIAL_RECENT_DECKS;
  }
  return (
    <Stack p="sm">
      <BasicList borderTop borderBottom data={recentDeckItems} />
      {canShowMoreRecentDecks && (
        <Button fullWidth variant="subtle" onClick={() => setRecentShowMore(true)}>
          Show more
        </Button>
      )}
      <Flex justify="space-between" align="center">
        <Button variant="subtle" onClick={onFinishedAddingSubdecks} leftIcon={<IconArrowLeft />}>
          Back
        </Button>
        <Flex gap="md" wrap="wrap" justify="flex-end">
          <Button variant="filled" onClick={handleCreateSubdeck} leftIcon={<IconPlus />}>
            New
          </Button>
          <Button
            variant="outline"
            onClick={() => console.log('new subdeck')}
            leftIcon={<IconUpload />}
          >
            Import
          </Button>
        </Flex>
      </Flex>
      <Divider />
      <TextInput
        variant="filled"
        label="Find more decks"
        placeholder="e.g. ocabular"
        size="md"
        mb="md"
        value={titleFilter}
        onChange={(e: ChangeEvent<HTMLInputElement>) => {
          setTitleFilter(e.target.value);
          setAdded([]);
        }}
      />
    </Stack>
  );
};
