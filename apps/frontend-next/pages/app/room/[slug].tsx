import type { NextPage } from 'next';
import { useRouter } from 'next/router';

import { StandardLayout } from '@/features/standardLayout';
import { usePeriodicallyRefreshToken } from '@/features/signin';
import { ManageRoom } from '@/features/manageRoom/components/ManageRoom';

const Home: NextPage = () => {
  const router = useRouter();
  usePeriodicallyRefreshToken();
  const id = router.query.id as string;

  return (
    <StandardLayout vhHeight>
      <ManageRoom id={id} />
    </StandardLayout>
  );
};

export default Home;
