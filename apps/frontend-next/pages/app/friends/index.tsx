import type { NextPage } from 'next';
import { FriendsDashboard } from '@/features/manageFriends';
import { StandardLayout } from '@/features/standardLayout/components/StandardLayout';

const User: NextPage = () => {
  return (
    <StandardLayout>
      <FriendsDashboard />
    </StandardLayout>
  );
};

export default User;
