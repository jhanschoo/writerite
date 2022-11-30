import { useState, ChangeEvent, FC, MouseEventHandler, Dispatch, SetStateAction } from 'react';
import { DeckCreateDocument, DecksDocument, DecksQueryScope } from '@generated/graphql';
import { useMutation, useQuery } from 'urql';
import { STANDARD_DEBOUNCE_MS } from '@/utils';
import { useDebounce } from 'use-debounce';
import { Card, SegmentedControl, Text, TextInput, UnstyledButton } from '@mantine/core';
import { DeckItemComponentProps, DecksList, DeckSummaryContent } from '@/components/deck';
import { motionThemes } from '@/lib/framer-motion/motionThemes';
import { useMotionContext } from '@/hooks';
import { useRouter } from 'next/router';

export const MANAGE_DECKS_DECKS_NUM = 20;

type OnClickFactoryType = (
  deck: DeckItemComponentProps['deck']
) => MouseEventHandler<HTMLDivElement>;

const emptyNewDeckInput = {
  answerLang: 'en',
  cards: [],
  description: {},
  name: '',
  promptLang: 'en',
  published: false,
};

const DeckItemFactory =
  (onClickFactory: OnClickFactoryType): FC<DeckItemComponentProps> =>
  ({ deck }) => {
    return (
      <UnstyledButton
        sx={{ height: 'unset', flex: '1 0 auto' }}
        onClick={onClickFactory(deck)}
        component="div"
      >
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
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              borderColor: border,
              ...theme.fn.hover({ backgroundColor: hover }),
            };
          }}
        >
          <DeckSummaryContent deck={deck} />
        </Card>
      </UnstyledButton>
    );
  };

interface Props {
  onClickFactory: OnClickFactoryType;
}

// TODO: pagination
export const SearchDecks: FC<Props> = ({ onClickFactory }) => {
  const router = useRouter();
  const { setMotionProps } = useMotionContext();
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
    <>
      <Text>Search decks</Text>
      <SegmentedControl
        value={scopeFilter}
        onChange={setScopeFilter as Dispatch<SetStateAction<string>>}
        data={[
          { label: 'Owned decks', value: DecksQueryScope.Owned },
          { label: 'Relevant decks', value: DecksQueryScope.Participated },
          { label: 'Public decks', value: DecksQueryScope.Visible },
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
      <DecksList decks={decks} component={DeckItemFactory(onClickFactory)} justifyLeading />
    </>
  );
};
