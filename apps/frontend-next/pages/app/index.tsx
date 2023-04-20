import type { NextPage } from 'next';
import { Dashboard } from '@/features/dashboard';
import { StandardLayout } from '@/features/standardLayout/components/StandardLayout';


const Home: NextPage = () => {
  return (
    <StandardLayout>
      <Dashboard />
    </StandardLayout>
  );
};

export default Home;
