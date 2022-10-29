import { GetStaticProps, NextPage } from 'next';
import { useQuery } from 'urql';
import { initDefaultServerSideUrqlClient } from '@lib/urql/initDefaultServerSideUrqlClient';
import { HealthQueryDocument } from '@generated/graphql';

export const getStaticProps: GetStaticProps = async () => {
  const [client, getUrqlState] = initDefaultServerSideUrqlClient();

  await client.query(HealthQueryDocument, {}).toPromise();

  return {
    props: {
      urqlState: getUrqlState(),
    },
    revalidate: 600,
  };
};

const Ssg: NextPage = () => {
  const [result] = useQuery({
    query: HealthQueryDocument,
    variables: {},
  });
  return <p>{JSON.stringify(result.data)}</p>;
};

export default Ssg;
