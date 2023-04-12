/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { PrismaClient } from "database";

import { cascadingDelete } from "../_helpers/truncate";
import {
  loginAsNewlyCreatedUser,
  refreshLogin,
} from "../../helpers/graphql/User.util";
import { testContextFactory } from "../../helpers";
import { YogaInitialContext } from "graphql-yoga";
import { Context } from "../../../src/context";
import { createGraphQLApp } from "../../../src/server";
import { mutationRoomCreate } from "../../helpers/graphql/Room.util";
import {
  mutationSendTextMessage,
  subscriptionMessageUpdatesByRoomId,
} from "../../helpers/graphql/Message.util";
import {
  MessageContentType,
  MessageUpdateOperations,
  RoomType,
} from "../../../generated/gql/graphql";
import { CurrentUser } from "../../../src/service/userJWT";
import { buildHTTPExecutor } from "@graphql-tools/executor-http";
import { encodeGlobalID } from "@pothos/plugin-relay";

describe("graphql/Message.ts", () => {
  let setSub: (sub?: CurrentUser) => void;
  let context: (initialContext: YogaInitialContext) => Promise<Context>;
  let stopContext: () => Promise<unknown>;
  let prisma: PrismaClient;
  let executor: ReturnType<typeof buildHTTPExecutor>;

  beforeAll(() => {
    [setSub, context, stopContext, { prisma }] = testContextFactory();
    const server = createGraphQLApp({ context, logging: false });
    // eslint-disable-next-line @typescript-eslint/unbound-method
    executor = buildHTTPExecutor({ fetch: server.fetch });
  });

  afterAll(async () => {
    await cascadingDelete(prisma).user;
    await stopContext();
  });

  afterEach(async () => {
    await cascadingDelete(prisma).user;
  });

  describe("Mutation", () => {
    describe("sendTextMessage", () => {
      it("should allow the owner-occupant of the rome to create a message for the room", async () => {
        expect.assertions(3);
        // create user
        const { currentUser: currentUser1, token } =
          await loginAsNewlyCreatedUser(executor, setSub, "user1");
        const currentUsergid = encodeGlobalID("User", currentUser1.id);
        setSub(currentUser1);

        // create room
        const roomCreateResponse = await mutationRoomCreate(executor);
        expect(roomCreateResponse).toHaveProperty(
          "data.roomCreate",
          expect.objectContaining({
            id: expect.any(String),
            activeRound: null,
            type: RoomType.Ephemeral,
            occupants: expect.arrayContaining([{ id: currentUsergid }]),
          })
        );
        const roomBefore = roomCreateResponse.data?.roomCreate;

        // we have to update our claims before we can create/send messages
        const { currentUser: currentUser2 } = await refreshLogin(
          executor,
          setSub,
          token
        );
        expect(Object.keys(currentUser2.occupyingRoomSlugs)).toHaveLength(1);
        setSub(currentUser2);

        // create message
        const messageCreateResponse = await mutationSendTextMessage(executor, {
          roomId: roomBefore?.id as string,
          textContent: "Hello World",
        });
        expect(messageCreateResponse).toHaveProperty(
          "data.sendTextMessage",
          expect.objectContaining({
            content: { text: "Hello World" },
            createdAt: expect.any(String),
            id: expect.any(String),
            sender: {
              id: currentUsergid,
            },
            type: MessageContentType.Text,
          })
        );
      });
    });
  });

  describe("Query", () => {
    // TODO: implement
  });

  describe("Subscription", () => {
    describe("messageUpdatesByRoomId", () => {
      it("should yield an appropriate integration event when the room it is subscribed to has messageCreate run on it", async () => {
        expect.assertions(4);
        // create user
        const { currentUser: user, token } = await loginAsNewlyCreatedUser(
          executor,
          setSub
        );
        const currentUsergid = encodeGlobalID("User", user.id);

        // create room
        const roomCreateResponse = await mutationRoomCreate(executor);
        expect(roomCreateResponse).toHaveProperty(
          "data.roomCreate",
          expect.objectContaining({
            id: expect.any(String),
            activeRound: null,
            type: RoomType.Ephemeral,
            occupants: expect.arrayContaining([{ id: currentUsergid }]),
          })
        );
        const roomBefore = roomCreateResponse.data?.roomCreate;

        // we have to update our claims before we can create/send messages or establish a subscription
        const { currentUser } = await refreshLogin(executor, setSub, token);
        expect(Object.keys(currentUser.occupyingRoomSlugs)).toHaveLength(1);

        // create subscription on room
        const roomMessageUpdates = await subscriptionMessageUpdatesByRoomId(
          executor,
          {
            id: roomBefore?.id as string,
          }
        );
        const roomMessageUpdatesIterator =
          roomMessageUpdates[Symbol.asyncIterator]();

        // assert subscription result for message creation
        const readResultOneP = roomMessageUpdatesIterator.next();
        // create message
        const messageCreateResponse = await mutationSendTextMessage(executor, {
          roomId: roomBefore?.id as string,
          textContent: "Hello World",
        });
        expect(messageCreateResponse).toHaveProperty(
          "data.sendTextMessage",
          expect.objectContaining({
            content: { text: "Hello World" },
            createdAt: expect.any(String),
            id: expect.any(String),
            sender: {
              id: currentUsergid,
            },
            type: MessageContentType.Text,
          })
        );

        const readResultOne = await readResultOneP;
        if (!readResultOne.done) {
          expect(readResultOne.value).toHaveProperty(
            "data.messageUpdatesByRoomId",
            expect.objectContaining({
              operation: MessageUpdateOperations.MessageCreate,
              value: {
                content: { text: "Hello World" },
                createdAt: expect.any(String),
                id: expect.any(String),
                sender: {
                  id: currentUsergid,
                },
                type: MessageContentType.Text,
              },
            })
          );
        }
        await roomMessageUpdatesIterator.return?.();
      });
    });
  });
});
