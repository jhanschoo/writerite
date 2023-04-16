import { GetStaticProps, NextPage } from 'next';
import { useQuery } from 'urql';
import { initDefaultServerSideUrqlClient } from '@lib/urql/initDefaultServerSideUrqlClient';
import { graphql } from '@generated/gql';

export const healthQueryDocument = graphql(/* GraphQL */`
  query HealthSSG {
    health
  }
`);

export const getStaticProps: GetStaticProps = async () => {
  const [client, getUrqlState] = initDefaultServerSideUrqlClient();

  await client.query(healthQueryDocument, {}).toPromise();

  return {
    props: {
      urqlState: getUrqlState(),
    },
    revalidate: 600,
  };
};

const Ssg: NextPage = () => {
  const [result] = useQuery({
    query: healthQueryDocument,
    variables: {},
  });
  return <p>{JSON.stringify(result.data)}</p>;
};

export default Ssg;
