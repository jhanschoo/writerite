import { motion } from 'framer-motion';
import type { NextPage } from 'next';
import { useRouter } from 'next/router';
import { useQuery } from 'urql';
import { Text } from '@mantine/core';

import { DeckDocument } from '@generated/graphql';
import { useMotionContext } from '@hooks/useMotionContext';
import { StandardLayout } from '@/features/standardLayout';
import { ManageDeck } from '@/features/manageDeck';
import { theme } from '@/lib/mantine/theme';

const Home: NextPage = () => {
  const { motionProps } = useMotionContext();
  const router = useRouter();
  const id = router.query.id as string;
  const [{ data, fetching, error }] = useQuery({
    query: DeckDocument,
    variables: { id },
  });
  if (!data) {
    return null;
  }
  const { deck } = data;
  const { name } = deck;
  const nameBreadcrumb: string | JSX.Element = name || <Text color="dimmed" sx={{ fontStyle: 'italic' }}>Untitled Deck</Text>;

  return (
    <motion.div {...motionProps}>
      <StandardLayout breadcrumbs={[['/app', 'Home'], ['/app/deck', 'Decks'], [`/app/deck/${id}`, nameBreadcrumb]]}>
        <ManageDeck deck={deck} />
      </StandardLayout>
    </motion.div>
  );
};

export default Home;
