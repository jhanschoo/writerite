import gql from "graphql-tag";
import { CARD_DETAIL, CARD_SCALARS, CHAT_MSG_SCALARS, DECK_SCALARS, ROOM_DETAIL, ROOM_SCALARS, USER_DECK_RECORD_SCALARS } from "src/client-models";
import { CardCreateMutation, CardDeleteMutation, CardEditMutation, CardsOfDeckQuery, CardsOfDeckQueryVariables, DeckCreateMutation, DecksQuery, DecksQueryScope, DecksQueryVariables, RoomCreateMutation, RoomQuery, RoomQueryVariables } from "src/gqlTypes";
import { MutationUpdaterFn } from "@apollo/client";
import { CARDS_OF_DECK_QUERY, DECKS_QUERY, ROOM_QUERY } from "src/gql";

export const SIGNIN_MUTATION = gql`
mutation SigninMutation(
  $email: String! $name: String $token: String! $authorizer: String! $identifier: String!
  ) {
  signin(
    email: $email
    name: $name
    token: $token
    authorizer: $authorizer
    identifier: $identifier
    persist: false
  ) {
    token
  }
}
`;

export const DECK_CREATE_MUTATION = gql`
${DECK_SCALARS}
mutation DeckCreateMutation(
  $name: String
  $description: JSONObject
  $promptLang: String
  $answerLang: String
  $published: Boolean
  $cards: [CardCreateInput!]
) {
  deckCreate(
    name: $name
    description: $description
    promptLang: $promptLang
    answerLang: $answerLang
    published: $published
    cards: $cards
  ) {
    ...DeckScalars
  }
}
`;

export const deckCreateMutationUpdate: MutationUpdaterFn<DeckCreateMutation> = (cache, { data }) => {
  const newDeck = data?.deckCreate;
  if (newDeck) {
    // update Decks query
    try {
      const decksQuery = { query: DECKS_QUERY, variables: { scope: DecksQueryScope.OWNED, titleFilter: "" } };
      const decksData = cache.readQuery<DecksQuery, DecksQueryVariables>(decksQuery);
      const newDecksData: DecksQuery = {
        ...decksData ?? {},
        decks: [newDeck, ...decksData?.decks ?? []],
      };
      cache.writeQuery<DecksQuery, DecksQueryVariables>({
        ...decksQuery,
        data: newDecksData,
      });
    } catch (e) {
      // no-op
    }
  }
};

export const DECK_EDIT_MUTATION = gql`
${DECK_SCALARS}
mutation DeckEditMutation(
  $id: ID!
  $name: String
  $description: JSONObject
  $promptLang: String
  $answerLang: String
  $published: Boolean
) {
  deckEdit(
    id: $id
    name: $name
    description: $description
    promptLang: $promptLang
    answerLang: $answerLang
    published: $published
  ) {
    ...DeckScalars
  }
}
`;

export const CARD_CREATE_MUTATION = gql`
${CARD_DETAIL}
mutation CardCreateMutation(
  $deckId: ID!
  $card: CardCreateInput!
  $mainTemplate: Boolean!
) {
  cardCreate(deckId: $deckId, card: $card, mainTemplate: $mainTemplate) {
    ...CardDetail
  }
}
`;

export const cardCreateMutationUpdate: MutationUpdaterFn<CardCreateMutation> = (cache, { data }) => {
  const newCard = data?.cardCreate;
  if (newCard) {
    // update CardsOfDeck query of the same deckId
    try {
      const cardsOfDeckQuery = {
        query: CARDS_OF_DECK_QUERY,
        variables: { deckId: newCard.deckId },
      };
      const cardsOfDeckData = cache.readQuery<CardsOfDeckQuery, CardsOfDeckQueryVariables>(cardsOfDeckQuery);
      const oldCardsOfDeck = newCard.mainTemplate
        ? cardsOfDeckData?.cardsOfDeck?.map((card) => card && { ...card, mainTemplate: card.id === newCard.id })
        : cardsOfDeckData?.cardsOfDeck;
      const newCardsOfDeckData: CardsOfDeckQuery = {
        ...cardsOfDeckData ?? {},
        cardsOfDeck: [newCard, ...oldCardsOfDeck ?? []],
      };
      cache.writeQuery<CardsOfDeckQuery, CardsOfDeckQueryVariables>({
        ...cardsOfDeckQuery,
        data: newCardsOfDeckData,
      });
    } catch (_e) {
      // noop
    }
  }
};

export const CARD_EDIT_MUTATION = gql`
${CARD_DETAIL}
mutation CardEditMutation(
  $id: ID!
  $prompt: JSONObject
  $fullAnswer: JSONObject
  $answers: [String!]
  $sortKey: String
  $template: Boolean
  $mainTemplate: Boolean
) {
  cardEdit(
    id: $id
    prompt: $prompt
    fullAnswer: $fullAnswer
    answers: $answers
    sortKey: $sortKey
    template: $template
    mainTemplate: $mainTemplate
  ) {
    ...CardDetail
  }
}
`;

export const cardEditMutationUpdate: MutationUpdaterFn<CardEditMutation> = (cache, { data }) => {
  const newCard = data?.cardEdit;
  if (newCard?.mainTemplate) {
    // update CardsOfDeck query of the same deckId
    try {
      const cardsOfDeckQuery = {
        query: CARDS_OF_DECK_QUERY,
        variables: { deckId: newCard.deckId },
      };
      const cardsOfDeckData = cache.readQuery<CardsOfDeckQuery, CardsOfDeckQueryVariables>(cardsOfDeckQuery);
      const newCardsOfDeckData: CardsOfDeckQuery = {
        ...cardsOfDeckData ?? {},
        cardsOfDeck: (cardsOfDeckData?.cardsOfDeck ?? []).map((card) => card && { ...card, mainTemplate: card.id !== newCard.id }),
      };
      cache.writeQuery<CardsOfDeckQuery, CardsOfDeckQueryVariables>({
        ...cardsOfDeckQuery,
        data: newCardsOfDeckData,
      });
    } catch (_e) {
      // noop
    }
  }
};

export const CARD_DELETE_MUTATION = gql`
${CARD_SCALARS}
mutation CardDeleteMutation($id: ID!) {
  cardDelete(id: $id) {
    ...CardScalars
  }
}
`;

export const cardDeleteMutationUpdate: MutationUpdaterFn<CardDeleteMutation> = (cache, { data }) => {
  const deletedCard = data?.cardDelete;
  if (deletedCard) {
    // update CardsOfDeck query of the same deckId
    try {
      const cardsOfDeckQuery = {
        query: CARDS_OF_DECK_QUERY,
        variables: { deckId: deletedCard.deckId },
      };
      const cardsOfDeckData = cache.readQuery<CardsOfDeckQuery, CardsOfDeckQueryVariables>(cardsOfDeckQuery);
      if (!cardsOfDeckData?.cardsOfDeck) {
        return;
      }
      const newCardsOfDeckData: CardsOfDeckQuery = {
        ...cardsOfDeckData,
        // eslint-disable-next-line no-shadow
        cardsOfDeck: cardsOfDeckData.cardsOfDeck.filter((card) => card?.id !== deletedCard.id),
      };
      cache.writeQuery<CardsOfDeckQuery, CardsOfDeckQueryVariables>({
        ...cardsOfDeckQuery,
        data: newCardsOfDeckData,
      });
    } catch (_e) {
      // noop
    }
  }
};

export const ROOM_CREATE_MUTATION = gql`
${ROOM_SCALARS}
mutation RoomCreateMutation($ownerConfig: JSONObject) {
  roomCreate(ownerConfig: $ownerConfig) {
    ...RoomScalars
  }
}
`;

export const roomCreateMutationUpdate: MutationUpdaterFn<RoomCreateMutation> = (cache, { data }) => {
  const newRoom = data?.roomCreate;
  if (newRoom) {
    cache.writeQuery<RoomQuery, RoomQueryVariables>({
      query: ROOM_QUERY,
      variables: { id: newRoom.id },
      data: {
        room: newRoom,
      },
    });
  }
};

export const ROOM_EDIT_OWNER_CONFIG_MUTATION = gql`
${ROOM_SCALARS}
mutation RoomEditOwnerConfigMutation($id: ID!, $ownerConfig: JSONObject!) {
  roomEditOwnerConfig(id: $id, ownerConfig: $ownerConfig) {
    ...RoomScalars
  }
}
`;

export const ROOM_ADD_OCCUPANT_BY_EMAIL_MUTATION = gql`
${ROOM_DETAIL}
mutation RoomAddOccupantByEmailMutation($id: ID!, $email: String!) {
  roomAddOccupantByEmail(id: $id, email: $email) {
    ...RoomDetail
  }
}
`;

export const CHAT_MSG_CREATE_MUTATION = gql`
${CHAT_MSG_SCALARS}
mutation ChatMsgCreateMutation(
  $roomId: ID!
  $type: ChatMsgContentType!
  $content: String!
) {
  chatMsgCreate(content: $content, roomId: $roomId, type: $type) {
    ...ChatMsgScalars
  }
}
`;

export const OWN_DECK_RECORD_SET_MUTATION = gql`
${USER_DECK_RECORD_SCALARS}
mutation OwnDeckRecordSetMutation(
  $deckId: ID!
  $notes: JSONObject
) {
  ownDeckRecordSet(
    deckId: $deckId
    notes: $notes
  ) {
    ...UserDeckRecordScalars
  }
}
`;

export const DECK_ADD_SUBDECK_MUTATION = gql`
${DECK_SCALARS}
mutation DeckAddSubdeckMutation($id: ID! $subdeckId: ID!) {
  deckAddSubdeck(id: $id, subdeckId: $subdeckId) {
    ...DeckScalars
    subdecks {
      ...DeckScalars
    }
  }
}
`;

export const DECK_REMOVE_SUBDECK_MUTATION = gql`
${DECK_SCALARS}
mutation DeckRemoveSubdeckMutation($id: ID! $subdeckId: ID!) {
  deckRemoveSubdeck(id: $id, subdeckId: $subdeckId) {
    ...DeckScalars
    subdecks {
      ...DeckScalars
    }
  }
}
`;
