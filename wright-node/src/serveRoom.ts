import { client } from "./apolloClient";
import { CARDS_UNDER_DECK_QUERY, ROOM_DETAIL_QUERY, CHAT_MSG_CREATE_MUTATION } from "./gql/queries";
import { ROOM_SET_STATE_MUTATION } from "./gql/mutations";
import { RoomDetailQuery, RoomDetailQueryVariables } from "./gql/gqlTypes/RoomDetailQuery";
import { Ref } from "./types";
import { CardsUnderDeckQuery, CardsUnderDeckQueryVariables } from "./gql/gqlTypes/CardsUnderDeckQuery";
import { CardScalars } from "./client-models/gqlTypes/CardScalars";
import { RoomState, ChatMsgContentType } from "./gqlGlobalTypes";
import { RoomSetStateMutation, RoomSetStateMutationVariables } from "./gql/gqlTypes/RoomSetStateMutation";
import { ChatMsgCreateMutation, ChatMsgCreateMutationVariables } from "./gql/gqlTypes/ChatMsgCreateMutation";

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
  const { ownerConfig } = room;
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
};
