/* eslint-disable */
import { JSONValue, JSONObject } from '../../src/types/jsonTypes'
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

export type CardCreateInput = {
  answers: Array<Scalars['String']>;
  fullAnswer: Scalars['JSONObject'];
  isTemplate: Scalars['Boolean'];
  prompt: Scalars['JSONObject'];
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
  subdecks: DeckSubdecksConnection;
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


export type DeckSubdecksArgs = {
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

export type DeckSubdecksConnection = {
  __typename?: 'DeckSubdecksConnection';
  edges: Array<Maybe<DeckSubdecksConnectionEdge>>;
  pageInfo: PageInfo;
};

export type DeckSubdecksConnectionEdge = {
  __typename?: 'DeckSubdecksConnectionEdge';
  cursor: Scalars['ID'];
  node: Deck;
};

/** ownership type of of decks returned */
export enum DecksQueryScope {
  Owned = 'OWNED',
  Visible = 'VISIBLE'
}

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
  card: CardCreateInput;
  deckId: Scalars['ID'];
  isPrimaryTemplate?: InputMaybe<Scalars['Boolean']>;
};


export type MutationCardDeleteArgs = {
  id: Scalars['ID'];
};


export type MutationCardEditArgs = {
  cardInput?: InputMaybe<CardCreateInput>;
  id: Scalars['ID'];
  isPrimaryTemplate?: InputMaybe<Scalars['Boolean']>;
};


export type MutationDeckAddCardsArgs = {
  cards: Array<CardCreateInput>;
  deckId: Scalars['ID'];
};


export type MutationDeckAddSubdeckArgs = {
  deckId: Scalars['ID'];
  subdeckId: Scalars['ID'];
};


export type MutationDeckCreateArgs = {
  answerLang: Scalars['String'];
  cards: Array<CardCreateInput>;
  description?: InputMaybe<Scalars['JSONObject']>;
  name: Scalars['String'];
  notes?: InputMaybe<Scalars['JSONObject']>;
  parentDeckId?: InputMaybe<Scalars['ID']>;
  promptLang: Scalars['String'];
  published?: InputMaybe<Scalars['Boolean']>;
};


export type MutationDeckDeleteArgs = {
  deckId: Scalars['ID'];
};


export type MutationDeckEditArgs = {
  answerLang?: InputMaybe<Scalars['String']>;
  description?: InputMaybe<Scalars['JSONObject']>;
  id: Scalars['ID'];
  name?: InputMaybe<Scalars['String']>;
  notes?: InputMaybe<Scalars['JSONObject']>;
  promptLang?: InputMaybe<Scalars['String']>;
};


export type MutationDeckRemoveSubdeckArgs = {
  deckId: Scalars['ID'];
  subdeckId: Scalars['ID'];
};


export type MutationFinalizeOauthSigninArgs = {
  code: Scalars['String'];
  nonce: Scalars['String'];
  provider: Scalars['String'];
  redirect_uri: Scalars['String'];
};


export type MutationOwnProfileEditArgs = {
  bio?: InputMaybe<Scalars['JSONObject']>;
  isPublic?: InputMaybe<Scalars['Boolean']>;
  name?: InputMaybe<Scalars['String']>;
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
  last?: InputMaybe<Scalars['Int']>;
  scope?: InputMaybe<DecksQueryScope>;
  stoplist?: InputMaybe<Array<Scalars['ID']>>;
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

export type DeckCreateEmptyMutationVariables = Exact<{
  answerLang: Scalars['String'];
  cards: Array<CardCreateInput> | CardCreateInput;
  description?: InputMaybe<Scalars['JSONObject']>;
  name: Scalars['String'];
  notes?: InputMaybe<Scalars['JSONObject']>;
  parentDeckId?: InputMaybe<Scalars['ID']>;
  promptLang: Scalars['String'];
  published?: InputMaybe<Scalars['Boolean']>;
}>;


export type DeckCreateEmptyMutation = { __typename?: 'Mutation', deckCreate: { __typename?: 'Deck', id: string, answerLang: string, description?: JSONObject | null, editedAt: string, name: string, promptLang: string, published: boolean, sortData: Array<string>, owner: { __typename?: 'User', id: string } } };

export type DeckAddSubdeckMutationVariables = Exact<{
  deckId: Scalars['ID'];
  subdeckId: Scalars['ID'];
}>;


export type DeckAddSubdeckMutation = { __typename?: 'Mutation', deckAddSubdeck: { __typename?: 'Deck', id: string } };

export type DeckRemoveSubdeckMutationVariables = Exact<{
  deckId: Scalars['ID'];
  subdeckId: Scalars['ID'];
}>;


export type DeckRemoveSubdeckMutation = { __typename?: 'Mutation', deckRemoveSubdeck: { __typename?: 'Deck', id: string } };

export type DeckEditMutationVariables = Exact<{
  id: Scalars['ID'];
  name?: InputMaybe<Scalars['String']>;
  answerLang?: InputMaybe<Scalars['String']>;
  description?: InputMaybe<Scalars['JSONObject']>;
  notes?: InputMaybe<Scalars['JSONObject']>;
  promptLang?: InputMaybe<Scalars['String']>;
}>;


export type DeckEditMutation = { __typename?: 'Mutation', deckEdit: { __typename?: 'Deck', id: string, name: string } };

export type DeckQueryVariables = Exact<{
  id: Scalars['ID'];
}>;


export type DeckQuery = { __typename?: 'Query', deck: { __typename?: 'Deck', answerLang: string, description?: JSONObject | null, editedAt: string, name: string, promptLang: string, published: boolean, sortData: Array<string>, owner: { __typename?: 'User', id: string } } };

export type DecksQueryVariables = Exact<{
  after?: InputMaybe<Scalars['ID']>;
  before?: InputMaybe<Scalars['ID']>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  scope?: InputMaybe<DecksQueryScope>;
  stoplist?: InputMaybe<Array<Scalars['ID']> | Scalars['ID']>;
}>;


export type DecksQuery = { __typename?: 'Query', decks: { __typename?: 'QueryDecksConnection', edges: Array<{ __typename?: 'QueryDecksConnectionEdge', cursor: string, node: { __typename?: 'Deck', id: string } } | null>, pageInfo: { __typename?: 'PageInfo', endCursor?: string | null, hasNextPage: boolean, hasPreviousPage: boolean, startCursor?: string | null } } };

export type BefriendMutationVariables = Exact<{
  befriendedId: Scalars['ID'];
}>;


export type BefriendMutation = { __typename?: 'Mutation', befriend: { __typename?: 'User', id: string } };

export type HealthQueryVariables = Exact<{ [key: string]: never; }>;


export type HealthQuery = { __typename?: 'Query', health: string };

export type RepeatHealthSubscriptionVariables = Exact<{ [key: string]: never; }>;


export type RepeatHealthSubscription = { __typename?: 'Subscription', repeatHealth: string };

export type SendTextMessageMutationVariables = Exact<{
  roomId: Scalars['ID'];
  textContent: Scalars['String'];
}>;


export type SendTextMessageMutation = { __typename?: 'Mutation', sendTextMessage: { __typename?: 'Message', content?: JSONObject | null, createdAt: string, id: string, type: MessageContentType, sender: { __typename?: 'User', id: string } } };

export type MessageUpdatesByRoomIdSubscriptionVariables = Exact<{
  id: Scalars['ID'];
}>;


export type MessageUpdatesByRoomIdSubscription = { __typename?: 'Subscription', messageUpdatesByRoomId: { __typename?: 'MessageUpdate', operation: MessageUpdateOperations, value: { __typename?: 'Message', content?: JSONObject | null, createdAt: string, id: string, type: MessageContentType, sender: { __typename?: 'User', id: string } } } };

export type RoomCreateMutationVariables = Exact<{ [key: string]: never; }>;


export type RoomCreateMutation = { __typename?: 'Mutation', roomCreate: { __typename?: 'Room', id: string, type: RoomType, activeRound?: { __typename?: 'Round', id: string, isActive: boolean, state: RoundState, slug: string, deck: { __typename?: 'Deck', id: string } } | null, occupants: Array<{ __typename?: 'User', id: string }> } };

export type RoomSetDeckMutationVariables = Exact<{
  id: Scalars['ID'];
  deckId: Scalars['ID'];
}>;


export type RoomSetDeckMutation = { __typename?: 'Mutation', roomSetDeck: { __typename?: 'Room', id: string, type: RoomType, activeRound?: { __typename?: 'Round', id: string, isActive: boolean, state: RoundState, slug: string, deck: { __typename?: 'Deck', id: string } } | null, occupants: Array<{ __typename?: 'User', id: string }> } };

export type RoomStartRoundMutationVariables = Exact<{
  id: Scalars['ID'];
}>;


export type RoomStartRoundMutation = { __typename?: 'Mutation', roomStartRound: { __typename?: 'Room', id: string, type: RoomType, activeRound?: { __typename?: 'Round', id: string, isActive: boolean, state: RoundState, slug: string, deck: { __typename?: 'Deck', id: string } } | null, occupants: Array<{ __typename?: 'User', id: string }> } };

export type RoomEndRoundMutationVariables = Exact<{
  id: Scalars['ID'];
}>;


export type RoomEndRoundMutation = { __typename?: 'Mutation', roomEndRound: { __typename?: 'Room', id: string, type: RoomType, activeRound?: { __typename?: 'Round', id: string, isActive: boolean, state: RoundState, slug: string, deck: { __typename?: 'Deck', id: string } } | null, occupants: Array<{ __typename?: 'User', id: string }> } };

export type RoomArchiveMutationVariables = Exact<{
  id: Scalars['ID'];
}>;


export type RoomArchiveMutation = { __typename?: 'Mutation', roomArchive: { __typename?: 'Room', id: string, type: RoomType, activeRound?: { __typename?: 'Round', id: string, isActive: boolean, state: RoundState, slug: string, deck: { __typename?: 'Deck', id: string } } | null, occupants: Array<{ __typename?: 'User', id: string }> } };

export type RoomJoinMutationVariables = Exact<{
  id: Scalars['ID'];
}>;


export type RoomJoinMutation = { __typename?: 'Mutation', roomJoin: { __typename?: 'Room', id: string, type: RoomType, activeRound?: { __typename?: 'Round', id: string, isActive: boolean, state: RoundState, slug: string, deck: { __typename?: 'Deck', id: string } } | null, occupants: Array<{ __typename?: 'User', id: string }> } };

export type RoomQueryVariables = Exact<{
  id: Scalars['ID'];
}>;


export type RoomQuery = { __typename?: 'Query', room?: { __typename?: 'Room', id: string, type: RoomType, activeRound?: { __typename?: 'Round', id: string, isActive: boolean, state: RoundState, slug: string, deck: { __typename?: 'Deck', id: string } } | null, occupants: Array<{ __typename?: 'User', id: string }> } | null };

export type OccupyingUnarchivedRoomsQueryVariables = Exact<{ [key: string]: never; }>;


export type OccupyingUnarchivedRoomsQuery = { __typename?: 'Query', occupyingUnarchivedRooms?: Array<{ __typename?: 'Room', id: string, type: RoomType, activeRound?: { __typename?: 'Round', id: string, isActive: boolean, state: RoundState, slug: string, deck: { __typename?: 'Deck', id: string } } | null, occupants: Array<{ __typename?: 'User', id: string }> }> | null };

export type RoomUpdatesByRoomIdSubscriptionVariables = Exact<{
  id: Scalars['ID'];
}>;


export type RoomUpdatesByRoomIdSubscription = { __typename?: 'Subscription', roomUpdatesByRoomId: { __typename?: 'RoomUpdate', operation: RoomUpdateOperations, value: { __typename?: 'Room', id: string, type: RoomType, activeRound?: { __typename?: 'Round', id: string, isActive: boolean, state: RoundState, slug: string, deck: { __typename?: 'Deck', id: string } } | null, occupants: Array<{ __typename?: 'User', id: string }> } } };

export type CreateUserMutationVariables = Exact<{
  code: Scalars['String'];
  nonce: Scalars['String'];
  provider: Scalars['String'];
  redirect_uri: Scalars['String'];
}>;


export type CreateUserMutation = { __typename?: 'Mutation', finalizeOauthSignin?: { __typename?: 'SessionInfo', currentUser: JSONObject, token: string } | null };

export type NameUserMutationVariables = Exact<{
  name: Scalars['String'];
}>;


export type NameUserMutation = { __typename?: 'Mutation', ownProfileEdit: { __typename?: 'User', id: string, name: string } };

export type RefreshMutationVariables = Exact<{
  token: Scalars['JWT'];
}>;


export type RefreshMutation = { __typename?: 'Mutation', refresh?: { __typename?: 'SessionInfo', currentUser: JSONObject, token: string } | null };

export type MeQueryVariables = Exact<{ [key: string]: never; }>;


export type MeQuery = { __typename?: 'Query', me?: { __typename?: 'User', isPublic: boolean, name: string, roles: Array<string> } | null };

export type UserEditMutationVariables = Exact<{
  name?: InputMaybe<Scalars['String']>;
  isPublic?: InputMaybe<Scalars['Boolean']>;
}>;


export type UserEditMutation = { __typename?: 'Mutation', ownProfileEdit: { __typename?: 'User', id: string, name: string } };


export const DeckCreateEmptyDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"DeckCreateEmpty"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"answerLang"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"cards"}},"type":{"kind":"NonNullType","type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CardCreateInput"}}}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"description"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"JSONObject"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"name"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"notes"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"JSONObject"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"parentDeckId"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"promptLang"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"published"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"deckCreate"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"answerLang"},"value":{"kind":"Variable","name":{"kind":"Name","value":"answerLang"}}},{"kind":"Argument","name":{"kind":"Name","value":"cards"},"value":{"kind":"Variable","name":{"kind":"Name","value":"cards"}}},{"kind":"Argument","name":{"kind":"Name","value":"description"},"value":{"kind":"Variable","name":{"kind":"Name","value":"description"}}},{"kind":"Argument","name":{"kind":"Name","value":"name"},"value":{"kind":"Variable","name":{"kind":"Name","value":"name"}}},{"kind":"Argument","name":{"kind":"Name","value":"notes"},"value":{"kind":"Variable","name":{"kind":"Name","value":"notes"}}},{"kind":"Argument","name":{"kind":"Name","value":"parentDeckId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"parentDeckId"}}},{"kind":"Argument","name":{"kind":"Name","value":"promptLang"},"value":{"kind":"Variable","name":{"kind":"Name","value":"promptLang"}}},{"kind":"Argument","name":{"kind":"Name","value":"published"},"value":{"kind":"Variable","name":{"kind":"Name","value":"published"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"answerLang"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"editedAt"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"owner"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}},{"kind":"Field","name":{"kind":"Name","value":"promptLang"}},{"kind":"Field","name":{"kind":"Name","value":"published"}},{"kind":"Field","name":{"kind":"Name","value":"sortData"}}]}}]}}]} as unknown as DocumentNode<DeckCreateEmptyMutation, DeckCreateEmptyMutationVariables>;
export const DeckAddSubdeckDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"DeckAddSubdeck"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"deckId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"subdeckId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"deckAddSubdeck"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"deckId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"deckId"}}},{"kind":"Argument","name":{"kind":"Name","value":"subdeckId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"subdeckId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]} as unknown as DocumentNode<DeckAddSubdeckMutation, DeckAddSubdeckMutationVariables>;
export const DeckRemoveSubdeckDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"DeckRemoveSubdeck"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"deckId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"subdeckId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"deckRemoveSubdeck"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"deckId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"deckId"}}},{"kind":"Argument","name":{"kind":"Name","value":"subdeckId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"subdeckId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]} as unknown as DocumentNode<DeckRemoveSubdeckMutation, DeckRemoveSubdeckMutationVariables>;
export const DeckEditDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"DeckEdit"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"name"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"answerLang"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"description"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"JSONObject"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"notes"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"JSONObject"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"promptLang"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"deckEdit"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}},{"kind":"Argument","name":{"kind":"Name","value":"name"},"value":{"kind":"Variable","name":{"kind":"Name","value":"name"}}},{"kind":"Argument","name":{"kind":"Name","value":"answerLang"},"value":{"kind":"Variable","name":{"kind":"Name","value":"answerLang"}}},{"kind":"Argument","name":{"kind":"Name","value":"description"},"value":{"kind":"Variable","name":{"kind":"Name","value":"description"}}},{"kind":"Argument","name":{"kind":"Name","value":"notes"},"value":{"kind":"Variable","name":{"kind":"Name","value":"notes"}}},{"kind":"Argument","name":{"kind":"Name","value":"promptLang"},"value":{"kind":"Variable","name":{"kind":"Name","value":"promptLang"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]} as unknown as DocumentNode<DeckEditMutation, DeckEditMutationVariables>;
export const DeckDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"Deck"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"deck"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"answerLang"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"editedAt"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"owner"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}},{"kind":"Field","name":{"kind":"Name","value":"promptLang"}},{"kind":"Field","name":{"kind":"Name","value":"published"}},{"kind":"Field","name":{"kind":"Name","value":"sortData"}}]}}]}}]} as unknown as DocumentNode<DeckQuery, DeckQueryVariables>;
export const DecksDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"Decks"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"after"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"before"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"first"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"last"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"scope"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"DecksQueryScope"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"stoplist"}},"type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"decks"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"after"},"value":{"kind":"Variable","name":{"kind":"Name","value":"after"}}},{"kind":"Argument","name":{"kind":"Name","value":"before"},"value":{"kind":"Variable","name":{"kind":"Name","value":"before"}}},{"kind":"Argument","name":{"kind":"Name","value":"first"},"value":{"kind":"Variable","name":{"kind":"Name","value":"first"}}},{"kind":"Argument","name":{"kind":"Name","value":"last"},"value":{"kind":"Variable","name":{"kind":"Name","value":"last"}}},{"kind":"Argument","name":{"kind":"Name","value":"scope"},"value":{"kind":"Variable","name":{"kind":"Name","value":"scope"}}},{"kind":"Argument","name":{"kind":"Name","value":"stoplist"},"value":{"kind":"Variable","name":{"kind":"Name","value":"stoplist"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"edges"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"cursor"}},{"kind":"Field","name":{"kind":"Name","value":"node"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"pageInfo"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"endCursor"}},{"kind":"Field","name":{"kind":"Name","value":"hasNextPage"}},{"kind":"Field","name":{"kind":"Name","value":"hasPreviousPage"}},{"kind":"Field","name":{"kind":"Name","value":"startCursor"}}]}}]}}]}}]} as unknown as DocumentNode<DecksQuery, DecksQueryVariables>;
export const BefriendDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"Befriend"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"befriendedId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"befriend"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"befriendedId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"befriendedId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]} as unknown as DocumentNode<BefriendMutation, BefriendMutationVariables>;
export const HealthDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"Health"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"health"}}]}}]} as unknown as DocumentNode<HealthQuery, HealthQueryVariables>;
export const RepeatHealthDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"subscription","name":{"kind":"Name","value":"RepeatHealth"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"repeatHealth"}}]}}]} as unknown as DocumentNode<RepeatHealthSubscription, RepeatHealthSubscriptionVariables>;
export const SendTextMessageDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"SendTextMessage"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"roomId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"textContent"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"sendTextMessage"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"roomId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"roomId"}}},{"kind":"Argument","name":{"kind":"Name","value":"textContent"},"value":{"kind":"Variable","name":{"kind":"Name","value":"textContent"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"content"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"sender"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}},{"kind":"Field","name":{"kind":"Name","value":"type"}}]}}]}}]} as unknown as DocumentNode<SendTextMessageMutation, SendTextMessageMutationVariables>;
export const MessageUpdatesByRoomIdDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"subscription","name":{"kind":"Name","value":"MessageUpdatesByRoomId"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"messageUpdatesByRoomId"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"operation"}},{"kind":"Field","name":{"kind":"Name","value":"value"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"content"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"sender"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}},{"kind":"Field","name":{"kind":"Name","value":"type"}}]}}]}}]}}]} as unknown as DocumentNode<MessageUpdatesByRoomIdSubscription, MessageUpdatesByRoomIdSubscriptionVariables>;
export const RoomCreateDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"RoomCreate"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"roomCreate"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"activeRound"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"deck"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}},{"kind":"Field","name":{"kind":"Name","value":"isActive"}},{"kind":"Field","name":{"kind":"Name","value":"state"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}}]}},{"kind":"Field","name":{"kind":"Name","value":"occupants"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]}}]} as unknown as DocumentNode<RoomCreateMutation, RoomCreateMutationVariables>;
export const RoomSetDeckDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"RoomSetDeck"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"deckId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"roomSetDeck"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}},{"kind":"Argument","name":{"kind":"Name","value":"deckId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"deckId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"activeRound"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"deck"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}},{"kind":"Field","name":{"kind":"Name","value":"isActive"}},{"kind":"Field","name":{"kind":"Name","value":"state"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}}]}},{"kind":"Field","name":{"kind":"Name","value":"occupants"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]}}]} as unknown as DocumentNode<RoomSetDeckMutation, RoomSetDeckMutationVariables>;
export const RoomStartRoundDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"RoomStartRound"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"roomStartRound"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"activeRound"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"deck"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}},{"kind":"Field","name":{"kind":"Name","value":"isActive"}},{"kind":"Field","name":{"kind":"Name","value":"state"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}}]}},{"kind":"Field","name":{"kind":"Name","value":"occupants"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]}}]} as unknown as DocumentNode<RoomStartRoundMutation, RoomStartRoundMutationVariables>;
export const RoomEndRoundDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"RoomEndRound"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"roomEndRound"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"activeRound"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"deck"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}},{"kind":"Field","name":{"kind":"Name","value":"isActive"}},{"kind":"Field","name":{"kind":"Name","value":"state"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}}]}},{"kind":"Field","name":{"kind":"Name","value":"occupants"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]}}]} as unknown as DocumentNode<RoomEndRoundMutation, RoomEndRoundMutationVariables>;
export const RoomArchiveDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"RoomArchive"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"roomArchive"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"activeRound"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"deck"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}},{"kind":"Field","name":{"kind":"Name","value":"isActive"}},{"kind":"Field","name":{"kind":"Name","value":"state"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}}]}},{"kind":"Field","name":{"kind":"Name","value":"occupants"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]}}]} as unknown as DocumentNode<RoomArchiveMutation, RoomArchiveMutationVariables>;
export const RoomJoinDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"RoomJoin"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"roomJoin"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"activeRound"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"deck"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}},{"kind":"Field","name":{"kind":"Name","value":"isActive"}},{"kind":"Field","name":{"kind":"Name","value":"state"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}}]}},{"kind":"Field","name":{"kind":"Name","value":"occupants"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]}}]} as unknown as DocumentNode<RoomJoinMutation, RoomJoinMutationVariables>;
export const RoomDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"Room"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"room"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"activeRound"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"deck"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}},{"kind":"Field","name":{"kind":"Name","value":"isActive"}},{"kind":"Field","name":{"kind":"Name","value":"state"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}}]}},{"kind":"Field","name":{"kind":"Name","value":"occupants"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]}}]} as unknown as DocumentNode<RoomQuery, RoomQueryVariables>;
export const OccupyingUnarchivedRoomsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"OccupyingUnarchivedRooms"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"occupyingUnarchivedRooms"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"activeRound"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"deck"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}},{"kind":"Field","name":{"kind":"Name","value":"isActive"}},{"kind":"Field","name":{"kind":"Name","value":"state"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}}]}},{"kind":"Field","name":{"kind":"Name","value":"occupants"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]}}]} as unknown as DocumentNode<OccupyingUnarchivedRoomsQuery, OccupyingUnarchivedRoomsQueryVariables>;
export const RoomUpdatesByRoomIdDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"subscription","name":{"kind":"Name","value":"RoomUpdatesByRoomId"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"roomUpdatesByRoomId"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"operation"}},{"kind":"Field","name":{"kind":"Name","value":"value"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"activeRound"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"deck"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}},{"kind":"Field","name":{"kind":"Name","value":"isActive"}},{"kind":"Field","name":{"kind":"Name","value":"state"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}}]}},{"kind":"Field","name":{"kind":"Name","value":"occupants"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]}}]}}]} as unknown as DocumentNode<RoomUpdatesByRoomIdSubscription, RoomUpdatesByRoomIdSubscriptionVariables>;
export const CreateUserDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateUser"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"code"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"nonce"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"provider"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"redirect_uri"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"finalizeOauthSignin"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"code"},"value":{"kind":"Variable","name":{"kind":"Name","value":"code"}}},{"kind":"Argument","name":{"kind":"Name","value":"nonce"},"value":{"kind":"Variable","name":{"kind":"Name","value":"nonce"}}},{"kind":"Argument","name":{"kind":"Name","value":"provider"},"value":{"kind":"Variable","name":{"kind":"Name","value":"provider"}}},{"kind":"Argument","name":{"kind":"Name","value":"redirect_uri"},"value":{"kind":"Variable","name":{"kind":"Name","value":"redirect_uri"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"currentUser"}},{"kind":"Field","name":{"kind":"Name","value":"token"}}]}}]}}]} as unknown as DocumentNode<CreateUserMutation, CreateUserMutationVariables>;
export const NameUserDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"NameUser"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"name"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"ownProfileEdit"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"name"},"value":{"kind":"Variable","name":{"kind":"Name","value":"name"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]} as unknown as DocumentNode<NameUserMutation, NameUserMutationVariables>;
export const RefreshDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"Refresh"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"token"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"JWT"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"refresh"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"token"},"value":{"kind":"Variable","name":{"kind":"Name","value":"token"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"currentUser"}},{"kind":"Field","name":{"kind":"Name","value":"token"}}]}}]}}]} as unknown as DocumentNode<RefreshMutation, RefreshMutationVariables>;
export const MeDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"Me"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"me"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"isPublic"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"roles"}}]}}]}}]} as unknown as DocumentNode<MeQuery, MeQueryVariables>;
export const UserEditDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UserEdit"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"name"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"isPublic"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"ownProfileEdit"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"name"},"value":{"kind":"Variable","name":{"kind":"Name","value":"name"}}},{"kind":"Argument","name":{"kind":"Name","value":"isPublic"},"value":{"kind":"Variable","name":{"kind":"Name","value":"isPublic"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]} as unknown as DocumentNode<UserEditMutation, UserEditMutationVariables>;