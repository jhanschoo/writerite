import { motion } from 'framer-motion';
import type { NextPage } from 'next';
import { useRouter } from 'next/router';
import { useQuery } from 'urql';
import { Stack, Text } from '@mantine/core';

import { DeckDocument } from '@generated/graphql';
import { useMotionContext } from '@hooks/useMotionContext';
import { StandardLayout } from '@/features/standardLayout';
import { ManageDeck } from '@/features/manageDeck';

const HomeComponent = ({ id, path }: { id: string; path: string[] }) => {
  const { motionProps } = useMotionContext();
  const [{ data, fetching, error }] = useQuery({
    query: DeckDocument,
    variables: { id },
  });
  if (!data) {
    return null;
  }
  const { deck } = data;

  return (
    <StandardLayout>
      <motion.div {...motionProps}>
        <ManageDeck deck={deck} path={path} />
      </motion.div>
    </StandardLayout>
  );
};

const Home: NextPage = () => {
  const router = useRouter();
  if (!router.isReady) {
    return null;
  }
  const [id, ...rest] = (router.query.param ?? []) as string[];
  return <HomeComponent id={id} path={rest} />;
};

export default Home;
