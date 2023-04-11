import { motion } from 'framer-motion';
import type { NextPage } from 'next';

import { useMotionContext } from '@hooks/useMotionContext';
import { ManageDecks } from '@/features/manageDecks';
import { StandardLayout } from '@/features/standardLayout';

const Home: NextPage = () => {
  const { motionProps } = useMotionContext();
  return (
    <StandardLayout
      breadcrumbs={[
        ['/app', 'Home'],
        ['/app/deck', 'Decks'],
      ]}
    >
      <motion.div {...motionProps}>
        <ManageDecks />
      </motion.div>
    </StandardLayout>
  );
};

export default Home;
