import { NextPage } from 'next';
import { SubscriptionHandler, useQuery, useSubscription } from 'urql';
import {
  HealthQueryDocument,
  RepeatHealthSubscriptionDocument,
  RepeatHealthSubscriptionSubscription,
} from '@generated/graphql';

const handleSubscription: SubscriptionHandler<RepeatHealthSubscriptionSubscription, string[]> = (
  prevData,
  response
) => [...(prevData || []), response.repeatHealth];

const ClientOnly: NextPage = () => {
  const [result] = useQuery({
    query: HealthQueryDocument,
    variables: {},
  });
  const [res] = useSubscription(
    { query: RepeatHealthSubscriptionDocument, variables: {} },
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
