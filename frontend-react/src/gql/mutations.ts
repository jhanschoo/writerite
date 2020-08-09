import gql from "graphql-tag";
import { CARD_DETAIL, CARD_SCALARS, DECK_SCALARS, ROOM_SCALARS, USER_DECK_RECORD_SCALARS } from "src/client-models";

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

export const CARD_DELETE_MUTATION = gql`
${CARD_SCALARS}
mutation CardDeleteMutation($id: ID!) {
  cardDelete(id: $id) {
    ...CardScalars
  }
}
`;

export const ROOM_CREATE_MUTATION = gql`
${ROOM_SCALARS}
mutation RoomCreateMutation($ownerConfig: JSONObject) {
  roomCreate(ownerConfig: $ownerConfig) {
    ...RoomScalars
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
