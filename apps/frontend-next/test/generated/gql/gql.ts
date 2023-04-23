/* eslint-disable */

import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';

import * as types from './graphql';

/**
 * Map of all GraphQL operations in the project.
 *
 * This map has several performance disadvantages:
 * 1. It is not tree-shakeable, so it will include all operations in the project.
 * 2. It is not minifiable, so the string of a GraphQL query will be multiple times inside the bundle.
 * 3. It does not support dead code elimination, so it will add unused operations.
 *
 * Therefore it is highly recommended to use the babel or swc plugin for production.
 */
const documents = {
  '\n  mutation FinalizeOauthSignin($input: FinalizeOauthSigninMutationInput!) {\n    finalizeOauthSignin(input: $input) {\n      currentUser\n      token\n    }\n  }\n':
    types.FinalizeOauthSigninDocument,
  '\n  query DeckQuery($id: ID!, $after: ID, $first: Int, $before: ID, $last: Int) {\n    deck(id: $id) {\n      id\n      ...ManageDeck\n    }\n  }\n':
    types.DeckQueryDocument,
  '\n  query UserQuery {\n    me {\n      id\n      ...PersonalProfile\n    }\n  }\n':
    types.UserQueryDocument,
  '\n  query HealthClientOnly {\n    health\n  }\n':
    types.HealthClientOnlyDocument,
  '\n  subscription RepeatHealthClientOnly {\n    repeatHealth\n  }\n':
    types.RepeatHealthClientOnlyDocument,
  '\n  query HealthSSG {\n    health\n  }\n': types.HealthSsgDocument,
  '\n  query HealthSSR {\n    health\n  }\n': types.HealthSsrDocument,
  '\n  fragment DeckCompactSummaryContent on Deck {\n    name\n    subdecksCount\n    cardsDirectCount\n  }\n':
    types.DeckCompactSummaryContentFragmentDoc,
  '\n  fragment DeckSummaryContent on Deck {\n    id\n    name\n    subdecksCount\n    cardsDirectCount\n    editedAt\n  }\n':
    types.DeckSummaryContentFragmentDoc,
  '\n  fragment UserProfile on User {\n    id\n    bareId\n    bio\n    name\n  }\n':
    types.UserProfileFragmentDoc,
  '\n  fragment RoomNotificationsRoomItem on Room {\n    id\n    occupants {\n      id\n      bareId\n      name\n    }\n    activeRound {\n      id\n      slug\n      deck {\n        id\n        name\n      }\n    }\n  }\n':
    types.RoomNotificationsRoomItemFragmentDoc,
  '\n  query RoomNotifications {\n    occupyingUnarchivedRooms {\n      ...RoomNotificationsRoomItem\n    }\n  }\n':
    types.RoomNotificationsDocument,
  '\n  mutation UserDecksSummaryNewDeckItemMutation(\n    $input: DeckCreateMutationInput!\n  ) {\n    deckCreate(input: $input) {\n      id\n    }\n  }\n':
    types.UserDecksSummaryNewDeckItemMutationDocument,
  '\n  fragment UserDecksSummaryDeckItem on Deck {\n    id\n    editedAt\n    ...DeckCompactSummaryContent\n  }\n':
    types.UserDecksSummaryDeckItemFragmentDoc,
  '\n  query UserDecksSummaryQuery(\n    $after: ID\n    $before: ID\n    $first: Int\n    $last: Int\n    $input: DecksQueryInput!\n  ) {\n    decks(\n      after: $after\n      before: $before\n      first: $first\n      last: $last\n      input: $input\n    ) {\n      edges {\n        cursor\n        node {\n          ...UserDecksSummaryDeckItem\n        }\n      }\n      pageInfo {\n        endCursor\n        hasNextPage\n        hasPreviousPage\n        startCursor\n      }\n    }\n  }\n':
    types.UserDecksSummaryQueryDocument,
  '\n  mutation ManageCardAddNewCardMutation(\n    $deckId: ID!\n    $cards: [CardCreateMutationInput!]!\n  ) {\n    deckAddCards(deckId: $deckId, cards: $cards) {\n      id\n    }\n  }\n':
    types.ManageCardAddNewCardMutationDocument,
  '\n  fragment ManageCard on Card {\n    answers\n    fullAnswer\n    id\n    isPrimaryTemplate\n    isTemplate\n    prompt\n  }\n':
    types.ManageCardFragmentDoc,
  '\n  mutation ManageCardEditCardMutation($input: CardEditMutationInput!) {\n    cardEdit(input: $input) {\n      ...ManageCard\n    }\n  }\n':
    types.ManageCardEditCardMutationDocument,
  '\n  mutation ManageCardDeleteCardMutation($id: ID!) {\n    cardDelete(id: $id) {\n      id\n    }\n  }\n':
    types.ManageCardDeleteCardMutationDocument,
  '\n  fragment ManageDeck on Deck {\n    id\n    ...ManageDeckFrontMatter\n    ...ManageDeckAdditionalInfo\n    ...ManageDeckContent\n  }\n':
    types.ManageDeckFragmentDoc,
  '\n  fragment ManageDeckAdditionalInfo on Deck {\n    editedAt\n  }\n':
    types.ManageDeckAdditionalInfoFragmentDoc,
  '\n  fragment ManageDeckContent on Deck {\n    id\n    editedAt\n    cardsDirectCount\n    subdecksCount\n    ...ManageDeckCardsUploadReview\n    ...ManageDeckSubdecks\n    ...ManageDeckCards\n  }\n':
    types.ManageDeckContentFragmentDoc,
  '\n  mutation ManageDeckFrontMatterEdit($input: DeckEditMutationInput!) {\n    deckEdit(input: $input) {\n      answerLang\n      description\n      id\n      name\n      promptLang\n    }\n  }\n':
    types.ManageDeckFrontMatterEditDocument,
  '\n  fragment ManageDeckFrontMatter on Deck {\n    id\n    name\n    description\n  }\n':
    types.ManageDeckFrontMatterFragmentDoc,
  '\n  fragment ManageDeckCards on Deck {\n    id\n    cardsDirect(after: $after, before: $before, first: $first, last: $last) {\n      edges {\n        cursor\n        node {\n          id\n          ...ManageCard\n        }\n      }\n      pageInfo {\n        hasNextPage\n        hasPreviousPage\n        startCursor\n        endCursor\n      }\n    }\n    cardsDirectCount\n  }\n':
    types.ManageDeckCardsFragmentDoc,
  '\n  fragment ManageDeckCardsUploadReview on Deck {\n    id\n    cardsDirectCount\n    name\n  }\n':
    types.ManageDeckCardsUploadReviewFragmentDoc,
  '\n  mutation ManageDeckCardsAddCards(\n    $deckId: ID!\n    $cards: [CardCreateMutationInput!]!\n  ) {\n    deckAddCards(deckId: $deckId, cards: $cards) {\n      id\n    }\n  }\n':
    types.ManageDeckCardsAddCardsDocument,
  '\n  fragment SubdeckListItemContent on Deck {\n    ...DeckCompactSummaryContent\n    id\n  }\n':
    types.SubdeckListItemContentFragmentDoc,
  '\n  query ManageDeckSubdecksLinkSubdeckQuery(\n    $after: ID\n    $before: ID\n    $first: Int\n    $last: Int\n    $input: DecksQueryInput!\n  ) {\n    decks(\n      after: $after\n      before: $before\n      first: $first\n      last: $last\n      input: $input\n    ) {\n      edges {\n        cursor\n        node {\n          ...SubdeckListItemContent\n          id\n        }\n      }\n      pageInfo {\n        endCursor\n        hasNextPage\n        hasPreviousPage\n        startCursor\n      }\n    }\n  }\n':
    types.ManageDeckSubdecksLinkSubdeckQueryDocument,
  '\n  mutation ManageDeckSubdecksLinkSubdeckAddSubdeck(\n    $deckId: ID!\n    $subdeckId: ID!\n  ) {\n    deckAddSubdeck(deckId: $deckId, subdeckId: $subdeckId) {\n      id\n    }\n  }\n':
    types.ManageDeckSubdecksLinkSubdeckAddSubdeckDocument,
  '\n    mutation ManageDeckSubdecksLinkSubdeckCreateSubdeck(\n      $input: DeckCreateMutationInput!\n    ) {\n      deckCreate(input: $input) {\n        id\n      }\n    }\n  ':
    types.ManageDeckSubdecksLinkSubdeckCreateSubdeckDocument,
  '\n  mutation ManageDeckSubdecksBrowseRemoveSubdeck(\n    $deckId: ID!\n    $subdeckId: ID!\n  ) {\n    deckRemoveSubdeck(deckId: $deckId, subdeckId: $subdeckId) {\n      id\n    }\n  }\n':
    types.ManageDeckSubdecksBrowseRemoveSubdeckDocument,
  '\n  fragment ManageDeckSubdecks on Deck {\n    id\n    subdecks {\n      id\n      ...SubdeckListItemContent\n    }\n  }\n':
    types.ManageDeckSubdecksFragmentDoc,
  '\n  mutation ManageDecksNewDeckItemMutation($input: DeckCreateMutationInput!) {\n    deckCreate(input: $input) {\n      id\n    }\n  }\n':
    types.ManageDecksNewDeckItemMutationDocument,
  '\n  query RecentDecksQuery(\n    $after: ID\n    $before: ID\n    $first: Int\n    $last: Int\n    $input: DecksQueryInput!\n  ) {\n    decks(\n      after: $after\n      before: $before\n      first: $first\n      last: $last\n      input: $input\n    ) {\n      edges {\n        cursor\n        node {\n          id\n          ...DeckCompactSummaryContent\n        }\n      }\n      pageInfo {\n        endCursor\n        hasNextPage\n        hasPreviousPage\n        startCursor\n      }\n    }\n  }\n':
    types.RecentDecksQueryDocument,
  '\n  query SearchDecks(\n    $after: ID\n    $before: ID\n    $first: Int\n    $last: Int\n    $input: DecksQueryInput!\n  ) {\n    decks(\n      after: $after\n      before: $before\n      first: $first\n      last: $last\n      input: $input\n    ) {\n      edges {\n        cursor\n        node {\n          id\n          name\n          ...DeckSummaryContent\n        }\n      }\n      pageInfo {\n        endCursor\n        hasNextPage\n        hasPreviousPage\n        startCursor\n      }\n    }\n  }\n':
    types.SearchDecksDocument,
  '\n  mutation ManageFriendsBefriendMutation($befriendedId: ID!) {\n    befriend(befriendedId: $befriendedId) {\n      id\n    }\n  }\n':
    types.ManageFriendsBefriendMutationDocument,
  '\n  query FriendsMutualsListQuery {\n    friends {\n      edges {\n        cursor\n        node {\n          ...UserProfile\n        }\n      }\n    }\n  }\n':
    types.FriendsMutualsListQueryDocument,
  '\n  fragment PersonalProfile on User {\n    id\n    bareId\n    bio\n    name\n  }\n':
    types.PersonalProfileFragmentDoc,
  '\n  mutation PersonalProfileEdit($input: OwnProfileEditMutationInput!) {\n    ownProfileEdit(input: $input) {\n      ...PersonalProfile\n    }\n  }\n':
    types.PersonalProfileEditDocument,
  '\n  query ManageRoomQuery($id: ID!) {\n    room(id: $id) {\n      id\n      ...ManageRoomContextual\n    }\n  }\n':
    types.ManageRoomQueryDocument,
  '\n  fragment ManageRoomContextual on Room {\n    id\n    activeRound {\n      deck {\n        id\n        name\n      }\n      id\n      slug\n      state\n    }\n  }\n':
    types.ManageRoomContextualFragmentDoc,
  '\n  fragment ManageRoomMessages on Message {\n    content\n    createdAt\n    id\n    sender {\n      id\n      name\n    }\n    type\n  }\n':
    types.ManageRoomMessagesFragmentDoc,
  '\n  subscription ManageRoomMessagesSubscription($id: ID!) {\n    messageUpdatesByRoomId(id: $id) {\n      operation\n      value {\n        ...ManageRoomMessages\n      }\n    }\n  }\n':
    types.ManageRoomMessagesSubscriptionDocument,
  '\n  mutation ManageRoomPrimaryInputMutation($roomId: ID!, $textContent: String!) {\n    sendTextMessage(roomId: $roomId, textContent: $textContent) {\n      id\n    }\n  }\n':
    types.ManageRoomPrimaryInputMutationDocument,
  '\n  mutation ManageRoomRoomSetDeck($deckId: ID!, $id: ID!) {\n    roomSetDeck(deckId: $deckId, id: $id) {\n      id\n      activeRound {\n        id\n        deck {\n          id\n          name\n        }\n        slug\n      }\n    }\n  }\n':
    types.ManageRoomRoomSetDeckDocument,
  '\n  mutation InitializeOauthSigninMutation {\n    initializeOauthSignin\n  }\n':
    types.InitializeOauthSigninMutationDocument,
  '\n  mutation RefreshMutation($token: JWT!) {\n    refresh(token: $token) {\n      currentUser\n      token\n    }\n  }\n':
    types.RefreshMutationDocument,
  '\n  query UseQueryDecks(\n    $after: ID\n    $before: ID\n    $first: Int\n    $last: Int\n    $input: DecksQueryInput!\n  ) {\n    decks(\n      after: $after\n      before: $before\n      first: $first\n      last: $last\n      input: $input\n    ) {\n      edges {\n        cursor\n        node {\n          id\n        }\n      }\n      pageInfo {\n        endCursor\n        hasNextPage\n        hasPreviousPage\n        startCursor\n      }\n    }\n  }\n':
    types.UseQueryDecksDocument,
  '\n  mutation AuthRefreshMutation($token: JWT!) {\n    refresh(token: $token) {\n      currentUser\n      token\n    }\n  }\n':
    types.AuthRefreshMutationDocument,
};

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 *
 *
 * @example
 * ```ts
 * const query = graphql(`query GetUser($id: ID!) { user(id: $id) { name } }`);
 * ```
 *
 * The query argument is unknown!
 * Please regenerate the types.
 */
export function graphql(source: string): unknown;

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n  mutation FinalizeOauthSignin($input: FinalizeOauthSigninMutationInput!) {\n    finalizeOauthSignin(input: $input) {\n      currentUser\n      token\n    }\n  }\n'
): (typeof documents)['\n  mutation FinalizeOauthSignin($input: FinalizeOauthSigninMutationInput!) {\n    finalizeOauthSignin(input: $input) {\n      currentUser\n      token\n    }\n  }\n'];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n  query DeckQuery($id: ID!, $after: ID, $first: Int, $before: ID, $last: Int) {\n    deck(id: $id) {\n      id\n      ...ManageDeck\n    }\n  }\n'
): (typeof documents)['\n  query DeckQuery($id: ID!, $after: ID, $first: Int, $before: ID, $last: Int) {\n    deck(id: $id) {\n      id\n      ...ManageDeck\n    }\n  }\n'];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n  query UserQuery {\n    me {\n      id\n      ...PersonalProfile\n    }\n  }\n'
): (typeof documents)['\n  query UserQuery {\n    me {\n      id\n      ...PersonalProfile\n    }\n  }\n'];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n  query HealthClientOnly {\n    health\n  }\n'
): (typeof documents)['\n  query HealthClientOnly {\n    health\n  }\n'];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n  subscription RepeatHealthClientOnly {\n    repeatHealth\n  }\n'
): (typeof documents)['\n  subscription RepeatHealthClientOnly {\n    repeatHealth\n  }\n'];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n  query HealthSSG {\n    health\n  }\n'
): (typeof documents)['\n  query HealthSSG {\n    health\n  }\n'];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n  query HealthSSR {\n    health\n  }\n'
): (typeof documents)['\n  query HealthSSR {\n    health\n  }\n'];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n  fragment DeckCompactSummaryContent on Deck {\n    name\n    subdecksCount\n    cardsDirectCount\n  }\n'
): (typeof documents)['\n  fragment DeckCompactSummaryContent on Deck {\n    name\n    subdecksCount\n    cardsDirectCount\n  }\n'];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n  fragment DeckSummaryContent on Deck {\n    id\n    name\n    subdecksCount\n    cardsDirectCount\n    editedAt\n  }\n'
): (typeof documents)['\n  fragment DeckSummaryContent on Deck {\n    id\n    name\n    subdecksCount\n    cardsDirectCount\n    editedAt\n  }\n'];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n  fragment UserProfile on User {\n    id\n    bareId\n    bio\n    name\n  }\n'
): (typeof documents)['\n  fragment UserProfile on User {\n    id\n    bareId\n    bio\n    name\n  }\n'];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n  fragment RoomNotificationsRoomItem on Room {\n    id\n    occupants {\n      id\n      bareId\n      name\n    }\n    activeRound {\n      id\n      slug\n      deck {\n        id\n        name\n      }\n    }\n  }\n'
): (typeof documents)['\n  fragment RoomNotificationsRoomItem on Room {\n    id\n    occupants {\n      id\n      bareId\n      name\n    }\n    activeRound {\n      id\n      slug\n      deck {\n        id\n        name\n      }\n    }\n  }\n'];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n  query RoomNotifications {\n    occupyingUnarchivedRooms {\n      ...RoomNotificationsRoomItem\n    }\n  }\n'
): (typeof documents)['\n  query RoomNotifications {\n    occupyingUnarchivedRooms {\n      ...RoomNotificationsRoomItem\n    }\n  }\n'];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n  mutation UserDecksSummaryNewDeckItemMutation(\n    $input: DeckCreateMutationInput!\n  ) {\n    deckCreate(input: $input) {\n      id\n    }\n  }\n'
): (typeof documents)['\n  mutation UserDecksSummaryNewDeckItemMutation(\n    $input: DeckCreateMutationInput!\n  ) {\n    deckCreate(input: $input) {\n      id\n    }\n  }\n'];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n  fragment UserDecksSummaryDeckItem on Deck {\n    id\n    editedAt\n    ...DeckCompactSummaryContent\n  }\n'
): (typeof documents)['\n  fragment UserDecksSummaryDeckItem on Deck {\n    id\n    editedAt\n    ...DeckCompactSummaryContent\n  }\n'];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n  query UserDecksSummaryQuery(\n    $after: ID\n    $before: ID\n    $first: Int\n    $last: Int\n    $input: DecksQueryInput!\n  ) {\n    decks(\n      after: $after\n      before: $before\n      first: $first\n      last: $last\n      input: $input\n    ) {\n      edges {\n        cursor\n        node {\n          ...UserDecksSummaryDeckItem\n        }\n      }\n      pageInfo {\n        endCursor\n        hasNextPage\n        hasPreviousPage\n        startCursor\n      }\n    }\n  }\n'
): (typeof documents)['\n  query UserDecksSummaryQuery(\n    $after: ID\n    $before: ID\n    $first: Int\n    $last: Int\n    $input: DecksQueryInput!\n  ) {\n    decks(\n      after: $after\n      before: $before\n      first: $first\n      last: $last\n      input: $input\n    ) {\n      edges {\n        cursor\n        node {\n          ...UserDecksSummaryDeckItem\n        }\n      }\n      pageInfo {\n        endCursor\n        hasNextPage\n        hasPreviousPage\n        startCursor\n      }\n    }\n  }\n'];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n  mutation ManageCardAddNewCardMutation(\n    $deckId: ID!\n    $cards: [CardCreateMutationInput!]!\n  ) {\n    deckAddCards(deckId: $deckId, cards: $cards) {\n      id\n    }\n  }\n'
): (typeof documents)['\n  mutation ManageCardAddNewCardMutation(\n    $deckId: ID!\n    $cards: [CardCreateMutationInput!]!\n  ) {\n    deckAddCards(deckId: $deckId, cards: $cards) {\n      id\n    }\n  }\n'];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n  fragment ManageCard on Card {\n    answers\n    fullAnswer\n    id\n    isPrimaryTemplate\n    isTemplate\n    prompt\n  }\n'
): (typeof documents)['\n  fragment ManageCard on Card {\n    answers\n    fullAnswer\n    id\n    isPrimaryTemplate\n    isTemplate\n    prompt\n  }\n'];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n  mutation ManageCardEditCardMutation($input: CardEditMutationInput!) {\n    cardEdit(input: $input) {\n      ...ManageCard\n    }\n  }\n'
): (typeof documents)['\n  mutation ManageCardEditCardMutation($input: CardEditMutationInput!) {\n    cardEdit(input: $input) {\n      ...ManageCard\n    }\n  }\n'];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n  mutation ManageCardDeleteCardMutation($id: ID!) {\n    cardDelete(id: $id) {\n      id\n    }\n  }\n'
): (typeof documents)['\n  mutation ManageCardDeleteCardMutation($id: ID!) {\n    cardDelete(id: $id) {\n      id\n    }\n  }\n'];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n  fragment ManageDeck on Deck {\n    id\n    ...ManageDeckFrontMatter\n    ...ManageDeckAdditionalInfo\n    ...ManageDeckContent\n  }\n'
): (typeof documents)['\n  fragment ManageDeck on Deck {\n    id\n    ...ManageDeckFrontMatter\n    ...ManageDeckAdditionalInfo\n    ...ManageDeckContent\n  }\n'];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n  fragment ManageDeckAdditionalInfo on Deck {\n    editedAt\n  }\n'
): (typeof documents)['\n  fragment ManageDeckAdditionalInfo on Deck {\n    editedAt\n  }\n'];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n  fragment ManageDeckContent on Deck {\n    id\n    editedAt\n    cardsDirectCount\n    subdecksCount\n    ...ManageDeckCardsUploadReview\n    ...ManageDeckSubdecks\n    ...ManageDeckCards\n  }\n'
): (typeof documents)['\n  fragment ManageDeckContent on Deck {\n    id\n    editedAt\n    cardsDirectCount\n    subdecksCount\n    ...ManageDeckCardsUploadReview\n    ...ManageDeckSubdecks\n    ...ManageDeckCards\n  }\n'];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n  mutation ManageDeckFrontMatterEdit($input: DeckEditMutationInput!) {\n    deckEdit(input: $input) {\n      answerLang\n      description\n      id\n      name\n      promptLang\n    }\n  }\n'
): (typeof documents)['\n  mutation ManageDeckFrontMatterEdit($input: DeckEditMutationInput!) {\n    deckEdit(input: $input) {\n      answerLang\n      description\n      id\n      name\n      promptLang\n    }\n  }\n'];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n  fragment ManageDeckFrontMatter on Deck {\n    id\n    name\n    description\n  }\n'
): (typeof documents)['\n  fragment ManageDeckFrontMatter on Deck {\n    id\n    name\n    description\n  }\n'];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n  fragment ManageDeckCards on Deck {\n    id\n    cardsDirect(after: $after, before: $before, first: $first, last: $last) {\n      edges {\n        cursor\n        node {\n          id\n          ...ManageCard\n        }\n      }\n      pageInfo {\n        hasNextPage\n        hasPreviousPage\n        startCursor\n        endCursor\n      }\n    }\n    cardsDirectCount\n  }\n'
): (typeof documents)['\n  fragment ManageDeckCards on Deck {\n    id\n    cardsDirect(after: $after, before: $before, first: $first, last: $last) {\n      edges {\n        cursor\n        node {\n          id\n          ...ManageCard\n        }\n      }\n      pageInfo {\n        hasNextPage\n        hasPreviousPage\n        startCursor\n        endCursor\n      }\n    }\n    cardsDirectCount\n  }\n'];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n  fragment ManageDeckCardsUploadReview on Deck {\n    id\n    cardsDirectCount\n    name\n  }\n'
): (typeof documents)['\n  fragment ManageDeckCardsUploadReview on Deck {\n    id\n    cardsDirectCount\n    name\n  }\n'];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n  mutation ManageDeckCardsAddCards(\n    $deckId: ID!\n    $cards: [CardCreateMutationInput!]!\n  ) {\n    deckAddCards(deckId: $deckId, cards: $cards) {\n      id\n    }\n  }\n'
): (typeof documents)['\n  mutation ManageDeckCardsAddCards(\n    $deckId: ID!\n    $cards: [CardCreateMutationInput!]!\n  ) {\n    deckAddCards(deckId: $deckId, cards: $cards) {\n      id\n    }\n  }\n'];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n  fragment SubdeckListItemContent on Deck {\n    ...DeckCompactSummaryContent\n    id\n  }\n'
): (typeof documents)['\n  fragment SubdeckListItemContent on Deck {\n    ...DeckCompactSummaryContent\n    id\n  }\n'];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n  query ManageDeckSubdecksLinkSubdeckQuery(\n    $after: ID\n    $before: ID\n    $first: Int\n    $last: Int\n    $input: DecksQueryInput!\n  ) {\n    decks(\n      after: $after\n      before: $before\n      first: $first\n      last: $last\n      input: $input\n    ) {\n      edges {\n        cursor\n        node {\n          ...SubdeckListItemContent\n          id\n        }\n      }\n      pageInfo {\n        endCursor\n        hasNextPage\n        hasPreviousPage\n        startCursor\n      }\n    }\n  }\n'
): (typeof documents)['\n  query ManageDeckSubdecksLinkSubdeckQuery(\n    $after: ID\n    $before: ID\n    $first: Int\n    $last: Int\n    $input: DecksQueryInput!\n  ) {\n    decks(\n      after: $after\n      before: $before\n      first: $first\n      last: $last\n      input: $input\n    ) {\n      edges {\n        cursor\n        node {\n          ...SubdeckListItemContent\n          id\n        }\n      }\n      pageInfo {\n        endCursor\n        hasNextPage\n        hasPreviousPage\n        startCursor\n      }\n    }\n  }\n'];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n  mutation ManageDeckSubdecksLinkSubdeckAddSubdeck(\n    $deckId: ID!\n    $subdeckId: ID!\n  ) {\n    deckAddSubdeck(deckId: $deckId, subdeckId: $subdeckId) {\n      id\n    }\n  }\n'
): (typeof documents)['\n  mutation ManageDeckSubdecksLinkSubdeckAddSubdeck(\n    $deckId: ID!\n    $subdeckId: ID!\n  ) {\n    deckAddSubdeck(deckId: $deckId, subdeckId: $subdeckId) {\n      id\n    }\n  }\n'];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n    mutation ManageDeckSubdecksLinkSubdeckCreateSubdeck(\n      $input: DeckCreateMutationInput!\n    ) {\n      deckCreate(input: $input) {\n        id\n      }\n    }\n  '
): (typeof documents)['\n    mutation ManageDeckSubdecksLinkSubdeckCreateSubdeck(\n      $input: DeckCreateMutationInput!\n    ) {\n      deckCreate(input: $input) {\n        id\n      }\n    }\n  '];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n  mutation ManageDeckSubdecksBrowseRemoveSubdeck(\n    $deckId: ID!\n    $subdeckId: ID!\n  ) {\n    deckRemoveSubdeck(deckId: $deckId, subdeckId: $subdeckId) {\n      id\n    }\n  }\n'
): (typeof documents)['\n  mutation ManageDeckSubdecksBrowseRemoveSubdeck(\n    $deckId: ID!\n    $subdeckId: ID!\n  ) {\n    deckRemoveSubdeck(deckId: $deckId, subdeckId: $subdeckId) {\n      id\n    }\n  }\n'];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n  fragment ManageDeckSubdecks on Deck {\n    id\n    subdecks {\n      id\n      ...SubdeckListItemContent\n    }\n  }\n'
): (typeof documents)['\n  fragment ManageDeckSubdecks on Deck {\n    id\n    subdecks {\n      id\n      ...SubdeckListItemContent\n    }\n  }\n'];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n  mutation ManageDecksNewDeckItemMutation($input: DeckCreateMutationInput!) {\n    deckCreate(input: $input) {\n      id\n    }\n  }\n'
): (typeof documents)['\n  mutation ManageDecksNewDeckItemMutation($input: DeckCreateMutationInput!) {\n    deckCreate(input: $input) {\n      id\n    }\n  }\n'];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n  query RecentDecksQuery(\n    $after: ID\n    $before: ID\n    $first: Int\n    $last: Int\n    $input: DecksQueryInput!\n  ) {\n    decks(\n      after: $after\n      before: $before\n      first: $first\n      last: $last\n      input: $input\n    ) {\n      edges {\n        cursor\n        node {\n          id\n          ...DeckCompactSummaryContent\n        }\n      }\n      pageInfo {\n        endCursor\n        hasNextPage\n        hasPreviousPage\n        startCursor\n      }\n    }\n  }\n'
): (typeof documents)['\n  query RecentDecksQuery(\n    $after: ID\n    $before: ID\n    $first: Int\n    $last: Int\n    $input: DecksQueryInput!\n  ) {\n    decks(\n      after: $after\n      before: $before\n      first: $first\n      last: $last\n      input: $input\n    ) {\n      edges {\n        cursor\n        node {\n          id\n          ...DeckCompactSummaryContent\n        }\n      }\n      pageInfo {\n        endCursor\n        hasNextPage\n        hasPreviousPage\n        startCursor\n      }\n    }\n  }\n'];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n  query SearchDecks(\n    $after: ID\n    $before: ID\n    $first: Int\n    $last: Int\n    $input: DecksQueryInput!\n  ) {\n    decks(\n      after: $after\n      before: $before\n      first: $first\n      last: $last\n      input: $input\n    ) {\n      edges {\n        cursor\n        node {\n          id\n          name\n          ...DeckSummaryContent\n        }\n      }\n      pageInfo {\n        endCursor\n        hasNextPage\n        hasPreviousPage\n        startCursor\n      }\n    }\n  }\n'
): (typeof documents)['\n  query SearchDecks(\n    $after: ID\n    $before: ID\n    $first: Int\n    $last: Int\n    $input: DecksQueryInput!\n  ) {\n    decks(\n      after: $after\n      before: $before\n      first: $first\n      last: $last\n      input: $input\n    ) {\n      edges {\n        cursor\n        node {\n          id\n          name\n          ...DeckSummaryContent\n        }\n      }\n      pageInfo {\n        endCursor\n        hasNextPage\n        hasPreviousPage\n        startCursor\n      }\n    }\n  }\n'];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n  mutation ManageFriendsBefriendMutation($befriendedId: ID!) {\n    befriend(befriendedId: $befriendedId) {\n      id\n    }\n  }\n'
): (typeof documents)['\n  mutation ManageFriendsBefriendMutation($befriendedId: ID!) {\n    befriend(befriendedId: $befriendedId) {\n      id\n    }\n  }\n'];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n  query FriendsMutualsListQuery {\n    friends {\n      edges {\n        cursor\n        node {\n          ...UserProfile\n        }\n      }\n    }\n  }\n'
): (typeof documents)['\n  query FriendsMutualsListQuery {\n    friends {\n      edges {\n        cursor\n        node {\n          ...UserProfile\n        }\n      }\n    }\n  }\n'];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n  fragment PersonalProfile on User {\n    id\n    bareId\n    bio\n    name\n  }\n'
): (typeof documents)['\n  fragment PersonalProfile on User {\n    id\n    bareId\n    bio\n    name\n  }\n'];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n  mutation PersonalProfileEdit($input: OwnProfileEditMutationInput!) {\n    ownProfileEdit(input: $input) {\n      ...PersonalProfile\n    }\n  }\n'
): (typeof documents)['\n  mutation PersonalProfileEdit($input: OwnProfileEditMutationInput!) {\n    ownProfileEdit(input: $input) {\n      ...PersonalProfile\n    }\n  }\n'];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n  query ManageRoomQuery($id: ID!) {\n    room(id: $id) {\n      id\n      ...ManageRoomContextual\n    }\n  }\n'
): (typeof documents)['\n  query ManageRoomQuery($id: ID!) {\n    room(id: $id) {\n      id\n      ...ManageRoomContextual\n    }\n  }\n'];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n  fragment ManageRoomContextual on Room {\n    id\n    activeRound {\n      deck {\n        id\n        name\n      }\n      id\n      slug\n      state\n    }\n  }\n'
): (typeof documents)['\n  fragment ManageRoomContextual on Room {\n    id\n    activeRound {\n      deck {\n        id\n        name\n      }\n      id\n      slug\n      state\n    }\n  }\n'];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n  fragment ManageRoomMessages on Message {\n    content\n    createdAt\n    id\n    sender {\n      id\n      name\n    }\n    type\n  }\n'
): (typeof documents)['\n  fragment ManageRoomMessages on Message {\n    content\n    createdAt\n    id\n    sender {\n      id\n      name\n    }\n    type\n  }\n'];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n  subscription ManageRoomMessagesSubscription($id: ID!) {\n    messageUpdatesByRoomId(id: $id) {\n      operation\n      value {\n        ...ManageRoomMessages\n      }\n    }\n  }\n'
): (typeof documents)['\n  subscription ManageRoomMessagesSubscription($id: ID!) {\n    messageUpdatesByRoomId(id: $id) {\n      operation\n      value {\n        ...ManageRoomMessages\n      }\n    }\n  }\n'];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n  mutation ManageRoomPrimaryInputMutation($roomId: ID!, $textContent: String!) {\n    sendTextMessage(roomId: $roomId, textContent: $textContent) {\n      id\n    }\n  }\n'
): (typeof documents)['\n  mutation ManageRoomPrimaryInputMutation($roomId: ID!, $textContent: String!) {\n    sendTextMessage(roomId: $roomId, textContent: $textContent) {\n      id\n    }\n  }\n'];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n  mutation ManageRoomRoomSetDeck($deckId: ID!, $id: ID!) {\n    roomSetDeck(deckId: $deckId, id: $id) {\n      id\n      activeRound {\n        id\n        deck {\n          id\n          name\n        }\n        slug\n      }\n    }\n  }\n'
): (typeof documents)['\n  mutation ManageRoomRoomSetDeck($deckId: ID!, $id: ID!) {\n    roomSetDeck(deckId: $deckId, id: $id) {\n      id\n      activeRound {\n        id\n        deck {\n          id\n          name\n        }\n        slug\n      }\n    }\n  }\n'];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n  mutation InitializeOauthSigninMutation {\n    initializeOauthSignin\n  }\n'
): (typeof documents)['\n  mutation InitializeOauthSigninMutation {\n    initializeOauthSignin\n  }\n'];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n  mutation RefreshMutation($token: JWT!) {\n    refresh(token: $token) {\n      currentUser\n      token\n    }\n  }\n'
): (typeof documents)['\n  mutation RefreshMutation($token: JWT!) {\n    refresh(token: $token) {\n      currentUser\n      token\n    }\n  }\n'];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n  query UseQueryDecks(\n    $after: ID\n    $before: ID\n    $first: Int\n    $last: Int\n    $input: DecksQueryInput!\n  ) {\n    decks(\n      after: $after\n      before: $before\n      first: $first\n      last: $last\n      input: $input\n    ) {\n      edges {\n        cursor\n        node {\n          id\n        }\n      }\n      pageInfo {\n        endCursor\n        hasNextPage\n        hasPreviousPage\n        startCursor\n      }\n    }\n  }\n'
): (typeof documents)['\n  query UseQueryDecks(\n    $after: ID\n    $before: ID\n    $first: Int\n    $last: Int\n    $input: DecksQueryInput!\n  ) {\n    decks(\n      after: $after\n      before: $before\n      first: $first\n      last: $last\n      input: $input\n    ) {\n      edges {\n        cursor\n        node {\n          id\n        }\n      }\n      pageInfo {\n        endCursor\n        hasNextPage\n        hasPreviousPage\n        startCursor\n      }\n    }\n  }\n'];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n  mutation AuthRefreshMutation($token: JWT!) {\n    refresh(token: $token) {\n      currentUser\n      token\n    }\n  }\n'
): (typeof documents)['\n  mutation AuthRefreshMutation($token: JWT!) {\n    refresh(token: $token) {\n      currentUser\n      token\n    }\n  }\n'];

export function graphql(source: string) {
  return (documents as any)[source] ?? {};
}

export type DocumentType<TDocumentNode extends DocumentNode<any, any>> =
  TDocumentNode extends DocumentNode<infer TType, any> ? TType : never;
