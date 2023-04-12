import { JSONValue, JSONObject } from "../src/types/jsonTypes";
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = {
  [K in keyof T]: T[K];
};
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & {
  [SubKey in K]?: Maybe<T[SubKey]>;
};
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & {
  [SubKey in K]: Maybe<T[SubKey]>;
};
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
  __typename?: "Card";
  answers: Array<Scalars["String"]>;
  editedAt: Scalars["DateTime"];
  fullAnswer?: Maybe<Scalars["JSONObject"]>;
  id: Scalars["ID"];
  isPrimaryTemplate: Scalars["Boolean"];
  isTemplate: Scalars["Boolean"];
  ownRecordCorrectHistory?: Maybe<Array<Scalars["DateTime"]>>;
  prompt?: Maybe<Scalars["JSONObject"]>;
};

export type CardCreateInput = {
  answers: Array<Scalars["String"]>;
  fullAnswer: Scalars["JSONObject"];
  isTemplate: Scalars["Boolean"];
  prompt: Scalars["JSONObject"];
};

export type Deck = Node & {
  __typename?: "Deck";
  answerLang: Scalars["String"];
  /** all cards directly belonging to some descendant (reflexive, transitive closure of subdeck) deck of this deck */
  cardsAllUnder: DeckCardsAllUnderConnection;
  /** all cards directly belonging to this deck */
  cardsDirect: DeckCardsDirectConnection;
  /** number of all cards directly belonging to this deck */
  cardsDirectCount: Scalars["Int"];
  createdAt: Scalars["DateTime"];
  /** all descendant decks (reflexive, transitive closure of subdeck) of this deck */
  descendantDecks: Array<Deck>;
  description?: Maybe<Scalars["JSONObject"]>;
  editedAt: Scalars["DateTime"];
  id: Scalars["ID"];
  name: Scalars["String"];
  ownRecordNotes?: Maybe<Scalars["JSONObject"]>;
  owner: User;
  promptLang: Scalars["String"];
  published: Scalars["Boolean"];
  sortData: Array<Scalars["String"]>;
  /** all subdecks directly belonging to this deck */
  subdecks: DeckSubdecksConnection;
  subdecksCount: Scalars["Int"];
};

export type DeckCardsAllUnderArgs = {
  after?: InputMaybe<Scalars["ID"]>;
  before?: InputMaybe<Scalars["ID"]>;
  first?: InputMaybe<Scalars["Int"]>;
  last?: InputMaybe<Scalars["Int"]>;
};

export type DeckCardsDirectArgs = {
  after?: InputMaybe<Scalars["ID"]>;
  before?: InputMaybe<Scalars["ID"]>;
  first?: InputMaybe<Scalars["Int"]>;
  last?: InputMaybe<Scalars["Int"]>;
};

export type DeckSubdecksArgs = {
  after?: InputMaybe<Scalars["ID"]>;
  before?: InputMaybe<Scalars["ID"]>;
  first?: InputMaybe<Scalars["Int"]>;
  last?: InputMaybe<Scalars["Int"]>;
};

export type DeckCardsAllUnderConnection = {
  __typename?: "DeckCardsAllUnderConnection";
  edges: Array<Maybe<DeckCardsAllUnderConnectionEdge>>;
  pageInfo: PageInfo;
};

export type DeckCardsAllUnderConnectionEdge = {
  __typename?: "DeckCardsAllUnderConnectionEdge";
  cursor: Scalars["ID"];
  node: Card;
};

export type DeckCardsDirectConnection = {
  __typename?: "DeckCardsDirectConnection";
  edges: Array<Maybe<DeckCardsDirectConnectionEdge>>;
  pageInfo: PageInfo;
};

export type DeckCardsDirectConnectionEdge = {
  __typename?: "DeckCardsDirectConnectionEdge";
  cursor: Scalars["ID"];
  node: Card;
};

export type DeckSubdecksConnection = {
  __typename?: "DeckSubdecksConnection";
  edges: Array<Maybe<DeckSubdecksConnectionEdge>>;
  pageInfo: PageInfo;
};

export type DeckSubdecksConnectionEdge = {
  __typename?: "DeckSubdecksConnectionEdge";
  cursor: Scalars["ID"];
  node: Deck;
};

/** ownership type of of decks returned */
export enum DecksQueryScope {
  Owned = "OWNED",
  Visible = "VISIBLE",
}

export type Friendship = Node & {
  __typename?: "Friendship";
  befriended: User;
  befriender: User;
  createdAt: Scalars["DateTime"];
  id: Scalars["ID"];
  updatedAt: Scalars["DateTime"];
};

export type Message = Node & {
  __typename?: "Message";
  content?: Maybe<Scalars["JSONObject"]>;
  createdAt: Scalars["DateTime"];
  id: Scalars["ID"];
  sender: User;
  type: MessageContentType;
};

export enum MessageContentType {
  Config = "CONFIG",
  ContestScore = "CONTEST_SCORE",
  RoundScore = "ROUND_SCORE",
  RoundStart = "ROUND_START",
  RoundWin = "ROUND_WIN",
  Text = "TEXT",
}

/** A message indicating an operation performed on a message. */
export type MessageUpdate = {
  __typename?: "MessageUpdate";
  operation: MessageUpdateOperations;
  value: Message;
};

/** Names identifying operations that trigger message updates. */
export enum MessageUpdateOperations {
  MessageCreate = "MESSAGE_CREATE",
}

export type Mutation = {
  __typename?: "Mutation";
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
  initializeOauthSignin: Scalars["String"];
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
  befriendedId: Scalars["ID"];
};

export type MutationCardCreateArgs = {
  card: CardCreateInput;
  deckId: Scalars["ID"];
  isPrimaryTemplate?: InputMaybe<Scalars["Boolean"]>;
};

export type MutationCardDeleteArgs = {
  id: Scalars["ID"];
};

export type MutationCardEditArgs = {
  cardInput?: InputMaybe<CardCreateInput>;
  id: Scalars["ID"];
  isPrimaryTemplate?: InputMaybe<Scalars["Boolean"]>;
};

export type MutationDeckAddCardsArgs = {
  cards: Array<CardCreateInput>;
  deckId: Scalars["ID"];
};

export type MutationDeckAddSubdeckArgs = {
  deckId: Scalars["ID"];
  subdeckId: Scalars["ID"];
};

export type MutationDeckCreateArgs = {
  answerLang: Scalars["String"];
  cards: Array<CardCreateInput>;
  description?: InputMaybe<Scalars["JSONObject"]>;
  name: Scalars["String"];
  notes?: InputMaybe<Scalars["JSONObject"]>;
  parentDeckId?: InputMaybe<Scalars["ID"]>;
  promptLang: Scalars["String"];
  published?: InputMaybe<Scalars["Boolean"]>;
};

export type MutationDeckDeleteArgs = {
  deckId: Scalars["ID"];
};

export type MutationDeckEditArgs = {
  answerLang?: InputMaybe<Scalars["String"]>;
  description?: InputMaybe<Scalars["JSONObject"]>;
  id: Scalars["ID"];
  name?: InputMaybe<Scalars["String"]>;
  notes?: InputMaybe<Scalars["JSONObject"]>;
  promptLang?: InputMaybe<Scalars["String"]>;
};

export type MutationDeckRemoveSubdeckArgs = {
  deckId: Scalars["ID"];
  subdeckId: Scalars["ID"];
};

export type MutationFinalizeOauthSigninArgs = {
  code: Scalars["String"];
  nonce: Scalars["String"];
  provider: Scalars["String"];
  redirect_uri: Scalars["String"];
};

export type MutationOwnProfileEditArgs = {
  bio?: InputMaybe<Scalars["JSONObject"]>;
  isPublic?: InputMaybe<Scalars["Boolean"]>;
  name?: InputMaybe<Scalars["String"]>;
};

export type MutationRecordCorrectAnswerArgs = {
  id: Scalars["ID"];
};

export type MutationRefreshArgs = {
  token: Scalars["JWT"];
};

export type MutationRoomArchiveArgs = {
  id: Scalars["ID"];
};

export type MutationRoomEndRoundArgs = {
  id: Scalars["ID"];
};

export type MutationRoomJoinArgs = {
  id: Scalars["ID"];
};

export type MutationRoomSetDeckArgs = {
  deckId: Scalars["ID"];
  id: Scalars["ID"];
};

export type MutationRoomStartRoundArgs = {
  id: Scalars["ID"];
};

export type MutationSendTextMessageArgs = {
  roomId: Scalars["ID"];
  textContent: Scalars["String"];
};

export type MutationSetOwnNotesArgs = {
  deckId: Scalars["ID"];
  notes: Scalars["JSONObject"];
};

export type Node = {
  id: Scalars["ID"];
};

export type PageInfo = {
  __typename?: "PageInfo";
  endCursor?: Maybe<Scalars["ID"]>;
  hasNextPage: Scalars["Boolean"];
  hasPreviousPage: Scalars["Boolean"];
  startCursor?: Maybe<Scalars["ID"]>;
};

export type Query = {
  __typename?: "Query";
  deck: Deck;
  decks: QueryDecksConnection;
  health: Scalars["String"];
  me?: Maybe<User>;
  node?: Maybe<Node>;
  nodes: Array<Maybe<Node>>;
  occupyingUnarchivedRooms?: Maybe<Array<Room>>;
  room?: Maybe<Room>;
  roomBySlug?: Maybe<Room>;
};

export type QueryDeckArgs = {
  id: Scalars["ID"];
};

export type QueryDecksArgs = {
  after?: InputMaybe<Scalars["ID"]>;
  before?: InputMaybe<Scalars["ID"]>;
  first?: InputMaybe<Scalars["Int"]>;
  last?: InputMaybe<Scalars["Int"]>;
  scope?: InputMaybe<DecksQueryScope>;
  stoplist?: InputMaybe<Array<Scalars["ID"]>>;
};

export type QueryNodeArgs = {
  id: Scalars["ID"];
};

export type QueryNodesArgs = {
  ids: Array<Scalars["ID"]>;
};

export type QueryRoomArgs = {
  id: Scalars["ID"];
};

export type QueryRoomBySlugArgs = {
  slug: Scalars["String"];
};

export type QueryDecksConnection = {
  __typename?: "QueryDecksConnection";
  edges: Array<Maybe<QueryDecksConnectionEdge>>;
  pageInfo: PageInfo;
};

export type QueryDecksConnectionEdge = {
  __typename?: "QueryDecksConnectionEdge";
  cursor: Scalars["ID"];
  node: Deck;
};

export type Room = Node & {
  __typename?: "Room";
  activeRound?: Maybe<Round>;
  id: Scalars["ID"];
  messageCount: Scalars["Int"];
  messages: RoomMessagesConnection;
  occupants: Array<User>;
  occupantsCount: Scalars["Int"];
  type: RoomType;
};

export type RoomMessagesArgs = {
  after?: InputMaybe<Scalars["ID"]>;
  before?: InputMaybe<Scalars["ID"]>;
  first?: InputMaybe<Scalars["Int"]>;
  last?: InputMaybe<Scalars["Int"]>;
};

export type RoomMessagesConnection = {
  __typename?: "RoomMessagesConnection";
  edges: Array<Maybe<RoomMessagesConnectionEdge>>;
  pageInfo: PageInfo;
};

export type RoomMessagesConnectionEdge = {
  __typename?: "RoomMessagesConnectionEdge";
  cursor: Scalars["ID"];
  node: Message;
};

export enum RoomType {
  Ephemeral = "EPHEMERAL",
  Persistent = "PERSISTENT",
}

/** A message indicating an operation performed on a room. */
export type RoomUpdate = {
  __typename?: "RoomUpdate";
  operation: RoomUpdateOperations;
  value: Room;
};

/** Keys identifying operations that trigger room updates. */
export enum RoomUpdateOperations {
  RoomArchive = "ROOM_ARCHIVE",
  RoomEndRound = "ROOM_END_ROUND",
  RoomJoin = "ROOM_JOIN",
  RoomSetDeck = "ROOM_SET_DECK",
  RoomStartRound = "ROOM_START_ROUND",
}

export type Round = Node & {
  __typename?: "Round";
  deck: Deck;
  id: Scalars["ID"];
  isActive: Scalars["Boolean"];
  slug: Scalars["String"];
  state: RoundState;
};

export enum RoundState {
  Playing = "PLAYING",
  Waiting = "WAITING",
}

/** A token and its contained information */
export type SessionInfo = {
  __typename?: "SessionInfo";
  currentUser: Scalars["JSONObject"];
  token: Scalars["JWT"];
};

export type Subdeck = Node & {
  __typename?: "Subdeck";
  createdAt: Scalars["DateTime"];
  id: Scalars["ID"];
  parentDeck: Deck;
  subdeck: Deck;
  updatedAt: Scalars["DateTime"];
};

export type Subscription = {
  __typename?: "Subscription";
  messageUpdatesByRoomId: MessageUpdate;
  repeatHealth: Scalars["String"];
  roomUpdatesByRoomId: RoomUpdate;
};

export type SubscriptionMessageUpdatesByRoomIdArgs = {
  id: Scalars["ID"];
};

export type SubscriptionRoomUpdatesByRoomIdArgs = {
  id: Scalars["ID"];
};

export type User = Node & {
  __typename?: "User";
  /** users this user has befriended */
  befriendeds: UserBefriendedsConnection;
  befriendedsCount: Scalars["Int"];
  /** users that have befriended this user and you */
  befrienders: UserBefriendersConnection;
  befriendersCount: Scalars["Int"];
  bio?: Maybe<Scalars["JSONObject"]>;
  decks: UserDecksConnection;
  facebookId?: Maybe<Scalars["String"]>;
  googleId?: Maybe<Scalars["String"]>;
  id: Scalars["ID"];
  /** whether the user's profile information is accessible by non-friends and searchable */
  isPublic: Scalars["Boolean"];
  /** users befriending you that this user has befriended; upon own user gives your mutual friends */
  mutualBefriendeds: UserMutualBefriendedsConnection;
  name: Scalars["String"];
  roles: Array<Scalars["String"]>;
};

export type UserBefriendedsArgs = {
  after?: InputMaybe<Scalars["ID"]>;
  before?: InputMaybe<Scalars["ID"]>;
  first?: InputMaybe<Scalars["Int"]>;
  last?: InputMaybe<Scalars["Int"]>;
};

export type UserBefriendersArgs = {
  after?: InputMaybe<Scalars["ID"]>;
  before?: InputMaybe<Scalars["ID"]>;
  first?: InputMaybe<Scalars["Int"]>;
  last?: InputMaybe<Scalars["Int"]>;
};

export type UserDecksArgs = {
  after?: InputMaybe<Scalars["ID"]>;
  before?: InputMaybe<Scalars["ID"]>;
  first?: InputMaybe<Scalars["Int"]>;
  last?: InputMaybe<Scalars["Int"]>;
};

export type UserMutualBefriendedsArgs = {
  after?: InputMaybe<Scalars["ID"]>;
  before?: InputMaybe<Scalars["ID"]>;
  first?: InputMaybe<Scalars["Int"]>;
  last?: InputMaybe<Scalars["Int"]>;
};

export type UserBefriendedsConnection = {
  __typename?: "UserBefriendedsConnection";
  edges: Array<Maybe<UserBefriendedsConnectionEdge>>;
  pageInfo: PageInfo;
};

export type UserBefriendedsConnectionEdge = {
  __typename?: "UserBefriendedsConnectionEdge";
  cursor: Scalars["ID"];
  node: User;
};

export type UserBefriendersConnection = {
  __typename?: "UserBefriendersConnection";
  edges: Array<Maybe<UserBefriendersConnectionEdge>>;
  pageInfo: PageInfo;
};

export type UserBefriendersConnectionEdge = {
  __typename?: "UserBefriendersConnectionEdge";
  cursor: Scalars["ID"];
  node: User;
};

export type UserDecksConnection = {
  __typename?: "UserDecksConnection";
  edges: Array<Maybe<UserDecksConnectionEdge>>;
  pageInfo: PageInfo;
};

export type UserDecksConnectionEdge = {
  __typename?: "UserDecksConnectionEdge";
  cursor: Scalars["ID"];
  node: Deck;
};

export type UserMutualBefriendedsConnection = {
  __typename?: "UserMutualBefriendedsConnection";
  edges: Array<Maybe<UserMutualBefriendedsConnectionEdge>>;
  pageInfo: PageInfo;
};

export type UserMutualBefriendedsConnectionEdge = {
  __typename?: "UserMutualBefriendedsConnectionEdge";
  cursor: Scalars["ID"];
  node: User;
};

export type DeckCreateEmptyMutationVariables = Exact<{
  answerLang: Scalars["String"];
  cards: Array<CardCreateInput> | CardCreateInput;
  description?: InputMaybe<Scalars["JSONObject"]>;
  name: Scalars["String"];
  notes?: InputMaybe<Scalars["JSONObject"]>;
  parentDeckId?: InputMaybe<Scalars["ID"]>;
  promptLang: Scalars["String"];
  published?: InputMaybe<Scalars["Boolean"]>;
}>;

export type DeckCreateEmptyMutation = {
  __typename?: "Mutation";
  deckCreate: {
    __typename?: "Deck";
    id: string;
    answerLang: string;
    description?: JSONObject | null;
    editedAt: string;
    name: string;
    promptLang: string;
    published: boolean;
    sortData: Array<string>;
    owner: { __typename?: "User"; id: string };
  };
};

export type DeckAddSubdeckMutationVariables = Exact<{
  deckId: Scalars["ID"];
  subdeckId: Scalars["ID"];
}>;

export type DeckAddSubdeckMutation = {
  __typename?: "Mutation";
  deckAddSubdeck: { __typename?: "Deck"; id: string };
};

export type DeckRemoveSubdeckMutationVariables = Exact<{
  deckId: Scalars["ID"];
  subdeckId: Scalars["ID"];
}>;

export type DeckRemoveSubdeckMutation = {
  __typename?: "Mutation";
  deckRemoveSubdeck: { __typename?: "Deck"; id: string };
};

export type DeckEditMutationVariables = Exact<{
  id: Scalars["ID"];
  name?: InputMaybe<Scalars["String"]>;
  answerLang?: InputMaybe<Scalars["String"]>;
  description?: InputMaybe<Scalars["JSONObject"]>;
  notes?: InputMaybe<Scalars["JSONObject"]>;
  promptLang?: InputMaybe<Scalars["String"]>;
}>;

export type DeckEditMutation = {
  __typename?: "Mutation";
  deckEdit: { __typename?: "Deck"; id: string; name: string };
};

export type DeckQueryVariables = Exact<{
  id: Scalars["ID"];
}>;

export type DeckQuery = {
  __typename?: "Query";
  deck: {
    __typename?: "Deck";
    answerLang: string;
    description?: JSONObject | null;
    editedAt: string;
    name: string;
    promptLang: string;
    published: boolean;
    sortData: Array<string>;
    owner: { __typename?: "User"; id: string };
  };
};

export type DecksQueryVariables = Exact<{
  after?: InputMaybe<Scalars["ID"]>;
  before?: InputMaybe<Scalars["ID"]>;
  first?: InputMaybe<Scalars["Int"]>;
  last?: InputMaybe<Scalars["Int"]>;
  scope?: InputMaybe<DecksQueryScope>;
  stoplist?: InputMaybe<Array<Scalars["ID"]> | Scalars["ID"]>;
}>;

export type DecksQuery = {
  __typename?: "Query";
  decks: {
    __typename?: "QueryDecksConnection";
    edges: Array<{
      __typename?: "QueryDecksConnectionEdge";
      cursor: string;
      node: { __typename?: "Deck"; id: string };
    } | null>;
    pageInfo: {
      __typename?: "PageInfo";
      endCursor?: string | null;
      hasNextPage: boolean;
      hasPreviousPage: boolean;
      startCursor?: string | null;
    };
  };
};

export type BefriendMutationVariables = Exact<{
  befriendedId: Scalars["ID"];
}>;

export type BefriendMutation = {
  __typename?: "Mutation";
  befriend: { __typename?: "User"; id: string };
};

export type HealthQueryVariables = Exact<{ [key: string]: never }>;

export type HealthQuery = { __typename?: "Query"; health: string };

export type RepeatHealthSubscriptionVariables = Exact<{ [key: string]: never }>;

export type RepeatHealthSubscription = {
  __typename?: "Subscription";
  repeatHealth: string;
};

export type SendTextMessageMutationVariables = Exact<{
  roomId: Scalars["ID"];
  textContent: Scalars["String"];
}>;

export type SendTextMessageMutation = {
  __typename?: "Mutation";
  sendTextMessage: {
    __typename?: "Message";
    content?: JSONObject | null;
    createdAt: string;
    id: string;
    type: MessageContentType;
    sender: { __typename?: "User"; id: string };
  };
};

export type MessageUpdatesByRoomSlugSubscriptionVariables = Exact<{
  id: Scalars["ID"];
}>;

export type MessageUpdatesByRoomSlugSubscription = {
  __typename?: "Subscription";
  messageUpdatesByRoomId: {
    __typename?: "MessageUpdate";
    operation: MessageUpdateOperations;
    value: {
      __typename?: "Message";
      content?: JSONObject | null;
      createdAt: string;
      id: string;
      type: MessageContentType;
      sender: { __typename?: "User"; id: string };
    };
  };
};

export type RoomCreateMutationVariables = Exact<{ [key: string]: never }>;

export type RoomCreateMutation = {
  __typename?: "Mutation";
  roomCreate: {
    __typename?: "Room";
    id: string;
    type: RoomType;
    activeRound?: {
      __typename?: "Round";
      id: string;
      isActive: boolean;
      state: RoundState;
      slug: string;
      deck: { __typename?: "Deck"; id: string };
    } | null;
    occupants: Array<{ __typename?: "User"; id: string }>;
  };
};

export type RoomSetDeckMutationVariables = Exact<{
  id: Scalars["ID"];
  deckId: Scalars["ID"];
}>;

export type RoomSetDeckMutation = {
  __typename?: "Mutation";
  roomSetDeck: {
    __typename?: "Room";
    id: string;
    type: RoomType;
    activeRound?: {
      __typename?: "Round";
      id: string;
      isActive: boolean;
      state: RoundState;
      slug: string;
      deck: { __typename?: "Deck"; id: string };
    } | null;
    occupants: Array<{ __typename?: "User"; id: string }>;
  };
};

export type RoomStartRoundMutationVariables = Exact<{
  id: Scalars["ID"];
}>;

export type RoomStartRoundMutation = {
  __typename?: "Mutation";
  roomStartRound: {
    __typename?: "Room";
    id: string;
    type: RoomType;
    activeRound?: {
      __typename?: "Round";
      id: string;
      isActive: boolean;
      state: RoundState;
      slug: string;
      deck: { __typename?: "Deck"; id: string };
    } | null;
    occupants: Array<{ __typename?: "User"; id: string }>;
  };
};

export type RoomEndRoundMutationVariables = Exact<{
  id: Scalars["ID"];
}>;

export type RoomEndRoundMutation = {
  __typename?: "Mutation";
  roomEndRound: {
    __typename?: "Room";
    id: string;
    type: RoomType;
    activeRound?: {
      __typename?: "Round";
      id: string;
      isActive: boolean;
      state: RoundState;
      slug: string;
      deck: { __typename?: "Deck"; id: string };
    } | null;
    occupants: Array<{ __typename?: "User"; id: string }>;
  };
};

export type RoomArchiveMutationVariables = Exact<{
  id: Scalars["ID"];
}>;

export type RoomArchiveMutation = {
  __typename?: "Mutation";
  roomArchive: {
    __typename?: "Room";
    id: string;
    type: RoomType;
    activeRound?: {
      __typename?: "Round";
      id: string;
      isActive: boolean;
      state: RoundState;
      slug: string;
      deck: { __typename?: "Deck"; id: string };
    } | null;
    occupants: Array<{ __typename?: "User"; id: string }>;
  };
};

export type RoomJoinMutationVariables = Exact<{
  id: Scalars["ID"];
}>;

export type RoomJoinMutation = {
  __typename?: "Mutation";
  roomJoin: {
    __typename?: "Room";
    id: string;
    type: RoomType;
    activeRound?: {
      __typename?: "Round";
      id: string;
      isActive: boolean;
      state: RoundState;
      slug: string;
      deck: { __typename?: "Deck"; id: string };
    } | null;
    occupants: Array<{ __typename?: "User"; id: string }>;
  };
};

export type RoomQueryVariables = Exact<{
  id: Scalars["ID"];
}>;

export type RoomQuery = {
  __typename?: "Query";
  room?: {
    __typename?: "Room";
    id: string;
    type: RoomType;
    activeRound?: {
      __typename?: "Round";
      id: string;
      isActive: boolean;
      state: RoundState;
      slug: string;
      deck: { __typename?: "Deck"; id: string };
    } | null;
    occupants: Array<{ __typename?: "User"; id: string }>;
  } | null;
};

export type OccupyingUnarchivedRoomsQueryVariables = Exact<{
  [key: string]: never;
}>;

export type OccupyingUnarchivedRoomsQuery = {
  __typename?: "Query";
  occupyingUnarchivedRooms?: Array<{
    __typename?: "Room";
    id: string;
    type: RoomType;
    activeRound?: {
      __typename?: "Round";
      id: string;
      isActive: boolean;
      state: RoundState;
      slug: string;
      deck: { __typename?: "Deck"; id: string };
    } | null;
    occupants: Array<{ __typename?: "User"; id: string }>;
  }> | null;
};

export type RoomUpdatesByRoomIdSubscriptionVariables = Exact<{
  id: Scalars["ID"];
}>;

export type RoomUpdatesByRoomIdSubscription = {
  __typename?: "Subscription";
  roomUpdatesByRoomId: {
    __typename?: "RoomUpdate";
    operation: RoomUpdateOperations;
    value: {
      __typename?: "Room";
      id: string;
      type: RoomType;
      activeRound?: {
        __typename?: "Round";
        id: string;
        isActive: boolean;
        state: RoundState;
        slug: string;
        deck: { __typename?: "Deck"; id: string };
      } | null;
      occupants: Array<{ __typename?: "User"; id: string }>;
    };
  };
};

export type CreateUserMutationVariables = Exact<{
  code: Scalars["String"];
  nonce: Scalars["String"];
  provider: Scalars["String"];
  redirect_uri: Scalars["String"];
}>;

export type CreateUserMutation = {
  __typename?: "Mutation";
  finalizeOauthSignin?: {
    __typename?: "SessionInfo";
    currentUser: JSONObject;
    token: string;
  } | null;
};

export type NameUserMutationVariables = Exact<{
  name: Scalars["String"];
}>;

export type NameUserMutation = {
  __typename?: "Mutation";
  ownProfileEdit: { __typename?: "User"; id: string; name: string };
};

export type RefreshMutationVariables = Exact<{
  token: Scalars["JWT"];
}>;

export type RefreshMutation = {
  __typename?: "Mutation";
  refresh?: {
    __typename?: "SessionInfo";
    currentUser: JSONObject;
    token: string;
  } | null;
};

export type MeQueryVariables = Exact<{ [key: string]: never }>;

export type MeQuery = {
  __typename?: "Query";
  me?: {
    __typename?: "User";
    isPublic: boolean;
    name: string;
    roles: Array<string>;
  } | null;
};

export type UserEditMutationVariables = Exact<{
  name?: InputMaybe<Scalars["String"]>;
  isPublic?: InputMaybe<Scalars["Boolean"]>;
}>;

export type UserEditMutation = {
  __typename?: "Mutation";
  ownProfileEdit: { __typename?: "User"; id: string; name: string };
};
