import {
  useState,
  FC,
  MouseEvent,
  MouseEventHandler,
} from 'react';
import { DeckCreateDocument, DecksDocument, DecksQueryScope } from '@generated/graphql';
import { useMutation, useQuery } from 'urql';
import { STANDARD_DEBOUNCE_MS } from '@/utils';
import { useDebounce } from 'use-debounce';
import {
  ActionIcon,
  Button,
  Card,
  Center,
  createStyles,
  Divider,
  Group,
  Stack,
  Text,
  TextInput,
  Title,
} from '@mantine/core';
import { motionThemes } from '@/lib/framer-motion/motionThemes';
import { useMotionContext } from '@/hooks';
import { useRouter } from 'next/router';

const useStyles = createStyles(({ breakpoints }, _params, getRef) => ({
  root: {
    width: '100%',
    maxWidth: `${breakpoints.lg}px`,
  },
  group: {
    [`& > .${getRef('growable')}`]: { flexGrow: 1 },
  },
  growable: {
    ref: getRef('growable'),
  },
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
  const [{ data }, refetchDecks] = useQuery({
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
      const createdDeck = await deckCreateMutation(emptyNewDeckInput);
      refetchDecks();
      if (createdDeck.data?.deckCreate.id) {
        router.push(`/app/deck/${createdDeck.data.deckCreate.id}`);
      }
    })();
  };
  const decks = data?.decks.filter((deck) => deck.name.includes(titleFilter));
  return (
    <Stack sx={{ height: '100%' }} align="center">
    <Stack
      mx="md"
      sx={({ breakpoints }) => ({
        maxWidth: `${breakpoints.lg}px`,
        minHeight: 0,
        flexShrink: 1,
        overflowY: 'scroll',
      })}
    >
      <Box sx={{ height: '100vh' }} />
      <Title>Room {slug}</Title>
      <Divider
        label="This is the start of conversation in this room"
        variant="dashed"
        mr="md"
      />
      <Text>
        The standard Lorem Ipsum passage, used since the 1500s "Lorem ipsum dolor sit amet,
        consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore
        magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi
        ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in
        voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat
        cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est
        laborum."
      </Text>
    </Stack>
    <Group p="md" className={classes.inputPanel} position="center">
      <TextInput
        rightSection={
          <ActionIcon type="submit" variant="subtle" color="dark" title="Save">
            <PaperPlaneIcon />
          </ActionIcon>
        }
        variant="filled"
        sx={{
          minWidth: '33vw',
        }}
      />
    </Group>
  </Stack>
  );
};
