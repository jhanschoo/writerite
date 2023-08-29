import type { NextPage } from 'next';
import { useRouter } from 'next/router';
import { ManageFriendRoom } from '@/features/manageFriendRoom';
import { usePeriodicallyRefreshToken } from '@/features/signin';
import { StandardLayout } from '@/features/standardLayout/components/StandardLayout';

const Room: NextPage = () => {
  const router = useRouter();
  usePeriodicallyRefreshToken();
  const id = router.query.id as string | undefined;

  return (
    <StandardLayout vhHeight>
      {id && <ManageFriendRoom id={id} />}
    </StandardLayout>
  );
};

export default Room;
