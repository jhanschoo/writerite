import type { NextPage } from 'next';
import { ManageDecks } from '@/features/manageDecks';
import { StandardLayout } from '@/features/standardLayout';

const Home: NextPage = () => (
  <StandardLayout>
    <ManageDecks />
  </StandardLayout>
);

export default Home;
