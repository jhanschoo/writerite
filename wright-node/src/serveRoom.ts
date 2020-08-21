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
const DELAY = 10_000;

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

  cards.forEach(({ id, prompt, fullAnswer, answers, deckId: cardDeckId }) => {
    const wonThisRound: (string | null)[] = [];
    roundHandlers.push(async () => {
      await createChatMsg(ChatMsgContentType.ROUND_START, {
        cardId: id,
        prompt,
      });
      return {
        delay: DELAY,
        messageHandler: async (chatMsg) => {
          if (chatMsg.type === ChatMsgContentType.TEXT && answers.includes((chatMsg.content as string).trim())) {

            await createChatMsg(ChatMsgContentType.ROUND_WIN, {
              userId: chatMsg.senderId,
              cardId: id,
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
        cardId: id,
        prompt,
        fullAnswer,
        answers,
        deckId: cardDeckId,
      });

      return {};
    });
  });

  roundHandlers.reverse();

  let chatMsgHandler = (_message: ChatMsgScalars): void => undefined;
  let chatMsgObservable: ZenObservable.Subscription;
  let unsubscribe = noop;

  try {
    await new Promise((res, rej) => {
      chatMsgObservable = client.subscribe<ChatMsgsOfRoomUpdatesSubscription, ChatMsgsOfRoomUpdatesSubscriptionVariables>({
        query: CHAT_MSGS_OF_ROOM_UPDATES_SUBSCRIPTION,
        variables: { roomId },
      }).subscribe({
        error: (e) => rej(e),
        start: () => {
          unsubscribe = () => {
            chatMsgObservable.unsubscribe();
            setTimeout(unsubscribe, TWO_HOURS_IN_MS);
            unsubscribe = noop;
          };
          res();
        },
        next: ({ data }: FetchResult<ChatMsgsOfRoomUpdatesSubscription>) => {
          const { type, data: chatMsgScalars } = data?.chatMsgsOfRoomUpdates ?? { type: undefined, data: undefined };
          if (type === UpdateType.CREATED && chatMsgScalars) {
            chatMsgHandler(chatMsgScalars);
          }
        },
      });
    });

    roundHandlers.push(() => {
      chatMsgHandler = (message) => {
        roundsService.send(message);
      };
      return Promise.resolve({});
    });

    const roundsService = new RoundsService(roundHandlers);

    await roundsService.done;

  } finally {
    unsubscribe();
    await client.mutate<RoomSetStateMutation, RoomSetStateMutationVariables>({
      mutation: ROOM_SET_STATE_MUTATION,
      variables: {
        id,
        state: RoomState.SERVED,
      },
    });
  }
};
