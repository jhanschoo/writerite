import { FC, MouseEvent, MouseEventHandler } from 'react';
import { DeckCreateDocument } from '@generated/graphql';
import { useMutation } from 'urql';
import { Button, Center, createStyles, Divider, Group, Stack, Title } from '@mantine/core';
import { motionThemes } from '@/lib/framer-motion/motionThemes';
import { useMotionContext } from '@/hooks';
import { useRouter } from 'next/router';
import { SearchDecks } from './SearchDecks';
import { DECK_DETAIL_PATH } from '@/paths';

const emptyNewDeckInput = {
  answerLang: 'en',
  cards: [],
  description: {},
  name: '',
  promptLang: 'en',
  published: false,
};

const NewDeckItem = ({ onClick }: { onClick?: MouseEventHandler<HTMLButtonElement> }) => (
  <Button onClick={onClick} size="lg">
    Create a new Deck
  </Button>
);

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
  const [, deckCreateMutation] = useMutation(DeckCreateDocument);
  const handleCreateDeck: MouseEventHandler = async (e) => {
    e.stopPropagation();
    setMotionProps(motionThemes.forward);
    const createdDeck = await deckCreateMutation(emptyNewDeckInput);
    if (createdDeck.data?.deckCreate.id) {
      router.push(DECK_DETAIL_PATH(createdDeck.data.deckCreate.id));
    }
  };
  return (
    <Center>
      <Stack p="md" className={classes.root} spacing={2}>
        <Group align="end" mb="sm" className={classes.group}>
          <Title order={1} className={classes.growable}>
            Manage Decks
          </Title>
          <NewDeckItem onClick={handleCreateDeck} />
        </Group>
        <Divider mb="md" />
        <SearchDecks
          onClickFactory={(deck) => (e: MouseEvent<HTMLDivElement>) => {
            e.stopPropagation();
            router.push(DECK_DETAIL_PATH(deck.id));
          }}
        />
      </Stack>
    </Center>
  );
};
