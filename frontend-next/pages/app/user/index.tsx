import { motion } from 'framer-motion';
import type { NextPage } from 'next';

import { useMotionContext } from '@hooks/useMotionContext';
import { StandardLayout } from '@/features/standardLayout/components/StandardLayout';
import { UserDashboard } from '@/features/manageUser';

const User: NextPage = () => {
  const { motionProps } = useMotionContext();
  return (
    <StandardLayout>
      <motion.div {...motionProps}>
        <UserDashboard />
      </motion.div>
    </StandardLayout>
  );
};

export default User;
