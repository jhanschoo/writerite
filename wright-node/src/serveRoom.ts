import { client } from "./apolloClient";
import { CARDS_UNDER_DECK_QUERY, ROOM_DETAIL_QUERY } from "./gql/queries";
import { RoomDetailQuery, RoomDetailQueryVariables } from "./gql/gqlTypes/RoomDetailQuery";
import { Ref } from "./types";
import { CardsUnderDeckQuery, CardsUnderDeckQueryVariables } from "./gql/gqlTypes/CardsUnderDeckQuery";
import { CardScalars } from "./client-models/gqlTypes/CardScalars";

// Bug: cancel is not yet implemented
export const serveRoom = async (id: string, cancel: Ref<boolean>): Promise<void> => {
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
};
