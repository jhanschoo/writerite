import type { NextPage } from 'next';
import { useRouter } from 'next/router';
import { ManageDeck } from '@/features/manageDeck';
import { StandardLayout } from '@/features/standardLayout';
import { graphql } from '@generated/gql';
import { useQuery } from 'urql';

const DeckQuery = graphql(/* GraphQL */ `
  query DeckQuery($id: ID!, $after: ID, $first: Int, $before: ID, $last: Int) {
    deck(id: $id) {
      id
      ...ManageDeck
    }
  }
`);

const HomeComponent = ({ id, path }: { id: string; path: string[] }) => {
  const [{ data, fetching, error }] = useQuery({
    query: DeckQuery,
    variables: { id },
  });
  if (!data) {
    return null;
  }
  const { deck } = data;

  return (
    <StandardLayout>
      <ManageDeck deck={deck} path={path} />
    </StandardLayout>
  );
};

const Home: NextPage = () => {
  const router = useRouter();
  if (!router.isReady) {
    return null;
  }
  const [id, ...rest] = (router.query.param ?? []) as string[];
  return <HomeComponent id={id} path={rest} />;
};

export default Home;
