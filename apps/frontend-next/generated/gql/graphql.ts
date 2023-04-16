/* eslint-disable */
import { JSONValue, JSONObject } from '../../src/utils/jsonTypes'
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  /** A date-time string at UTC, such as 2007-12-03T10:15:30Z, compliant with the `date-time` format outlined in section 5.6 of the RFC 3339 profile of the ISO 8601 standard for representation of dates and times using the Gregorian calendar. */
  DateTime: string;
  /** A field whose value conforms to the standard internet email address format as specified in HTML Spec: https://html.spec.whatwg.org/multipage/input.html#valid-e-mail-address. */
  EmailAddress: string;
  /** The `JSON` scalar type represents JSON values as specified by [ECMA-404](http://www.ecma-international.org/publications/files/ECMA-ST/ECMA-404.pdf). */
  JSON: JSONValue;
  /** The `JSONObject` scalar type represents JSON objects as specified by [ECMA-404](http://www.ecma-international.org/publications/files/ECMA-ST/ECMA-404.pdf). */
  JSONObject: JSONObject;
  /** A field whose value is a JSON Web Token (JWT): https://jwt.io/introduction. */
  JWT: string;
  /** A field whose value is a generic Universally Unique Identifier: https://en.wikipedia.org/wiki/Universally_unique_identifier. */
  UUID: string;
};

export type Card = Node & {
  __typename?: 'Card';
  answers: Array<Scalars['String']>;
  editedAt: Scalars['DateTime'];
  fullAnswer?: Maybe<Scalars['JSONObject']>;
  id: Scalars['ID'];
  isPrimaryTemplate: Scalars['Boolean'];
  isTemplate: Scalars['Boolean'];
  ownRecordCorrectHistory?: Maybe<Array<Scalars['DateTime']>>;
  prompt?: Maybe<Scalars['JSONObject']>;
};

export type CardCreateMutationInput = {
  answers: Array<Scalars['String']>;
  fullAnswer?: InputMaybe<Scalars['JSONObject']>;
  isPrimaryTemplate?: InputMaybe<Scalars['Boolean']>;
  isTemplate: Scalars['Boolean'];
  prompt?: InputMaybe<Scalars['JSONObject']>;
};

export type CardEditMutationInput = {
  answers: Array<Scalars['String']>;
  fullAnswer?: InputMaybe<Scalars['JSONObject']>;
  id: Scalars['ID'];
  isPrimaryTemplate?: InputMaybe<Scalars['Boolean']>;
  isTemplate: Scalars['Boolean'];
  prompt?: InputMaybe<Scalars['JSONObject']>;
};

export type Deck = Node & {
  __typename?: 'Deck';
  answerLang: Scalars['String'];
  /** all cards directly belonging to some descendant (reflexive, transitive closure of subdeck) deck of this deck */
  cardsAllUnder: DeckCardsAllUnderConnection;
  /** all cards directly belonging to this deck */
  cardsDirect: DeckCardsDirectConnection;
  /** number of all cards directly belonging to this deck */
  cardsDirectCount: Scalars['Int'];
  createdAt: Scalars['DateTime'];
  /** all descendant decks (reflexive, transitive closure of subdeck) of this deck */
  descendantDecks: Array<Deck>;
  description?: Maybe<Scalars['JSONObject']>;
  editedAt: Scalars['DateTime'];
  id: Scalars['ID'];
  name: Scalars['String'];
  ownRecordNotes?: Maybe<Scalars['JSONObject']>;
  owner: User;
  promptLang: Scalars['String'];
  published: Scalars['Boolean'];
  sortData: Array<Scalars['String']>;
  /** all subdecks directly belonging to this deck */
  subdecks: Array<Deck>;
  subdecksCount: Scalars['Int'];
};


export type DeckCardsAllUnderArgs = {
  after?: InputMaybe<Scalars['ID']>;
  before?: InputMaybe<Scalars['ID']>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
};


export type DeckCardsDirectArgs = {
  after?: InputMaybe<Scalars['ID']>;
  before?: InputMaybe<Scalars['ID']>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
};

export type DeckCardsAllUnderConnection = {
  __typename?: 'DeckCardsAllUnderConnection';
  edges: Array<Maybe<DeckCardsAllUnderConnectionEdge>>;
  pageInfo: PageInfo;
};

export type DeckCardsAllUnderConnectionEdge = {
  __typename?: 'DeckCardsAllUnderConnectionEdge';
  cursor: Scalars['ID'];
  node: Card;
};

export type DeckCardsDirectConnection = {
  __typename?: 'DeckCardsDirectConnection';
  edges: Array<Maybe<DeckCardsDirectConnectionEdge>>;
  pageInfo: PageInfo;
};

export type DeckCardsDirectConnectionEdge = {
  __typename?: 'DeckCardsDirectConnectionEdge';
  cursor: Scalars['ID'];
  node: Card;
};

export type DeckCreateMutationInput = {
  answerLang: Scalars['String'];
  cards: Array<CardCreateMutationInput>;
  description?: InputMaybe<Scalars['JSONObject']>;
  name: Scalars['String'];
  notes?: InputMaybe<Scalars['JSONObject']>;
  parentDeckId?: InputMaybe<Scalars['ID']>;
  promptLang: Scalars['String'];
  published?: InputMaybe<Scalars['Boolean']>;
};

export type DeckEditMutationInput = {
  answerLang?: InputMaybe<Scalars['String']>;
  description?: InputMaybe<Scalars['JSONObject']>;
  id: Scalars['ID'];
  name?: InputMaybe<Scalars['String']>;
  notes?: InputMaybe<Scalars['JSONObject']>;
  promptLang?: InputMaybe<Scalars['String']>;
};

export type DecksQueryInput = {
  scope?: InputMaybe<DecksQueryScope>;
  stoplist?: InputMaybe<Array<Scalars['ID']>>;
  titleContains?: InputMaybe<Scalars['String']>;
};

/** ownership type of of decks returned */
export enum DecksQueryScope {
  Owned = 'OWNED',
  Visible = 'VISIBLE'
}

export type FinalizeOauthSigninMutationInput = {
  code: Scalars['String'];
  nonce: Scalars['String'];
  provider: Scalars['String'];
  redirect_uri: Scalars['String'];
};

export type Friendship = Node & {
  __typename?: 'Friendship';
  befriended: User;
  befriender: User;
  createdAt: Scalars['DateTime'];
  id: Scalars['ID'];
  updatedAt: Scalars['DateTime'];
};

export type Message = Node & {
  __typename?: 'Message';
  content?: Maybe<Scalars['JSONObject']>;
  createdAt: Scalars['DateTime'];
  id: Scalars['ID'];
  sender: User;
  type: MessageContentType;
};

export enum MessageContentType {
  Config = 'CONFIG',
  ContestScore = 'CONTEST_SCORE',
  RoundScore = 'ROUND_SCORE',
  RoundStart = 'ROUND_START',
  RoundWin = 'ROUND_WIN',
  Text = 'TEXT'
}

/** A message indicating an operation performed on a message. */
export type MessageUpdate = {
  __typename?: 'MessageUpdate';
  operation: MessageUpdateOperations;
  value: Message;
};

/** Names identifying operations that trigger message updates. */
export enum MessageUpdateOperations {
  MessageCreate = 'MESSAGE_CREATE'
}

export type Mutation = {
  __typename?: 'Mutation';
  /** Befriend the `befriendedId` user, then resolves to the user's own profile */
  befriend: User;
  cardCreate: Card;
  cardDelete: Card;
  cardEdit: Card;
  /** add cards to a deck */
  deckAddCards: Deck;
  /** add a subdeck to a deck and resolve to the parent deck */
  deckAddSubdeck: Deck;
  /** create a new deck */
  deckCreate: Deck;
  /** delete the specified deck, only if its dependents are deleted */
  deckDelete: Deck;
  /** edit a new deck */
  deckEdit: Deck;
  /** add a subdeck to a deck and resolve to the parent deck */
  deckRemoveSubdeck: Deck;
  finalizeOauthSignin?: Maybe<SessionInfo>;
  initializeOauthSignin: Scalars['String'];
  /** Edit the user's own profile. */
  ownProfileEdit: User;
  recordCorrectAnswer: Card;
  refresh?: Maybe<SessionInfo>;
  roomArchive: Room;
  roomCreate: Room;
  roomEndRound: Room;
  roomJoin: Room;
  roomSetDeck: Room;
  roomStartRound: Room;
  sendTextMessage: Message;
  /** set personal notes for a deck */
  setOwnNotes: Deck;
};


export type MutationBefriendArgs = {
  befriendedId: Scalars['ID'];
};


export type MutationCardCreateArgs = {
  card: CardCreateMutationInput;
  deckId: Scalars['ID'];
};


export type MutationCardDeleteArgs = {
  id: Scalars['ID'];
};


export type MutationCardEditArgs = {
  input: CardEditMutationInput;
};


export type MutationDeckAddCardsArgs = {
  cards: Array<CardCreateMutationInput>;
  deckId: Scalars['ID'];
};


export type MutationDeckAddSubdeckArgs = {
  deckId: Scalars['ID'];
  subdeckId: Scalars['ID'];
};


export type MutationDeckCreateArgs = {
  input: DeckCreateMutationInput;
};


export type MutationDeckDeleteArgs = {
  deckId: Scalars['ID'];
};


export type MutationDeckEditArgs = {
  input: DeckEditMutationInput;
};


export type MutationDeckRemoveSubdeckArgs = {
  deckId: Scalars['ID'];
  subdeckId: Scalars['ID'];
};


export type MutationFinalizeOauthSigninArgs = {
  input: FinalizeOauthSigninMutationInput;
};


export type MutationOwnProfileEditArgs = {
  input: OwnProfileEditMutationInput;
};


export type MutationRecordCorrectAnswerArgs = {
  id: Scalars['ID'];
};


export type MutationRefreshArgs = {
  token: Scalars['JWT'];
};


export type MutationRoomArchiveArgs = {
  id: Scalars['ID'];
};


export type MutationRoomEndRoundArgs = {
  id: Scalars['ID'];
};


export type MutationRoomJoinArgs = {
  id: Scalars['ID'];
};


export type MutationRoomSetDeckArgs = {
  deckId: Scalars['ID'];
  id: Scalars['ID'];
};


export type MutationRoomStartRoundArgs = {
  id: Scalars['ID'];
};


export type MutationSendTextMessageArgs = {
  roomId: Scalars['ID'];
  textContent: Scalars['String'];
};


export type MutationSetOwnNotesArgs = {
  deckId: Scalars['ID'];
  notes: Scalars['JSONObject'];
};

export type Node = {
  id: Scalars['ID'];
};

export type OwnProfileEditMutationInput = {
  bio?: InputMaybe<Scalars['JSONObject']>;
  isPublic?: InputMaybe<Scalars['Boolean']>;
  name?: InputMaybe<Scalars['String']>;
};

export type PageInfo = {
  __typename?: 'PageInfo';
  endCursor?: Maybe<Scalars['ID']>;
  hasNextPage: Scalars['Boolean'];
  hasPreviousPage: Scalars['Boolean'];
  startCursor?: Maybe<Scalars['ID']>;
};

export type Query = {
  __typename?: 'Query';
  deck: Deck;
  decks: QueryDecksConnection;
  health: Scalars['String'];
  me?: Maybe<User>;
  node?: Maybe<Node>;
  nodes: Array<Maybe<Node>>;
  occupyingUnarchivedRooms?: Maybe<Array<Room>>;
  room?: Maybe<Room>;
  roomBySlug?: Maybe<Room>;
};


export type QueryDeckArgs = {
  id: Scalars['ID'];
};


export type QueryDecksArgs = {
  after?: InputMaybe<Scalars['ID']>;
  before?: InputMaybe<Scalars['ID']>;
  first?: InputMaybe<Scalars['Int']>;
  input: DecksQueryInput;
  last?: InputMaybe<Scalars['Int']>;
};


export type QueryNodeArgs = {
  id: Scalars['ID'];
};


export type QueryNodesArgs = {
  ids: Array<Scalars['ID']>;
};


export type QueryRoomArgs = {
  id: Scalars['ID'];
};


export type QueryRoomBySlugArgs = {
  slug: Scalars['String'];
};

export type QueryDecksConnection = {
  __typename?: 'QueryDecksConnection';
  edges: Array<Maybe<QueryDecksConnectionEdge>>;
  pageInfo: PageInfo;
};

export type QueryDecksConnectionEdge = {
  __typename?: 'QueryDecksConnectionEdge';
  cursor: Scalars['ID'];
  node: Deck;
};

export type Room = Node & {
  __typename?: 'Room';
  activeRound?: Maybe<Round>;
  id: Scalars['ID'];
  messageCount: Scalars['Int'];
  messages: RoomMessagesConnection;
  occupants: Array<User>;
  occupantsCount: Scalars['Int'];
  type: RoomType;
};


export type RoomMessagesArgs = {
  after?: InputMaybe<Scalars['ID']>;
  before?: InputMaybe<Scalars['ID']>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
};

export type RoomMessagesConnection = {
  __typename?: 'RoomMessagesConnection';
  edges: Array<Maybe<RoomMessagesConnectionEdge>>;
  pageInfo: PageInfo;
};

export type RoomMessagesConnectionEdge = {
  __typename?: 'RoomMessagesConnectionEdge';
  cursor: Scalars['ID'];
  node: Message;
};

export enum RoomType {
  Ephemeral = 'EPHEMERAL',
  Persistent = 'PERSISTENT'
}

/** A message indicating an operation performed on a room. */
export type RoomUpdate = {
  __typename?: 'RoomUpdate';
  operation: RoomUpdateOperations;
  value: Room;
};

/** Keys identifying operations that trigger room updates. */
export enum RoomUpdateOperations {
  RoomArchive = 'ROOM_ARCHIVE',
  RoomEndRound = 'ROOM_END_ROUND',
  RoomJoin = 'ROOM_JOIN',
  RoomSetDeck = 'ROOM_SET_DECK',
  RoomStartRound = 'ROOM_START_ROUND'
}

export type Round = Node & {
  __typename?: 'Round';
  deck: Deck;
  id: Scalars['ID'];
  isActive: Scalars['Boolean'];
  slug: Scalars['String'];
  state: RoundState;
};

export enum RoundState {
  Playing = 'PLAYING',
  Waiting = 'WAITING'
}

/** A token and its contained information */
export type SessionInfo = {
  __typename?: 'SessionInfo';
  currentUser: Scalars['JSONObject'];
  token: Scalars['JWT'];
};

export type Subdeck = Node & {
  __typename?: 'Subdeck';
  createdAt: Scalars['DateTime'];
  id: Scalars['ID'];
  parentDeck: Deck;
  subdeck: Deck;
  updatedAt: Scalars['DateTime'];
};

export type Subscription = {
  __typename?: 'Subscription';
  messageUpdatesByRoomId: MessageUpdate;
  repeatHealth: Scalars['String'];
  roomUpdatesByRoomId: RoomUpdate;
};


export type SubscriptionMessageUpdatesByRoomIdArgs = {
  id: Scalars['ID'];
};


export type SubscriptionRoomUpdatesByRoomIdArgs = {
  id: Scalars['ID'];
};

export type User = Node & {
  __typename?: 'User';
  /** users this user has befriended */
  befriendeds: UserBefriendedsConnection;
  befriendedsCount: Scalars['Int'];
  /** users that have befriended this user and you */
  befrienders: UserBefriendersConnection;
  befriendersCount: Scalars['Int'];
  bio?: Maybe<Scalars['JSONObject']>;
  decks: UserDecksConnection;
  facebookId?: Maybe<Scalars['String']>;
  googleId?: Maybe<Scalars['String']>;
  id: Scalars['ID'];
  /** whether the user's profile information is accessible by non-friends and searchable */
  isPublic: Scalars['Boolean'];
  /** users befriending you that this user has befriended; upon own user gives your mutual friends */
  mutualBefriendeds: UserMutualBefriendedsConnection;
  name: Scalars['String'];
  roles: Array<Scalars['String']>;
};


export type UserBefriendedsArgs = {
  after?: InputMaybe<Scalars['ID']>;
  before?: InputMaybe<Scalars['ID']>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
};


export type UserBefriendersArgs = {
  after?: InputMaybe<Scalars['ID']>;
  before?: InputMaybe<Scalars['ID']>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
};


export type UserDecksArgs = {
  after?: InputMaybe<Scalars['ID']>;
  before?: InputMaybe<Scalars['ID']>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
};


export type UserMutualBefriendedsArgs = {
  after?: InputMaybe<Scalars['ID']>;
  before?: InputMaybe<Scalars['ID']>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
};

export type UserBefriendedsConnection = {
  __typename?: 'UserBefriendedsConnection';
  edges: Array<Maybe<UserBefriendedsConnectionEdge>>;
  pageInfo: PageInfo;
};

export type UserBefriendedsConnectionEdge = {
  __typename?: 'UserBefriendedsConnectionEdge';
  cursor: Scalars['ID'];
  node: User;
};

export type UserBefriendersConnection = {
  __typename?: 'UserBefriendersConnection';
  edges: Array<Maybe<UserBefriendersConnectionEdge>>;
  pageInfo: PageInfo;
};

export type UserBefriendersConnectionEdge = {
  __typename?: 'UserBefriendersConnectionEdge';
  cursor: Scalars['ID'];
  node: User;
};

export type UserDecksConnection = {
  __typename?: 'UserDecksConnection';
  edges: Array<Maybe<UserDecksConnectionEdge>>;
  pageInfo: PageInfo;
};

export type UserDecksConnectionEdge = {
  __typename?: 'UserDecksConnectionEdge';
  cursor: Scalars['ID'];
  node: Deck;
};

export type UserMutualBefriendedsConnection = {
  __typename?: 'UserMutualBefriendedsConnection';
  edges: Array<Maybe<UserMutualBefriendedsConnectionEdge>>;
  pageInfo: PageInfo;
};

export type UserMutualBefriendedsConnectionEdge = {
  __typename?: 'UserMutualBefriendedsConnectionEdge';
  cursor: Scalars['ID'];
  node: User;
};

export type FinalizeOauthSigninMutationVariables = Exact<{
  input: FinalizeOauthSigninMutationInput;
}>;


export type FinalizeOauthSigninMutation = { __typename?: 'Mutation', finalizeOauthSignin?: { __typename?: 'SessionInfo', currentUser: JSONObject, token: string } | null };

export type DeckQueryQueryVariables = Exact<{
  id: Scalars['ID'];
  after?: InputMaybe<Scalars['ID']>;
  first?: InputMaybe<Scalars['Int']>;
  before?: InputMaybe<Scalars['ID']>;
  last?: InputMaybe<Scalars['Int']>;
}>;


export type DeckQueryQuery = { __typename?: 'Query', deck: (
    { __typename?: 'Deck', id: string }
    & { ' $fragmentRefs'?: { 'ManageDeckFragment': ManageDeckFragment } }
  ) };

export type UserQueryQueryVariables = Exact<{ [key: string]: never; }>;


export type UserQueryQuery = { __typename?: 'Query', me?: (
    { __typename?: 'User', id: string }
    & { ' $fragmentRefs'?: { 'PersonalProfileFragment': PersonalProfileFragment } }
  ) | null };

export type HealthClientOnlyQueryVariables = Exact<{ [key: string]: never; }>;


export type HealthClientOnlyQuery = { __typename?: 'Query', health: string };

export type RepeatHealthClientOnlySubscriptionVariables = Exact<{ [key: string]: never; }>;


export type RepeatHealthClientOnlySubscription = { __typename?: 'Subscription', repeatHealth: string };

export type HealthSsgQueryVariables = Exact<{ [key: string]: never; }>;


export type HealthSsgQuery = { __typename?: 'Query', health: string };

export type HealthSsrQueryVariables = Exact<{ [key: string]: never; }>;


export type HealthSsrQuery = { __typename?: 'Query', health: string };

export type DeckCompactSummaryContentFragment = { __typename?: 'Deck', name: string, subdecksCount: number, cardsDirectCount: number } & { ' $fragmentName'?: 'DeckCompactSummaryContentFragment' };

export type DeckSummaryContentFragment = { __typename?: 'Deck', id: string, name: string, subdecksCount: number, cardsDirectCount: number, editedAt: string } & { ' $fragmentName'?: 'DeckSummaryContentFragment' };

export type UserProfileFragment = { __typename?: 'User', id: string, bio?: JSONObject | null, name: string } & { ' $fragmentName'?: 'UserProfileFragment' };

export type RoomNotificationsRoomItemFragment = { __typename?: 'Room', id: string, occupants: Array<{ __typename?: 'User', id: string, name: string }>, activeRound?: { __typename?: 'Round', id: string, slug: string, deck: { __typename?: 'Deck', id: string, name: string } } | null } & { ' $fragmentName'?: 'RoomNotificationsRoomItemFragment' };

export type RoomNotificationsQueryVariables = Exact<{ [key: string]: never; }>;


export type RoomNotificationsQuery = { __typename?: 'Query', occupyingUnarchivedRooms?: Array<(
    { __typename?: 'Room' }
    & { ' $fragmentRefs'?: { 'RoomNotificationsRoomItemFragment': RoomNotificationsRoomItemFragment } }
  )> | null };

export type UserDecksSummaryNewDeckItemMutationMutationVariables = Exact<{
  input: DeckCreateMutationInput;
}>;


export type UserDecksSummaryNewDeckItemMutationMutation = { __typename?: 'Mutation', deckCreate: { __typename?: 'Deck', id: string } };

export type UserDecksSummaryDeckItemFragment = (
  { __typename?: 'Deck', id: string, editedAt: string }
  & { ' $fragmentRefs'?: { 'DeckCompactSummaryContentFragment': DeckCompactSummaryContentFragment } }
) & { ' $fragmentName'?: 'UserDecksSummaryDeckItemFragment' };

export type UserDecksSummaryQueryQueryVariables = Exact<{
  after?: InputMaybe<Scalars['ID']>;
  before?: InputMaybe<Scalars['ID']>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  input: DecksQueryInput;
}>;


export type UserDecksSummaryQueryQuery = { __typename?: 'Query', decks: { __typename?: 'QueryDecksConnection', edges: Array<{ __typename?: 'QueryDecksConnectionEdge', cursor: string, node: (
        { __typename?: 'Deck' }
        & { ' $fragmentRefs'?: { 'UserDecksSummaryDeckItemFragment': UserDecksSummaryDeckItemFragment } }
      ) } | null>, pageInfo: { __typename?: 'PageInfo', endCursor?: string | null, hasNextPage: boolean, hasPreviousPage: boolean, startCursor?: string | null } } };

export type ManageCardAddNewCardMutationMutationVariables = Exact<{
  deckId: Scalars['ID'];
  cards: Array<CardCreateMutationInput> | CardCreateMutationInput;
}>;


export type ManageCardAddNewCardMutationMutation = { __typename?: 'Mutation', deckAddCards: { __typename?: 'Deck', id: string } };

export type ManageCardFragment = { __typename?: 'Card', answers: Array<string>, fullAnswer?: JSONObject | null, id: string, isPrimaryTemplate: boolean, isTemplate: boolean, prompt?: JSONObject | null } & { ' $fragmentName'?: 'ManageCardFragment' };

export type ManageCardEditCardMutationMutationVariables = Exact<{
  input: CardEditMutationInput;
}>;


export type ManageCardEditCardMutationMutation = { __typename?: 'Mutation', cardEdit: (
    { __typename?: 'Card' }
    & { ' $fragmentRefs'?: { 'ManageCardFragment': ManageCardFragment } }
  ) };

export type ManageCardDeleteCardMutationMutationVariables = Exact<{
  id: Scalars['ID'];
}>;


export type ManageCardDeleteCardMutationMutation = { __typename?: 'Mutation', cardDelete: { __typename?: 'Card', id: string } };

export type ManageDeckFragment = (
  { __typename?: 'Deck', id: string }
  & { ' $fragmentRefs'?: { 'ManageDeckFrontMatterFragment': ManageDeckFrontMatterFragment;'ManageDeckAdditionalInfoFragment': ManageDeckAdditionalInfoFragment;'ManageDeckContentFragment': ManageDeckContentFragment } }
) & { ' $fragmentName'?: 'ManageDeckFragment' };

export type ManageDeckAdditionalInfoFragment = { __typename?: 'Deck', editedAt: string } & { ' $fragmentName'?: 'ManageDeckAdditionalInfoFragment' };

export type ManageDeckContentFragment = (
  { __typename?: 'Deck', id: string, editedAt: string, cardsDirectCount: number, subdecksCount: number }
  & { ' $fragmentRefs'?: { 'ManageDeckCardsUploadReviewFragment': ManageDeckCardsUploadReviewFragment;'ManageDeckSubdecksFragment': ManageDeckSubdecksFragment;'ManageDeckCardsFragment': ManageDeckCardsFragment } }
) & { ' $fragmentName'?: 'ManageDeckContentFragment' };

export type ManageDeckFrontMatterEditMutationVariables = Exact<{
  input: DeckEditMutationInput;
}>;


export type ManageDeckFrontMatterEditMutation = { __typename?: 'Mutation', deckEdit: { __typename?: 'Deck', answerLang: string, description?: JSONObject | null, id: string, name: string, promptLang: string } };

export type ManageDeckFrontMatterFragment = { __typename?: 'Deck', id: string, name: string, description?: JSONObject | null } & { ' $fragmentName'?: 'ManageDeckFrontMatterFragment' };

export type ManageDeckCardsFragment = { __typename?: 'Deck', id: string, cardsDirectCount: number, cardsDirect: { __typename?: 'DeckCardsDirectConnection', edges: Array<{ __typename?: 'DeckCardsDirectConnectionEdge', cursor: string, node: (
        { __typename?: 'Card', id: string }
        & { ' $fragmentRefs'?: { 'ManageCardFragment': ManageCardFragment } }
      ) } | null>, pageInfo: { __typename?: 'PageInfo', hasNextPage: boolean, hasPreviousPage: boolean, startCursor?: string | null, endCursor?: string | null } } } & { ' $fragmentName'?: 'ManageDeckCardsFragment' };

export type ManageDeckCardsUploadReviewFragment = { __typename?: 'Deck', id: string, cardsDirectCount: number, name: string } & { ' $fragmentName'?: 'ManageDeckCardsUploadReviewFragment' };

export type ManageDeckCardsAddCardsMutationVariables = Exact<{
  deckId: Scalars['ID'];
  cards: Array<CardCreateMutationInput> | CardCreateMutationInput;
}>;


export type ManageDeckCardsAddCardsMutation = { __typename?: 'Mutation', deckAddCards: { __typename?: 'Deck', id: string } };

export type SubdeckListItemContentFragment = (
  { __typename?: 'Deck', id: string }
  & { ' $fragmentRefs'?: { 'DeckCompactSummaryContentFragment': DeckCompactSummaryContentFragment } }
) & { ' $fragmentName'?: 'SubdeckListItemContentFragment' };

export type ManageDeckSubdecksLinkSubdeckQueryQueryVariables = Exact<{
  after?: InputMaybe<Scalars['ID']>;
  before?: InputMaybe<Scalars['ID']>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  input: DecksQueryInput;
}>;


export type ManageDeckSubdecksLinkSubdeckQueryQuery = { __typename?: 'Query', decks: { __typename?: 'QueryDecksConnection', edges: Array<{ __typename?: 'QueryDecksConnectionEdge', cursor: string, node: (
        { __typename?: 'Deck', id: string }
        & { ' $fragmentRefs'?: { 'SubdeckListItemContentFragment': SubdeckListItemContentFragment } }
      ) } | null>, pageInfo: { __typename?: 'PageInfo', endCursor?: string | null, hasNextPage: boolean, hasPreviousPage: boolean, startCursor?: string | null } } };

export type ManageDeckSubdecksLinkSubdeckAddSubdeckMutationVariables = Exact<{
  deckId: Scalars['ID'];
  subdeckId: Scalars['ID'];
}>;


export type ManageDeckSubdecksLinkSubdeckAddSubdeckMutation = { __typename?: 'Mutation', deckAddSubdeck: { __typename?: 'Deck', id: string } };

export type ManageDeckSubdecksLinkSubdeckCreateSubdeckMutationVariables = Exact<{
  input: DeckCreateMutationInput;
}>;


export type ManageDeckSubdecksLinkSubdeckCreateSubdeckMutation = { __typename?: 'Mutation', deckCreate: { __typename?: 'Deck', id: string } };

export type ManageDeckSubdecksBrowseRemoveSubdeckMutationVariables = Exact<{
  deckId: Scalars['ID'];
  subdeckId: Scalars['ID'];
}>;


export type ManageDeckSubdecksBrowseRemoveSubdeckMutation = { __typename?: 'Mutation', deckRemoveSubdeck: { __typename?: 'Deck', id: string } };

export type ManageDeckSubdecksFragment = { __typename?: 'Deck', id: string, subdecks: Array<(
    { __typename?: 'Deck', id: string }
    & { ' $fragmentRefs'?: { 'SubdeckListItemContentFragment': SubdeckListItemContentFragment } }
  )> } & { ' $fragmentName'?: 'ManageDeckSubdecksFragment' };

export type ManageDecksNewDeckItemMutationMutationVariables = Exact<{
  input: DeckCreateMutationInput;
}>;


export type ManageDecksNewDeckItemMutationMutation = { __typename?: 'Mutation', deckCreate: { __typename?: 'Deck', id: string } };

export type RecentDecksQueryQueryVariables = Exact<{
  after?: InputMaybe<Scalars['ID']>;
  before?: InputMaybe<Scalars['ID']>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  input: DecksQueryInput;
}>;


export type RecentDecksQueryQuery = { __typename?: 'Query', decks: { __typename?: 'QueryDecksConnection', edges: Array<{ __typename?: 'QueryDecksConnectionEdge', cursor: string, node: (
        { __typename?: 'Deck', id: string }
        & { ' $fragmentRefs'?: { 'DeckCompactSummaryContentFragment': DeckCompactSummaryContentFragment } }
      ) } | null>, pageInfo: { __typename?: 'PageInfo', endCursor?: string | null, hasNextPage: boolean, hasPreviousPage: boolean, startCursor?: string | null } } };

export type SearchDecksQueryVariables = Exact<{
  after?: InputMaybe<Scalars['ID']>;
  before?: InputMaybe<Scalars['ID']>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  input: DecksQueryInput;
}>;


export type SearchDecksQuery = { __typename?: 'Query', decks: { __typename?: 'QueryDecksConnection', edges: Array<{ __typename?: 'QueryDecksConnectionEdge', cursor: string, node: (
        { __typename?: 'Deck', id: string, name: string }
        & { ' $fragmentRefs'?: { 'DeckSummaryContentFragment': DeckSummaryContentFragment } }
      ) } | null>, pageInfo: { __typename?: 'PageInfo', endCursor?: string | null, hasNextPage: boolean, hasPreviousPage: boolean, startCursor?: string | null } } };

export type PersonalProfileFragment = { __typename?: 'User', id: string, bio?: JSONObject | null, name: string } & { ' $fragmentName'?: 'PersonalProfileFragment' };

export type PersonalProfileEditMutationVariables = Exact<{
  input: OwnProfileEditMutationInput;
}>;


export type PersonalProfileEditMutation = { __typename?: 'Mutation', ownProfileEdit: (
    { __typename?: 'User' }
    & { ' $fragmentRefs'?: { 'PersonalProfileFragment': PersonalProfileFragment } }
  ) };

export type ManageRoomQueryQueryVariables = Exact<{
  id: Scalars['ID'];
}>;


export type ManageRoomQueryQuery = { __typename?: 'Query', room?: (
    { __typename?: 'Room', id: string }
    & { ' $fragmentRefs'?: { 'ManageRoomContextualFragment': ManageRoomContextualFragment } }
  ) | null };

export type ManageRoomContextualFragment = { __typename?: 'Room', id: string, activeRound?: { __typename?: 'Round', id: string, slug: string, state: RoundState, deck: { __typename?: 'Deck', id: string, name: string } } | null } & { ' $fragmentName'?: 'ManageRoomContextualFragment' };

export type ManageRoomMessagesFragment = { __typename?: 'Message', content?: JSONObject | null, createdAt: string, id: string, type: MessageContentType, sender: { __typename?: 'User', id: string, name: string } } & { ' $fragmentName'?: 'ManageRoomMessagesFragment' };

export type ManageRoomMessagesSubscriptionSubscriptionVariables = Exact<{
  id: Scalars['ID'];
}>;


export type ManageRoomMessagesSubscriptionSubscription = { __typename?: 'Subscription', messageUpdatesByRoomId: { __typename?: 'MessageUpdate', operation: MessageUpdateOperations, value: (
      { __typename?: 'Message' }
      & { ' $fragmentRefs'?: { 'ManageRoomMessagesFragment': ManageRoomMessagesFragment } }
    ) } };

export type ManageRoomPrimaryInputMutationMutationVariables = Exact<{
  roomId: Scalars['ID'];
  textContent: Scalars['String'];
}>;


export type ManageRoomPrimaryInputMutationMutation = { __typename?: 'Mutation', sendTextMessage: { __typename?: 'Message', id: string } };

export type ManageRoomRoomSetDeckMutationVariables = Exact<{
  deckId: Scalars['ID'];
  id: Scalars['ID'];
}>;


export type ManageRoomRoomSetDeckMutation = { __typename?: 'Mutation', roomSetDeck: { __typename?: 'Room', id: string, activeRound?: { __typename?: 'Round', id: string, slug: string, deck: { __typename?: 'Deck', id: string, name: string } } | null } };

export type InitializeOauthSigninMutationMutationVariables = Exact<{ [key: string]: never; }>;


export type InitializeOauthSigninMutationMutation = { __typename?: 'Mutation', initializeOauthSignin: string };

export type RefreshMutationMutationVariables = Exact<{
  token: Scalars['JWT'];
}>;


export type RefreshMutationMutation = { __typename?: 'Mutation', refresh?: { __typename?: 'SessionInfo', currentUser: JSONObject, token: string } | null };

export type UseQueryDecksQueryVariables = Exact<{
  after?: InputMaybe<Scalars['ID']>;
  before?: InputMaybe<Scalars['ID']>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  input: DecksQueryInput;
}>;


export type UseQueryDecksQuery = { __typename?: 'Query', decks: { __typename?: 'QueryDecksConnection', edges: Array<{ __typename?: 'QueryDecksConnectionEdge', cursor: string, node: { __typename?: 'Deck', id: string } } | null>, pageInfo: { __typename?: 'PageInfo', endCursor?: string | null, hasNextPage: boolean, hasPreviousPage: boolean, startCursor?: string | null } } };

export type AuthRefreshMutationMutationVariables = Exact<{
  token: Scalars['JWT'];
}>;


export type AuthRefreshMutationMutation = { __typename?: 'Mutation', refresh?: { __typename?: 'SessionInfo', currentUser: JSONObject, token: string } | null };

export const DeckSummaryContentFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"DeckSummaryContent"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Deck"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"subdecksCount"}},{"kind":"Field","name":{"kind":"Name","value":"cardsDirectCount"}},{"kind":"Field","name":{"kind":"Name","value":"editedAt"}}]}}]} as unknown as DocumentNode<DeckSummaryContentFragment, unknown>;
export const UserProfileFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"UserProfile"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"User"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"bio"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]} as unknown as DocumentNode<UserProfileFragment, unknown>;
export const RoomNotificationsRoomItemFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"RoomNotificationsRoomItem"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Room"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"occupants"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"activeRound"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"deck"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]}}]} as unknown as DocumentNode<RoomNotificationsRoomItemFragment, unknown>;
export const DeckCompactSummaryContentFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"DeckCompactSummaryContent"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Deck"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"subdecksCount"}},{"kind":"Field","name":{"kind":"Name","value":"cardsDirectCount"}}]}}]} as unknown as DocumentNode<DeckCompactSummaryContentFragment, unknown>;
export const UserDecksSummaryDeckItemFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"UserDecksSummaryDeckItem"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Deck"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"editedAt"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"DeckCompactSummaryContent"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"DeckCompactSummaryContent"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Deck"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"subdecksCount"}},{"kind":"Field","name":{"kind":"Name","value":"cardsDirectCount"}}]}}]} as unknown as DocumentNode<UserDecksSummaryDeckItemFragment, unknown>;
export const ManageDeckFrontMatterFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ManageDeckFrontMatter"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Deck"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"description"}}]}}]} as unknown as DocumentNode<ManageDeckFrontMatterFragment, unknown>;
export const ManageDeckAdditionalInfoFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ManageDeckAdditionalInfo"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Deck"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"editedAt"}}]}}]} as unknown as DocumentNode<ManageDeckAdditionalInfoFragment, unknown>;
export const ManageDeckCardsUploadReviewFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ManageDeckCardsUploadReview"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Deck"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"cardsDirectCount"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]} as unknown as DocumentNode<ManageDeckCardsUploadReviewFragment, unknown>;
export const SubdeckListItemContentFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"SubdeckListItemContent"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Deck"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"DeckCompactSummaryContent"}},{"kind":"Field","name":{"kind":"Name","value":"id"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"DeckCompactSummaryContent"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Deck"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"subdecksCount"}},{"kind":"Field","name":{"kind":"Name","value":"cardsDirectCount"}}]}}]} as unknown as DocumentNode<SubdeckListItemContentFragment, unknown>;
export const ManageDeckSubdecksFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ManageDeckSubdecks"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Deck"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"subdecks"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"SubdeckListItemContent"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"DeckCompactSummaryContent"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Deck"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"subdecksCount"}},{"kind":"Field","name":{"kind":"Name","value":"cardsDirectCount"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"SubdeckListItemContent"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Deck"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"DeckCompactSummaryContent"}},{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]} as unknown as DocumentNode<ManageDeckSubdecksFragment, unknown>;
export const ManageCardFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ManageCard"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Card"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"answers"}},{"kind":"Field","name":{"kind":"Name","value":"fullAnswer"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"isPrimaryTemplate"}},{"kind":"Field","name":{"kind":"Name","value":"isTemplate"}},{"kind":"Field","name":{"kind":"Name","value":"prompt"}}]}}]} as unknown as DocumentNode<ManageCardFragment, unknown>;
export const ManageDeckCardsFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ManageDeckCards"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Deck"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"cardsDirect"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"after"},"value":{"kind":"Variable","name":{"kind":"Name","value":"after"}}},{"kind":"Argument","name":{"kind":"Name","value":"before"},"value":{"kind":"Variable","name":{"kind":"Name","value":"before"}}},{"kind":"Argument","name":{"kind":"Name","value":"first"},"value":{"kind":"Variable","name":{"kind":"Name","value":"first"}}},{"kind":"Argument","name":{"kind":"Name","value":"last"},"value":{"kind":"Variable","name":{"kind":"Name","value":"last"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"edges"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"cursor"}},{"kind":"Field","name":{"kind":"Name","value":"node"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"ManageCard"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"pageInfo"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"hasNextPage"}},{"kind":"Field","name":{"kind":"Name","value":"hasPreviousPage"}},{"kind":"Field","name":{"kind":"Name","value":"startCursor"}},{"kind":"Field","name":{"kind":"Name","value":"endCursor"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"cardsDirectCount"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ManageCard"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Card"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"answers"}},{"kind":"Field","name":{"kind":"Name","value":"fullAnswer"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"isPrimaryTemplate"}},{"kind":"Field","name":{"kind":"Name","value":"isTemplate"}},{"kind":"Field","name":{"kind":"Name","value":"prompt"}}]}}]} as unknown as DocumentNode<ManageDeckCardsFragment, unknown>;
export const ManageDeckContentFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ManageDeckContent"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Deck"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"editedAt"}},{"kind":"Field","name":{"kind":"Name","value":"cardsDirectCount"}},{"kind":"Field","name":{"kind":"Name","value":"subdecksCount"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"ManageDeckCardsUploadReview"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"ManageDeckSubdecks"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"ManageDeckCards"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"DeckCompactSummaryContent"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Deck"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"subdecksCount"}},{"kind":"Field","name":{"kind":"Name","value":"cardsDirectCount"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"SubdeckListItemContent"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Deck"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"DeckCompactSummaryContent"}},{"kind":"Field","name":{"kind":"Name","value":"id"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ManageCard"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Card"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"answers"}},{"kind":"Field","name":{"kind":"Name","value":"fullAnswer"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"isPrimaryTemplate"}},{"kind":"Field","name":{"kind":"Name","value":"isTemplate"}},{"kind":"Field","name":{"kind":"Name","value":"prompt"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ManageDeckCardsUploadReview"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Deck"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"cardsDirectCount"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ManageDeckSubdecks"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Deck"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"subdecks"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"SubdeckListItemContent"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ManageDeckCards"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Deck"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"cardsDirect"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"after"},"value":{"kind":"Variable","name":{"kind":"Name","value":"after"}}},{"kind":"Argument","name":{"kind":"Name","value":"before"},"value":{"kind":"Variable","name":{"kind":"Name","value":"before"}}},{"kind":"Argument","name":{"kind":"Name","value":"first"},"value":{"kind":"Variable","name":{"kind":"Name","value":"first"}}},{"kind":"Argument","name":{"kind":"Name","value":"last"},"value":{"kind":"Variable","name":{"kind":"Name","value":"last"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"edges"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"cursor"}},{"kind":"Field","name":{"kind":"Name","value":"node"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"ManageCard"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"pageInfo"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"hasNextPage"}},{"kind":"Field","name":{"kind":"Name","value":"hasPreviousPage"}},{"kind":"Field","name":{"kind":"Name","value":"startCursor"}},{"kind":"Field","name":{"kind":"Name","value":"endCursor"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"cardsDirectCount"}}]}}]} as unknown as DocumentNode<ManageDeckContentFragment, unknown>;
export const ManageDeckFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ManageDeck"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Deck"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"ManageDeckFrontMatter"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"ManageDeckAdditionalInfo"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"ManageDeckContent"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ManageDeckCardsUploadReview"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Deck"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"cardsDirectCount"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"DeckCompactSummaryContent"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Deck"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"subdecksCount"}},{"kind":"Field","name":{"kind":"Name","value":"cardsDirectCount"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"SubdeckListItemContent"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Deck"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"DeckCompactSummaryContent"}},{"kind":"Field","name":{"kind":"Name","value":"id"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ManageDeckSubdecks"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Deck"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"subdecks"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"SubdeckListItemContent"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ManageCard"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Card"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"answers"}},{"kind":"Field","name":{"kind":"Name","value":"fullAnswer"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"isPrimaryTemplate"}},{"kind":"Field","name":{"kind":"Name","value":"isTemplate"}},{"kind":"Field","name":{"kind":"Name","value":"prompt"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ManageDeckCards"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Deck"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"cardsDirect"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"after"},"value":{"kind":"Variable","name":{"kind":"Name","value":"after"}}},{"kind":"Argument","name":{"kind":"Name","value":"before"},"value":{"kind":"Variable","name":{"kind":"Name","value":"before"}}},{"kind":"Argument","name":{"kind":"Name","value":"first"},"value":{"kind":"Variable","name":{"kind":"Name","value":"first"}}},{"kind":"Argument","name":{"kind":"Name","value":"last"},"value":{"kind":"Variable","name":{"kind":"Name","value":"last"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"edges"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"cursor"}},{"kind":"Field","name":{"kind":"Name","value":"node"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"ManageCard"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"pageInfo"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"hasNextPage"}},{"kind":"Field","name":{"kind":"Name","value":"hasPreviousPage"}},{"kind":"Field","name":{"kind":"Name","value":"startCursor"}},{"kind":"Field","name":{"kind":"Name","value":"endCursor"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"cardsDirectCount"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ManageDeckFrontMatter"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Deck"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"description"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ManageDeckAdditionalInfo"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Deck"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"editedAt"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ManageDeckContent"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Deck"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"editedAt"}},{"kind":"Field","name":{"kind":"Name","value":"cardsDirectCount"}},{"kind":"Field","name":{"kind":"Name","value":"subdecksCount"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"ManageDeckCardsUploadReview"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"ManageDeckSubdecks"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"ManageDeckCards"}}]}}]} as unknown as DocumentNode<ManageDeckFragment, unknown>;
export const PersonalProfileFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"PersonalProfile"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"User"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"bio"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]} as unknown as DocumentNode<PersonalProfileFragment, unknown>;
export const ManageRoomContextualFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ManageRoomContextual"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Room"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"activeRound"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"deck"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"state"}}]}}]}}]} as unknown as DocumentNode<ManageRoomContextualFragment, unknown>;
export const ManageRoomMessagesFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ManageRoomMessages"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Message"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"content"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"sender"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"type"}}]}}]} as unknown as DocumentNode<ManageRoomMessagesFragment, unknown>;
export const FinalizeOauthSigninDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"FinalizeOauthSignin"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"FinalizeOauthSigninMutationInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"finalizeOauthSignin"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"currentUser"}},{"kind":"Field","name":{"kind":"Name","value":"token"}}]}}]}}]} as unknown as DocumentNode<FinalizeOauthSigninMutation, FinalizeOauthSigninMutationVariables>;
export const DeckQueryDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"DeckQuery"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"after"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"first"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"before"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"last"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"deck"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"ManageDeck"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ManageDeckFrontMatter"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Deck"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"description"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ManageDeckAdditionalInfo"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Deck"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"editedAt"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ManageDeckCardsUploadReview"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Deck"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"cardsDirectCount"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"DeckCompactSummaryContent"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Deck"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"subdecksCount"}},{"kind":"Field","name":{"kind":"Name","value":"cardsDirectCount"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"SubdeckListItemContent"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Deck"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"DeckCompactSummaryContent"}},{"kind":"Field","name":{"kind":"Name","value":"id"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ManageDeckSubdecks"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Deck"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"subdecks"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"SubdeckListItemContent"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ManageCard"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Card"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"answers"}},{"kind":"Field","name":{"kind":"Name","value":"fullAnswer"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"isPrimaryTemplate"}},{"kind":"Field","name":{"kind":"Name","value":"isTemplate"}},{"kind":"Field","name":{"kind":"Name","value":"prompt"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ManageDeckCards"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Deck"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"cardsDirect"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"after"},"value":{"kind":"Variable","name":{"kind":"Name","value":"after"}}},{"kind":"Argument","name":{"kind":"Name","value":"before"},"value":{"kind":"Variable","name":{"kind":"Name","value":"before"}}},{"kind":"Argument","name":{"kind":"Name","value":"first"},"value":{"kind":"Variable","name":{"kind":"Name","value":"first"}}},{"kind":"Argument","name":{"kind":"Name","value":"last"},"value":{"kind":"Variable","name":{"kind":"Name","value":"last"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"edges"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"cursor"}},{"kind":"Field","name":{"kind":"Name","value":"node"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"ManageCard"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"pageInfo"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"hasNextPage"}},{"kind":"Field","name":{"kind":"Name","value":"hasPreviousPage"}},{"kind":"Field","name":{"kind":"Name","value":"startCursor"}},{"kind":"Field","name":{"kind":"Name","value":"endCursor"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"cardsDirectCount"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ManageDeckContent"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Deck"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"editedAt"}},{"kind":"Field","name":{"kind":"Name","value":"cardsDirectCount"}},{"kind":"Field","name":{"kind":"Name","value":"subdecksCount"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"ManageDeckCardsUploadReview"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"ManageDeckSubdecks"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"ManageDeckCards"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ManageDeck"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Deck"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"ManageDeckFrontMatter"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"ManageDeckAdditionalInfo"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"ManageDeckContent"}}]}}]} as unknown as DocumentNode<DeckQueryQuery, DeckQueryQueryVariables>;
export const UserQueryDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"UserQuery"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"me"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"PersonalProfile"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"PersonalProfile"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"User"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"bio"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]} as unknown as DocumentNode<UserQueryQuery, UserQueryQueryVariables>;
export const HealthClientOnlyDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"HealthClientOnly"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"health"}}]}}]} as unknown as DocumentNode<HealthClientOnlyQuery, HealthClientOnlyQueryVariables>;
export const RepeatHealthClientOnlyDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"subscription","name":{"kind":"Name","value":"RepeatHealthClientOnly"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"repeatHealth"}}]}}]} as unknown as DocumentNode<RepeatHealthClientOnlySubscription, RepeatHealthClientOnlySubscriptionVariables>;
export const HealthSsgDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"HealthSSG"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"health"}}]}}]} as unknown as DocumentNode<HealthSsgQuery, HealthSsgQueryVariables>;
export const HealthSsrDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"HealthSSR"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"health"}}]}}]} as unknown as DocumentNode<HealthSsrQuery, HealthSsrQueryVariables>;
export const RoomNotificationsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"RoomNotifications"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"occupyingUnarchivedRooms"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"RoomNotificationsRoomItem"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"RoomNotificationsRoomItem"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Room"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"occupants"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"activeRound"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"deck"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]}}]} as unknown as DocumentNode<RoomNotificationsQuery, RoomNotificationsQueryVariables>;
export const UserDecksSummaryNewDeckItemMutationDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UserDecksSummaryNewDeckItemMutation"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"DeckCreateMutationInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"deckCreate"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]} as unknown as DocumentNode<UserDecksSummaryNewDeckItemMutationMutation, UserDecksSummaryNewDeckItemMutationMutationVariables>;
export const UserDecksSummaryQueryDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"UserDecksSummaryQuery"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"after"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"before"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"first"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"last"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"DecksQueryInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"decks"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"after"},"value":{"kind":"Variable","name":{"kind":"Name","value":"after"}}},{"kind":"Argument","name":{"kind":"Name","value":"before"},"value":{"kind":"Variable","name":{"kind":"Name","value":"before"}}},{"kind":"Argument","name":{"kind":"Name","value":"first"},"value":{"kind":"Variable","name":{"kind":"Name","value":"first"}}},{"kind":"Argument","name":{"kind":"Name","value":"last"},"value":{"kind":"Variable","name":{"kind":"Name","value":"last"}}},{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"edges"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"cursor"}},{"kind":"Field","name":{"kind":"Name","value":"node"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"UserDecksSummaryDeckItem"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"pageInfo"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"endCursor"}},{"kind":"Field","name":{"kind":"Name","value":"hasNextPage"}},{"kind":"Field","name":{"kind":"Name","value":"hasPreviousPage"}},{"kind":"Field","name":{"kind":"Name","value":"startCursor"}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"DeckCompactSummaryContent"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Deck"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"subdecksCount"}},{"kind":"Field","name":{"kind":"Name","value":"cardsDirectCount"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"UserDecksSummaryDeckItem"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Deck"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"editedAt"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"DeckCompactSummaryContent"}}]}}]} as unknown as DocumentNode<UserDecksSummaryQueryQuery, UserDecksSummaryQueryQueryVariables>;
export const ManageCardAddNewCardMutationDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"ManageCardAddNewCardMutation"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"deckId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"cards"}},"type":{"kind":"NonNullType","type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CardCreateMutationInput"}}}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"deckAddCards"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"deckId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"deckId"}}},{"kind":"Argument","name":{"kind":"Name","value":"cards"},"value":{"kind":"Variable","name":{"kind":"Name","value":"cards"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]} as unknown as DocumentNode<ManageCardAddNewCardMutationMutation, ManageCardAddNewCardMutationMutationVariables>;
export const ManageCardEditCardMutationDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"ManageCardEditCardMutation"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CardEditMutationInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"cardEdit"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ManageCard"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ManageCard"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Card"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"answers"}},{"kind":"Field","name":{"kind":"Name","value":"fullAnswer"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"isPrimaryTemplate"}},{"kind":"Field","name":{"kind":"Name","value":"isTemplate"}},{"kind":"Field","name":{"kind":"Name","value":"prompt"}}]}}]} as unknown as DocumentNode<ManageCardEditCardMutationMutation, ManageCardEditCardMutationMutationVariables>;
export const ManageCardDeleteCardMutationDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"ManageCardDeleteCardMutation"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"cardDelete"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]} as unknown as DocumentNode<ManageCardDeleteCardMutationMutation, ManageCardDeleteCardMutationMutationVariables>;
export const ManageDeckFrontMatterEditDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"ManageDeckFrontMatterEdit"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"DeckEditMutationInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"deckEdit"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"answerLang"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"promptLang"}}]}}]}}]} as unknown as DocumentNode<ManageDeckFrontMatterEditMutation, ManageDeckFrontMatterEditMutationVariables>;
export const ManageDeckCardsAddCardsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"ManageDeckCardsAddCards"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"deckId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"cards"}},"type":{"kind":"NonNullType","type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CardCreateMutationInput"}}}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"deckAddCards"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"deckId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"deckId"}}},{"kind":"Argument","name":{"kind":"Name","value":"cards"},"value":{"kind":"Variable","name":{"kind":"Name","value":"cards"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]} as unknown as DocumentNode<ManageDeckCardsAddCardsMutation, ManageDeckCardsAddCardsMutationVariables>;
export const ManageDeckSubdecksLinkSubdeckQueryDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"ManageDeckSubdecksLinkSubdeckQuery"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"after"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"before"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"first"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"last"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"DecksQueryInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"decks"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"after"},"value":{"kind":"Variable","name":{"kind":"Name","value":"after"}}},{"kind":"Argument","name":{"kind":"Name","value":"before"},"value":{"kind":"Variable","name":{"kind":"Name","value":"before"}}},{"kind":"Argument","name":{"kind":"Name","value":"first"},"value":{"kind":"Variable","name":{"kind":"Name","value":"first"}}},{"kind":"Argument","name":{"kind":"Name","value":"last"},"value":{"kind":"Variable","name":{"kind":"Name","value":"last"}}},{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"edges"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"cursor"}},{"kind":"Field","name":{"kind":"Name","value":"node"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"SubdeckListItemContent"}},{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"pageInfo"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"endCursor"}},{"kind":"Field","name":{"kind":"Name","value":"hasNextPage"}},{"kind":"Field","name":{"kind":"Name","value":"hasPreviousPage"}},{"kind":"Field","name":{"kind":"Name","value":"startCursor"}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"DeckCompactSummaryContent"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Deck"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"subdecksCount"}},{"kind":"Field","name":{"kind":"Name","value":"cardsDirectCount"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"SubdeckListItemContent"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Deck"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"DeckCompactSummaryContent"}},{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]} as unknown as DocumentNode<ManageDeckSubdecksLinkSubdeckQueryQuery, ManageDeckSubdecksLinkSubdeckQueryQueryVariables>;
export const ManageDeckSubdecksLinkSubdeckAddSubdeckDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"ManageDeckSubdecksLinkSubdeckAddSubdeck"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"deckId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"subdeckId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"deckAddSubdeck"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"deckId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"deckId"}}},{"kind":"Argument","name":{"kind":"Name","value":"subdeckId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"subdeckId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]} as unknown as DocumentNode<ManageDeckSubdecksLinkSubdeckAddSubdeckMutation, ManageDeckSubdecksLinkSubdeckAddSubdeckMutationVariables>;
export const ManageDeckSubdecksLinkSubdeckCreateSubdeckDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"ManageDeckSubdecksLinkSubdeckCreateSubdeck"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"DeckCreateMutationInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"deckCreate"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]} as unknown as DocumentNode<ManageDeckSubdecksLinkSubdeckCreateSubdeckMutation, ManageDeckSubdecksLinkSubdeckCreateSubdeckMutationVariables>;
export const ManageDeckSubdecksBrowseRemoveSubdeckDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"ManageDeckSubdecksBrowseRemoveSubdeck"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"deckId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"subdeckId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"deckRemoveSubdeck"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"deckId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"deckId"}}},{"kind":"Argument","name":{"kind":"Name","value":"subdeckId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"subdeckId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]} as unknown as DocumentNode<ManageDeckSubdecksBrowseRemoveSubdeckMutation, ManageDeckSubdecksBrowseRemoveSubdeckMutationVariables>;
export const ManageDecksNewDeckItemMutationDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"ManageDecksNewDeckItemMutation"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"DeckCreateMutationInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"deckCreate"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]} as unknown as DocumentNode<ManageDecksNewDeckItemMutationMutation, ManageDecksNewDeckItemMutationMutationVariables>;
export const RecentDecksQueryDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"RecentDecksQuery"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"after"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"before"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"first"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"last"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"DecksQueryInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"decks"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"after"},"value":{"kind":"Variable","name":{"kind":"Name","value":"after"}}},{"kind":"Argument","name":{"kind":"Name","value":"before"},"value":{"kind":"Variable","name":{"kind":"Name","value":"before"}}},{"kind":"Argument","name":{"kind":"Name","value":"first"},"value":{"kind":"Variable","name":{"kind":"Name","value":"first"}}},{"kind":"Argument","name":{"kind":"Name","value":"last"},"value":{"kind":"Variable","name":{"kind":"Name","value":"last"}}},{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"edges"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"cursor"}},{"kind":"Field","name":{"kind":"Name","value":"node"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"DeckCompactSummaryContent"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"pageInfo"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"endCursor"}},{"kind":"Field","name":{"kind":"Name","value":"hasNextPage"}},{"kind":"Field","name":{"kind":"Name","value":"hasPreviousPage"}},{"kind":"Field","name":{"kind":"Name","value":"startCursor"}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"DeckCompactSummaryContent"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Deck"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"subdecksCount"}},{"kind":"Field","name":{"kind":"Name","value":"cardsDirectCount"}}]}}]} as unknown as DocumentNode<RecentDecksQueryQuery, RecentDecksQueryQueryVariables>;
export const SearchDecksDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"SearchDecks"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"after"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"before"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"first"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"last"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"DecksQueryInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"decks"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"after"},"value":{"kind":"Variable","name":{"kind":"Name","value":"after"}}},{"kind":"Argument","name":{"kind":"Name","value":"before"},"value":{"kind":"Variable","name":{"kind":"Name","value":"before"}}},{"kind":"Argument","name":{"kind":"Name","value":"first"},"value":{"kind":"Variable","name":{"kind":"Name","value":"first"}}},{"kind":"Argument","name":{"kind":"Name","value":"last"},"value":{"kind":"Variable","name":{"kind":"Name","value":"last"}}},{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"edges"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"cursor"}},{"kind":"Field","name":{"kind":"Name","value":"node"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"DeckSummaryContent"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"pageInfo"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"endCursor"}},{"kind":"Field","name":{"kind":"Name","value":"hasNextPage"}},{"kind":"Field","name":{"kind":"Name","value":"hasPreviousPage"}},{"kind":"Field","name":{"kind":"Name","value":"startCursor"}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"DeckSummaryContent"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Deck"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"subdecksCount"}},{"kind":"Field","name":{"kind":"Name","value":"cardsDirectCount"}},{"kind":"Field","name":{"kind":"Name","value":"editedAt"}}]}}]} as unknown as DocumentNode<SearchDecksQuery, SearchDecksQueryVariables>;
export const PersonalProfileEditDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"PersonalProfileEdit"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"OwnProfileEditMutationInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"ownProfileEdit"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"PersonalProfile"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"PersonalProfile"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"User"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"bio"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]} as unknown as DocumentNode<PersonalProfileEditMutation, PersonalProfileEditMutationVariables>;
export const ManageRoomQueryDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"ManageRoomQuery"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"room"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"ManageRoomContextual"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ManageRoomContextual"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Room"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"activeRound"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"deck"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"state"}}]}}]}}]} as unknown as DocumentNode<ManageRoomQueryQuery, ManageRoomQueryQueryVariables>;
export const ManageRoomMessagesSubscriptionDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"subscription","name":{"kind":"Name","value":"ManageRoomMessagesSubscription"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"messageUpdatesByRoomId"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"operation"}},{"kind":"Field","name":{"kind":"Name","value":"value"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ManageRoomMessages"}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ManageRoomMessages"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Message"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"content"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"sender"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"type"}}]}}]} as unknown as DocumentNode<ManageRoomMessagesSubscriptionSubscription, ManageRoomMessagesSubscriptionSubscriptionVariables>;
export const ManageRoomPrimaryInputMutationDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"ManageRoomPrimaryInputMutation"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"roomId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"textContent"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"sendTextMessage"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"roomId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"roomId"}}},{"kind":"Argument","name":{"kind":"Name","value":"textContent"},"value":{"kind":"Variable","name":{"kind":"Name","value":"textContent"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]} as unknown as DocumentNode<ManageRoomPrimaryInputMutationMutation, ManageRoomPrimaryInputMutationMutationVariables>;
export const ManageRoomRoomSetDeckDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"ManageRoomRoomSetDeck"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"deckId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"roomSetDeck"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"deckId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"deckId"}}},{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"activeRound"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"deck"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"slug"}}]}}]}}]}}]} as unknown as DocumentNode<ManageRoomRoomSetDeckMutation, ManageRoomRoomSetDeckMutationVariables>;
export const InitializeOauthSigninMutationDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"InitializeOauthSigninMutation"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"initializeOauthSignin"}}]}}]} as unknown as DocumentNode<InitializeOauthSigninMutationMutation, InitializeOauthSigninMutationMutationVariables>;
export const RefreshMutationDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"RefreshMutation"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"token"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"JWT"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"refresh"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"token"},"value":{"kind":"Variable","name":{"kind":"Name","value":"token"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"currentUser"}},{"kind":"Field","name":{"kind":"Name","value":"token"}}]}}]}}]} as unknown as DocumentNode<RefreshMutationMutation, RefreshMutationMutationVariables>;
export const UseQueryDecksDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"UseQueryDecks"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"after"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"before"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"first"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"last"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"DecksQueryInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"decks"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"after"},"value":{"kind":"Variable","name":{"kind":"Name","value":"after"}}},{"kind":"Argument","name":{"kind":"Name","value":"before"},"value":{"kind":"Variable","name":{"kind":"Name","value":"before"}}},{"kind":"Argument","name":{"kind":"Name","value":"first"},"value":{"kind":"Variable","name":{"kind":"Name","value":"first"}}},{"kind":"Argument","name":{"kind":"Name","value":"last"},"value":{"kind":"Variable","name":{"kind":"Name","value":"last"}}},{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"edges"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"cursor"}},{"kind":"Field","name":{"kind":"Name","value":"node"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"pageInfo"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"endCursor"}},{"kind":"Field","name":{"kind":"Name","value":"hasNextPage"}},{"kind":"Field","name":{"kind":"Name","value":"hasPreviousPage"}},{"kind":"Field","name":{"kind":"Name","value":"startCursor"}}]}}]}}]}}]} as unknown as DocumentNode<UseQueryDecksQuery, UseQueryDecksQueryVariables>;
export const AuthRefreshMutationDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"AuthRefreshMutation"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"token"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"JWT"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"refresh"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"token"},"value":{"kind":"Variable","name":{"kind":"Name","value":"token"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"currentUser"}},{"kind":"Field","name":{"kind":"Name","value":"token"}}]}}]}}]} as unknown as DocumentNode<AuthRefreshMutationMutation, AuthRefreshMutationMutationVariables>;