import { motion } from 'framer-motion';
import type { NextPage } from 'next';
import { useRouter } from 'next/router';
import { useQuery } from 'urql';
import {
  ActionIcon,
  Box,
  createStyles,
  Divider,
  Group,
  Stack,
  Text,
  TextInput,
  Title,
} from '@mantine/core';

import { useMotionContext } from '@hooks/useMotionContext';
import { StandardLayout } from '@/features/standardLayout';
import { PaperPlaneIcon } from '@radix-ui/react-icons';
import { usePeriodicallyRefreshToken } from '@/features/signin';
import { ManageRoom } from '@/features/manageRoom/components/ManageRoom';

const Home: NextPage = () => {
  const { motionProps } = useMotionContext();
  const router = useRouter();
  usePeriodicallyRefreshToken();
  const slug = router.query.slug as string;

  return (
    <StandardLayout
      breadcrumbs={[
        ['/app', 'Home'],
        ['/app/deck', 'Rooms'],
        [`/app/room/${slug}`, slug],
      ]}
      vhHeight
    >
      <motion.div {...motionProps}>
        <ManageRoom slug={slug} />
      </motion.div>
    </StandardLayout>
  );
};

export default Home;
