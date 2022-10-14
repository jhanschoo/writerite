import { useState, ChangeEvent, FC, MouseEventHandler } from 'react';
import { DeckCreateDocument, DecksDocument, DecksQuery, DecksQueryScope } from '@generated/graphql';
import { useMutation, useQuery } from 'urql';
import { STANDARD_DEBOUNCE_MS, STANDARD_MAX_WAIT_DEBOUNCE_MS } from '@/utils';
import { useDebounce } from 'use-debounce';
import { Center, createStyles, Divider, Group, Paper, SegmentedControl, Stack, Text, TextInput, Title, UnstyledButton } from '@mantine/core';
import { DecksList } from './DecksList';
import { formatISO, parseISO } from 'date-fns';
import { motionThemes } from '@/lib/framer-motion/motionThemes';
import { useMotionContext } from '@/hooks';
import { useRouter } from 'next/router';

export const MANAGE_DECKS_DECKS_NUM = 20;

const NewDeckItem = ({ onClick }: { onClick?: MouseEventHandler<HTMLButtonElement> }) => (
  <UnstyledButton onClick={onClick}>
    <Paper
      shadow="sm"
      radius="md"
      px="sm"
      py="xs"
      withBorder
      sx={(theme) => {
        const { background, color, hover } = theme.fn.variant({ variant: 'filled' });
        return {
          backgroundColor: background,
          color,
          display: 'flex',
          flexDirection: 'row',
          ...theme.fn.hover({ backgroundColor: hover }),
        };
      }}
    >
      <Text size="lg" weight="bolder">Create a new Deck</Text>
    </Paper>
  </UnstyledButton>
);

const useStyles = createStyles(({ breakpoints }, _params, getRef) => ({
  root: {
    width: '100%',
    maxWidth: `${breakpoints.lg}px`,
  },
  group: {
    [`& > .${getRef('growable')}`]: { flexGrow: 1 }
  },
  growable: {
    ref: getRef('growable')
  }
}));

// TODO: pagination
export const ManageDecks: FC = () => {
  const router = useRouter();
  const { setMotionProps } = useMotionContext();
  const { classes } = useStyles();
  const [titleFilter, setTitleFilter] = useState('');
  const [debouncedTitleFilter] = useDebounce(titleFilter, STANDARD_DEBOUNCE_MS);
  const [scopeFilter, setScopeFilter] = useState<DecksQueryScope>(DecksQueryScope.Owned);
  const [cursor, setCursor] = useState<string | undefined>();
  const [{ data, fetching, error }, refetchDecks] = useQuery({
    query: DecksDocument,
    variables: {
      scope: scopeFilter,
      take: MANAGE_DECKS_DECKS_NUM,
      titleFilter: debouncedTitleFilter,
      cursor,
    },
  });
  const [, deckCreateMutation] = useMutation(DeckCreateDocument);
  const handleCreateDeck: MouseEventHandler = (e) => {
    (async () => {
      e.stopPropagation();
      setMotionProps(motionThemes.forward);
      const createdDeck = await deckCreateMutation({
        answerLang: 'en',
        cards: [],
        description: {},
        name: '',
        promptLang: 'en',
        published: false,
      });
      refetchDecks();
      if (createdDeck.data?.deckCreate.id) {
        router.push(`/app/deck/${createdDeck.data.deckCreate.id}`);
      }
    })();
  };
  const decks = data?.decks.filter((deck) => deck.name.includes(titleFilter));
  return <Center>
    <Stack p="md" className={classes.root} spacing={2}>
      <Group align="end" mb="sm" className={classes.group}>
        <Title order={1} className={classes.growable}>Manage Decks</Title>
        <NewDeckItem onClick={handleCreateDeck} />
      </Group>
      <Divider mb="md" />
      <Text>Search decks</Text>
      <SegmentedControl
        data={[
          { label: 'Owned decks', value: DecksQueryScope.Owned },
          { label: 'Relevant decks', value: DecksQueryScope.Participated },
          { label: 'Public decks', value: DecksQueryScope.Visible }
        ]}
      />
      <TextInput
        variant="filled"
        label="title must contain..."
        placeholder="e.g. ocabular"
        size="md"
        mb="md"
        value={titleFilter}
        onChange={(e: ChangeEvent<HTMLInputElement>) => setTitleFilter(e.target.value)}
      />
      <DecksList decks={decks} />
    </Stack>
  </Center>;
}
