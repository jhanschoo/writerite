import { FetchResult } from "@apollo/client";
import { client } from "./apolloClient";
import { CardScalars } from "./client-models/gqlTypes/CardScalars";
import { ChatMsgScalars } from "./client-models/gqlTypes/ChatMsgScalars";
import { CARDS_UNDER_DECK_QUERY, ROOM_DETAIL_QUERY } from "./gql/queries";
import { CHAT_MSG_CREATE_MUTATION, ROOM_SET_STATE_MUTATION } from "./gql/mutations";
import { CHAT_MSGS_OF_ROOM_UPDATES_SUBSCRIPTION } from "./gql/subscription";
import { RoomDetailQuery, RoomDetailQueryVariables } from "./gql/gqlTypes/RoomDetailQuery";
import { CardsUnderDeckQuery, CardsUnderDeckQueryVariables } from "./gql/gqlTypes/CardsUnderDeckQuery";
import { RoomSetStateMutation, RoomSetStateMutationVariables } from "./gql/gqlTypes/RoomSetStateMutation";
import { ChatMsgCreateMutation, ChatMsgCreateMutationVariables } from "./gql/gqlTypes/ChatMsgCreateMutation";
import { ChatMsgsOfRoomUpdatesSubscription, ChatMsgsOfRoomUpdatesSubscriptionVariables } from "./gql/gqlTypes/ChatMsgsOfRoomUpdatesSubscription";

import { ChatMsgContentType, RoomState, UpdateType } from "./gqlGlobalTypes";
import { Ref } from "./types";
import { noop, shuffle } from "./util";
import { RoundHandler, RoundsService } from "./RoundsService";

// TODO: replace with user-set delay
const DELAY = 1000 * 30;

const TWO_HOURS_IN_MS = 1000 * 60 * 60 * 2;

const createChatMsgFactory = (roomId: string) =>
  (type: ChatMsgContentType, content: GraphQLJSON) =>
    client.mutate<ChatMsgCreateMutation, ChatMsgCreateMutationVariables>({
      mutation: CHAT_MSG_CREATE_MUTATION,
      variables: {
        roomId,
        type,
        content,
      },
    });

// Bug: cancel is not yet implemented
export const serveRoom = async (id: string, cancel: Ref<boolean>): Promise<void> => {
  const createChatMsg = createChatMsgFactory(id);

  // Obtain required data
  const { data: roomData } = await client
    .query<RoomDetailQuery, RoomDetailQueryVariables>({
    query: ROOM_DETAIL_QUERY,
    variables: { id },
  });
  if (cancel[0] || !roomData?.room?.ownerConfig) {
    return;
  }
  const { room } = roomData;
  const { id: roomId, ownerConfig } = room;
  const { deckId } = ownerConfig;
  if (typeof deckId !== "string") {
    return;
  }

  const { data: cardsData } = await client
    .query<CardsUnderDeckQuery, CardsUnderDeckQueryVariables>({
    query: CARDS_UNDER_DECK_QUERY,
    variables: { deckId },
  });
  if (!cardsData?.cardsUnderDeck) {
    return;
  }
  const cards = cardsData.cardsUnderDeck
    .filter((card): card is CardScalars => Boolean(card));
  shuffle(cards);

  // State change
  const { data: roomSetStateData } = await client
    .mutate<RoomSetStateMutation, RoomSetStateMutationVariables>({
    mutation: ROOM_SET_STATE_MUTATION,
    variables: {
      id,
      state: RoomState.SERVING,
    },
  });
  if (!roomSetStateData) {
    return;
  }

  const roundHandlers: RoundHandler<ChatMsgScalars>[] = [];

  // eslint-disable-next-line no-shadow
  cards.forEach(({ id: cardId, prompt, fullAnswer, answers, deckId: cardDeckId }) => {
    const wonThisRound: (string | null)[] = [];
    roundHandlers.push(async () => {
      await createChatMsg(ChatMsgContentType.ROUND_START, {
        cardId,
        prompt,
      });
      return {
        delay: DELAY,
        messageHandler: async (chatMsg) => {
          if (chatMsg.type === ChatMsgContentType.TEXT && answers.includes((chatMsg.content as string).trim())) {

            await createChatMsg(ChatMsgContentType.ROUND_WIN, {
              userId: chatMsg.senderId,
              cardId,
            });
            wonThisRound.push(chatMsg.senderId);
          }
          return {
            delay: null,
          };
        },
      };
    });

    roundHandlers.push(async () => {
      await createChatMsg(ChatMsgContentType.ROUND_SCORE, {
        userIds: wonThisRound,
        cardId,
        prompt,
        fullAnswer,
        answers,
        deckId: cardDeckId,
      });

      return {};
    });
  });

  roundHandlers.reverse();

  let unsubscribe = noop;

  /*
   * Note: race condition: we assume subscriptions are set up before rounds begin.
   * TODO: send dummy message and await to verify that subscriptions are set up.
   */
  const chatMsgObservable = client.subscribe<ChatMsgsOfRoomUpdatesSubscription, ChatMsgsOfRoomUpdatesSubscriptionVariables>({
    query: CHAT_MSGS_OF_ROOM_UPDATES_SUBSCRIPTION,
    variables: { roomId },
  }).subscribe({
    error: (e) => {
      throw e;
    },
    next: ({ data }: FetchResult<ChatMsgsOfRoomUpdatesSubscription>) => {
      const { type, data: chatMsgScalars } = data?.chatMsgsOfRoomUpdates ?? { type: undefined, data: undefined };
      if (type === UpdateType.CREATED && chatMsgScalars) {
        chatMsgHandler(chatMsgScalars);
      }
    },
  });
  setTimeout(unsubscribe, TWO_HOURS_IN_MS);
  unsubscribe = () => {
    chatMsgObservable.unsubscribe();
    unsubscribe = noop;
  };

  roundHandlers.push(() => Promise.resolve({ delay: 0 }));

  const roundsService = new RoundsService(roundHandlers);
  const chatMsgHandler = roundsService.send.bind(roundsService);

  await roundsService.done;

  unsubscribe();
  await client.mutate<RoomSetStateMutation, RoomSetStateMutationVariables>({
    mutation: ROOM_SET_STATE_MUTATION,
    variables: {
      id,
      state: RoomState.SERVED,
    },
  });
};
