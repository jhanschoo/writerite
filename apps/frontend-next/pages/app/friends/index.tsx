import type { NextPage } from "next";

import { StandardLayout } from "@/features/standardLayout/components/StandardLayout";
import { FriendsDashboard } from "@/features/manageFriends";

const User: NextPage = () => {
  return (
    <StandardLayout>
      <FriendsDashboard />
    </StandardLayout>
  );
};

export default User;
