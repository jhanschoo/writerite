import { motion } from 'framer-motion';
import type { NextPage } from 'next';
import { useRouter } from 'next/router';

import { useMotionContext } from '@hooks/useMotionContext';
import { StandardLayout } from '@/features/standardLayout';
import { usePeriodicallyRefreshToken } from '@/features/signin';
import { ManageRoom } from '@/features/manageRoom/components/ManageRoom';

const Home: NextPage = () => {
  const { motionProps } = useMotionContext();
  const router = useRouter();
  usePeriodicallyRefreshToken();
  const slug = router.query.slug as string | undefined;

  return (
    <StandardLayout vhHeight>
      <motion.div {...motionProps}>{slug && <ManageRoom slug={slug} />}</motion.div>
    </StandardLayout>
  );
};

export default Home;
