import { WrServer } from '../../../src/graphqlApp';
import { gql, testQuery, testSubscription } from '../misc';
import {
  MessageContentType,
  MessageCreateMutationVariables,
  MessageUpdatesByRoomSlugSubscriptionVariables,
  Scalars,
} from '../../../generated/typescript-operations';

export function mutationMessageCreate(
  server: WrServer,
  content: Scalars['JSON'],
  slug: string,
  type: MessageContentType
) {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  return testQuery<MessageCreateMutationVariables>({
    server,
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
export function subscriptionMessageUpdatesByRoomSlug(server: WrServer, slug: string) {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  return testSubscription<MessageUpdatesByRoomSlugSubscriptionVariables>({
    server,
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
