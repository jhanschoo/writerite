import { motion } from 'framer-motion';
import type { NextPage } from 'next';
import { useQuery } from 'urql';

import { UserDocument } from '@generated/graphql';
import { useMotionContext } from '@hooks/useMotionContext';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { Dashboard } from '@/features/dashboard';
import { StandardLayout } from '@/features/standardLayout/components/StandardLayout';

const Profile: NextPage = () => {
  const router = useRouter();
  const { motionProps } = useMotionContext();
  const [userResult] = useQuery({
    query: UserDocument,
    variables: {},
  });
  useEffect(() => {
    if (userResult.data?.user && !userResult.data.user.name) {
      router.push('/app/finalize-name');
    }
  });
  return (
    <StandardLayout>
      <motion.div {...motionProps}>
        <Dashboard />
      </motion.div>
    </StandardLayout>
  );
};

export default Profile;
