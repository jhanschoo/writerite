import { PrismaClient } from '@prisma/client';
import { PubSub } from 'graphql-yoga';
import { PubSubPublishArgs } from 'src/types/PubSubPublishArgs';

export class Room {
  static createHostedPerpetualRoom({
    prisma,
    pubsub,
  }: {
    prisma: PrismaClient;
    pubsub: PubSub<PubSubPublishArgs>;
  }) {
    // TODO
  }

  static createGroupPerpetualRoom({
    prisma,
    pubsub,
  }: {
    prisma: PrismaClient;
    pubsub: PubSub<PubSubPublishArgs>;
  }) {
    // TODO
  }

  static createGroupEvanescentRoom({
    prisma,
    pubsub,
  }: {
    prisma: PrismaClient;
    pubsub: PubSub<PubSubPublishArgs>;
  }) {
    // TODO
  }

  static obtainVerifiedExistingRoomWithId({
    roomId,
    prisma,
    pubsub,
  }: {
    roomId: string;
    prisma: PrismaClient;
    pubsub: PubSub<PubSubPublishArgs>;
  }) {
    // TODO
  }
}
