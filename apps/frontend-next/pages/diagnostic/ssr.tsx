import { GetServerSideProps, NextPage } from "next";
import { useQuery } from "urql";
import { initDefaultServerSideUrqlClient } from "@lib/urql/initDefaultServerSideUrqlClient";
import { graphql } from "@generated/gql";

export const healthQueryDocument = graphql(/* GraphQL */ `
  query HealthSSR {
    health
  }
`);

export const getServerSideProps: GetServerSideProps = async () => {
  const [client, getUrqlState] = initDefaultServerSideUrqlClient();

  await client.query(healthQueryDocument, {}).toPromise();

  return {
    props: {
      urqlState: getUrqlState(),
    },
  };
};

const Ssr: NextPage = () => {
  const [result] = useQuery({
    query: healthQueryDocument,
    variables: {},
  });
  return <p>{JSON.stringify(result.data)}</p>;
};

export default Ssr;
