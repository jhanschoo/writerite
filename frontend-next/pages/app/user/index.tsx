import { motion } from 'framer-motion';
import type { NextPage } from 'next';

import { useMotionContext } from '@hooks/useMotionContext';
import { StandardLayout } from '@/features/standardLayout/components/StandardLayout';
import { PersonalDashboard } from '@/features/managePersonal';
import { useQuery } from 'urql';
import { UserPersonalDocument } from '@generated/graphql';

const User: NextPage = () => {
  const { motionProps } = useMotionContext();
  const [{ fetching, data }] = useQuery({
    query: UserPersonalDocument,
    variables: {},
  });
  if (!data) {
    return null;
  }
  return (
    <StandardLayout>
      <motion.div {...motionProps}>
        {data && <PersonalDashboard user={data.user} />}
      </motion.div>
    </StandardLayout>
  );
};

export default User;
