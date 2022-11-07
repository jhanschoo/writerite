import { RoomUpdatePublishArgs } from '../graphql';

// PubSubPublishArgsByKey is declared here since GraphQL Yoga doesn't export it
export interface PubSubPublishArgsByKey {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: [] | [any] | [number | string, any];
}

export interface PubSubPublishArgs extends PubSubPublishArgsByKey, RoomUpdatePublishArgs {}
