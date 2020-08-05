import gql from "graphql-tag";
import { CARD_DETAIL, DECK_SCALARS, ROOM_SCALARS, CARD_SCALARS } from "../client-models";

export const DECKS_QUERY = gql`
${DECK_SCALARS}
query Decks(
  $cursor: ID
  $take: Int
  $titleFilter: String
  $scope: DecksQueryScope
) {
  decks(
    cursor: $cursor
    take: $take
    titleFilter: $titleFilter
    scope: $scope
  ) {
    ...DeckScalars
  }
}
`;

export const DECK_EDIT_MUTATION = gql`
${DECK_SCALARS}
mutation DeckEdit(
  $id: ID!
  $name: String
  $description: JsonObject
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

export const CARDS_OF_DECK_QUERY = gql`
${CARD_DETAIL}
query CardsOfDeck($deckId: ID!) {
  cardsOfDeck(deckId: $deckId) {
    ...CardDetail
  }
}
`;

export const CARD_CREATE_MUTATION = gql`
${CARD_DETAIL}
mutation CardCreate(
  $deckId: ID!
  $card: CardCreateInput!
  $mainTemplate: Boolean!
) {
  cardCreate(
    deckId: $deckId
    card: $card
    mainTemplate: $mainTemplate
  ) {
    ...CardDetail
  }
}
`;

export const CARD_EDIT_MUTATION = gql`
${CARD_DETAIL}
mutation CardEdit(
  $id: ID!
  $prompt: JsonObject
  $fullAnswer: JsonObject
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

export const CARD_DELETE_MUTATION = gql`
${CARD_SCALARS}
mutation CardDelete($id: ID!) {
  cardDelete(id: $id) {
    ...CardScalars
  }
}
`;

export const ROOM_CREATE_MUTATION = gql`
${ROOM_SCALARS}
mutation RoomCreate(
  $config: RoomConfigInput!
) {
  roomCreate(
    config: $config
  ) {
    ...RoomScalars
  }
}
`;