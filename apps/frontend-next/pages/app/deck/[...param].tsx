import type { NextPage } from 'next';
import { useRouter } from 'next/router';
import { ManageDeck } from '@/features/manageDeck';
import { StandardLayout } from '@/features/standardLayout';

const DeckDetailPage: NextPage = () => {
  const router = useRouter();
  if (!router.isReady) {
    return null;
  }
  const [id, ...rest] = (router.query.param ?? []) as string[];
  return (
    <StandardLayout>
      <ManageDeck deckId={id} path={rest} />
    </StandardLayout>
  );
};

export default DeckDetailPage;
