import { motion } from 'framer-motion';
import type { NextPage } from 'next';
import { useQuery } from 'urql';

import { UserDocument } from '@generated/graphql';
import { useMotionContext } from '@hooks/useMotionContext';
import { ManageDecks } from '@/features/manageDecks';
import { StandardLayout } from '@/features/standardLayout';

const Home: NextPage = () => {
  const { motionProps } = useMotionContext();
  const [userResult, reexecuteUserQuery] = useQuery({
    query: UserDocument,
  });
  const showFinalizeUserModal = Boolean(userResult.data?.user && !userResult.data.user.name);
  return (
    <StandardLayout breadcrumbs={[['/app', 'Home'], ['/app/deck', 'Decks']]}>
      <motion.div {...motionProps}>
        <ManageDecks />
      </motion.div>
    </StandardLayout>
  );
};

export default Home;
