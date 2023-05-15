import type { NextPage } from 'next';
import { useRouter } from 'next/router';
import { ManageRoom } from '@/features/manageRoom';
import { usePeriodicallyRefreshToken } from '@/features/signin';
import { StandardLayout } from '@/features/standardLayout';

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
