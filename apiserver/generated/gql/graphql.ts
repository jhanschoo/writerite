/* eslint-disable */
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
  deckId: Scalars['ID'];
  editedAt: Scalars['DateTime'];
  fullAnswer?: Maybe<Scalars['JSONObject']>;
  id: Scalars['ID'];
  mainTemplate: Scalars['Boolean'];
  prompt?: Maybe<Scalars['JSONObject']>;
  template: Scalars['Boolean'];
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
  ownerId: Scalars['ID'];
  promptLang: Scalars['String'];
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
  befriendedId: Scalars['ID'];
  befriender: User;
  befrienderId: Scalars['ID'];
  createdAt: Scalars['DateTime'];
  id: Scalars['ID'];
  updatedAt: Scalars['DateTime'];
};

export type Message = Node & {
  __typename?: 'Message';
  content?: Maybe<Scalars['JSONObject']>;
  createdAt: Scalars['DateTime'];
  id: Scalars['ID'];
  room: Room;
  roomId: Scalars['ID'];
  sender: User;
  senderId?: Maybe<Scalars['ID']>;
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

export type Mutation = {
  __typename?: 'Mutation';
  finalizeOauthSignin?: Maybe<SessionInfo>;
  initializeOauthSignin: Scalars['String'];
};


export type MutationFinalizeOauthSigninArgs = {
  code: Scalars['String'];
  nonce: Scalars['String'];
  provider: Scalars['String'];
  redirect_uri: Scalars['String'];
};

export type Node = {
  id: Scalars['ID'];
};

export type Occupant = Node & {
  __typename?: 'Occupant';
  createdAt: Scalars['DateTime'];
  id: Scalars['ID'];
  occupant: User;
  occupantId: Scalars['ID'];
  room: Room;
  roomId: Scalars['ID'];
  updatedAt: Scalars['DateTime'];
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
  deck?: Maybe<Deck>;
  decks: QueryDecksConnection;
  health: Scalars['String'];
  me?: Maybe<User>;
  node?: Maybe<Node>;
  nodes: Array<Maybe<Node>>;
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
  createdAt: Scalars['DateTime'];
  deck: Deck;
  deckId?: Maybe<Scalars['ID']>;
  id: Scalars['ID'];
  messages: RoomMessagesConnection;
  slug?: Maybe<Scalars['String']>;
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

export enum RoomState {
  Served = 'SERVED',
  Serving = 'SERVING',
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
  parentDeckId: Scalars['ID'];
  subdeck: Deck;
  subdeckId: Scalars['ID'];
  updatedAt: Scalars['DateTime'];
};

export type Subscription = {
  __typename?: 'Subscription';
  repeatHealth: Scalars['String'];
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
