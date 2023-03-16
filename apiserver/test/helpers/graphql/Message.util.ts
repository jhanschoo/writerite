import { WrServer } from '../../../src/graphqlApp';
import { gql, testQuery, testSubscription } from '../misc';
import {
  MessageContentType,
  MessageCreateMutationVariables,
  MessageUpdatesByRoomSlugSubscriptionVariables,
  Scalars,
} from '../../../generated/typescript-operations';
import { buildHTTPExecutor } from '@graphql-tools/executor-http';

export function mutationMessageCreate(
  executor: ReturnType<typeof buildHTTPExecutor>,
  content: Scalars['JSON'],
  slug: string,
  type: MessageContentType
) {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  return testQuery<MessageCreateMutationVariables>({
    executor,
    document: gql`
      mutation MessageCreate($content: JSON, $slug: String!, $type: MessageContentType!) {
        messageCreate(content: $content, slug: $slug, type: $type) {
          content
          createdAt
          id
          roomId
          senderId
          type
        }
      }
    `,
    variables: {
      content,
      slug,
      type,
    },
  });
}
// SubscriptionMessageUpdatesByRoomSlugArgs
export function subscriptionMessageUpdatesByRoomSlug(executor: ReturnType<typeof buildHTTPExecutor>, slug: string) {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  return testSubscription<MessageUpdatesByRoomSlugSubscriptionVariables>({
    executor,
    document: gql`
      subscription MessageUpdatesByRoomSlug($slug: String!) {
        messageUpdatesByRoomSlug(slug: $slug) {
          operation
          value {
            content
            createdAt
            id
            roomId
            senderId
            type
          }
        }
      }
    `,
    variables: { slug },
  });
}
