import { motion } from 'framer-motion';
import type { NextPage } from 'next'
import { useRouter } from 'next/router'
import { useQuery } from 'urql';

import { DeckDocument } from '@generated/graphql';
import { useMotionContext } from '@hooks/useMotionContext';
import { StandardLayout } from '@/features/standardLayout';
import { Typography, useTheme } from '@mui/material';
import { ManageDeck } from '@/features/manageDeck';

const Home: NextPage = () => {
  const { motionProps } = useMotionContext();
  const router = useRouter();
  const theme = useTheme();
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
  const nameBreadcrumb: string | JSX.Element = name || <Typography variant="body1" sx={{ fontStyle: "italic", color: theme.palette.text.secondary }}>Untitled Deck</Typography>;

  return (
    <motion.div {...motionProps}>
      <StandardLayout breadcrumbs={[["/app", "Home"], ["/app/deck", "Decks"], [`/app/deck/${id}`, nameBreadcrumb]]}>
        <ManageDeck deck={deck} />
        {JSON.stringify(data)}
      </StandardLayout>
    </motion.div>
  );
}

export default Home;
