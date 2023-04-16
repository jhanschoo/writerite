import { NextPage } from 'next';
import { SubscriptionHandler, useQuery, useSubscription } from 'urql';
import { graphql } from '@generated/gql';
import { RepeatHealthClientOnlySubscription } from '@generated/gql/graphql';

export const healthQueryDocument = graphql(/* GraphQL */`
  query HealthClientOnly {
    health
  }
`);

export const repeatHealthSubscriptionDocument = graphql(/* GraphQL */`
  subscription RepeatHealthClientOnly {
    repeatHealth
  }
`);


const handleSubscription: SubscriptionHandler<RepeatHealthClientOnlySubscription, string[]> = (
  prevData,
  response
) => [...(prevData || []), response.repeatHealth];

const ClientOnly: NextPage = () => {
  const [result] = useQuery({
    query: healthQueryDocument,
    variables: {},
  });
  const [res] = useSubscription(
    { query: repeatHealthSubscriptionDocument, variables: {} },
    handleSubscription
  );
  return (
    <div>
      <p>{JSON.stringify(result.data)}</p>
      <p>{JSON.stringify(res.data)}</p>
    </div>
  );
};

export default ClientOnly;
