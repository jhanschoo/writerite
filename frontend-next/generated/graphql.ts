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
  /** A field whose value conforms to the standard internet email address format as specified in RFC822: https://www.w3.org/Protocols/rfc822/. */
  EmailAddress: string;
  /** The `JSON` scalar type represents JSON values as specified by [ECMA-404](http://www.ecma-international.org/publications/files/ECMA-ST/ECMA-404.pdf). */
  JSON: string;
  /** The `JSONObject` scalar type represents JSON objects as specified by [ECMA-404](http://www.ecma-international.org/publications/files/ECMA-ST/ECMA-404.pdf). */
  JSONObject: string;
  /** A field whose value is a JSON Web Token (JWT): https://jwt.io/introduction. */
  JWT: string;
  /** A field whose value is a generic Universally Unique Identifier: https://en.wikipedia.org/wiki/Universally_unique_identifier. */
  UUID: string;
};

export type Card = {
  __typename?: 'Card';
  answers: Array<Scalars['String']>;
  deckId: Scalars['ID'];
  editedAt: Scalars['DateTime'];
  fullAnswer: Scalars['JSONObject'];
  id: Scalars['ID'];
  mainTemplate: Scalars['Boolean'];
  ownRecord?: Maybe<UserCardRecord>;
  prompt: Scalars['JSONObject'];
  template: Scalars['Boolean'];
};

export type CardCreateInput = {
  answers: Array<Scalars['String']>;
  fullAnswer: Scalars['JSONObject'];
  prompt: Scalars['JSONObject'];
  template?: InputMaybe<Scalars['Boolean']>;
};

export type Deck = {
  __typename?: 'Deck';
  answerLang: Scalars['String'];
  /** all cards directly belonging to some descendant (reflexive, transitive closure of subdeck) deck of this deck */
  cardsAllUnder: Array<Card>;
  /** all cards directly belonging to this deck */
  cardsDirect: Array<Card>;
  /** number of all cards directly belonging to this deck */
  cardsDirectCount: Scalars['Int'];
  createdAt: Scalars['DateTime'];
  /** all descendant (reflexive, transitive closure of subdeck) decks of this deck */
  descendantDecks: Array<Deck>;
  description: Scalars['JSONObject'];
  editedAt: Scalars['DateTime'];
  id: Scalars['ID'];
  name: Scalars['String'];
  ownRecord?: Maybe<UserDeckRecord>;
  owner: User;
  ownerId: Scalars['ID'];
  promptLang: Scalars['String'];
  published: Scalars['Boolean'];
  sortData: Array<Scalars['String']>;
  /** all direct subdecks of this deck */
  subdecks: Array<Deck>;
  /** count of all direct subdecks of this deck */
  subdecksCount: Scalars['Int'];
  usedAt: Scalars['DateTime'];
};

export enum DecksQueryScope {
  Owned = 'OWNED',
  Participated = 'PARTICIPATED',
  Visible = 'VISIBLE'
}

export type Message = {
  __typename?: 'Message';
  content: Scalars['JSON'];
  createdAt: Scalars['DateTime'];
  id: Scalars['ID'];
  room: Room;
  roomId: Scalars['ID'];
  sender?: Maybe<User>;
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
  cardCreate: Card;
  cardDelete: Card;
  cardEdit: Card;
  cardUnsetMainTemplate?: Maybe<Card>;
  deckAddCards: Deck;
  deckAddSubdeck: Deck;
  deckCreate: Deck;
  deckDelete: Deck;
  deckEdit: Deck;
  deckRemoveSubdeck: Deck;
  deckUsed: Deck;
  finalizeOauthSignin?: Maybe<Scalars['JWT']>;
  initializeOauthSignin: Scalars['String'];
  /**
   * @triggersSubscriptions(
   *     signatures: ["messagesOfRoomUpdates"]
   *   )
   */
  messageCreate: Message;
  ownCardRecordSet?: Maybe<UserCardRecord>;
  ownDeckRecordSet: UserDeckRecord;
  refresh?: Maybe<Scalars['JWT']>;
  /**
   * @invalidatesTokens(
   *     reason: "occupying existing room"
   *   )
   *   @triggersSubscriptions(
   *     signatures: ["activeRoomUpdates"]
   *   )
   */
  roomAddOccupant: Room;
  roomCleanUpDead: Scalars['Int'];
  /**
   * @invalidatesTokens(
   *     reason: "occupying newly created room"
   *   )
   *   @triggersSubscriptions(
   *     signatures: ["activeRoomUpdates"]
   *   )
   */
  roomCreate: Room;
  /**
   * @triggersSubscriptions(
   *     signatures: ["activeRoomUpdates"]
   *   )
   */
  roomEditOwnerConfig: Room;
  /**
   * @triggersSubscriptions(
   *     signatures: ["activeRoomUpdates"]
   *   )
   */
  roomSetDeck: Room;
  /**
   * @invalidatesTokens(
   *     reason: "room may no longer be active"
   *   )
   *   @triggersSubscriptions(
   *     signatures: ["activeRoomUpdates"]
   *   )
   */
  roomSetState: Room;
  /**
   * @invalidatesTokens(
   *     reason: "name may be changed"
   *   )
   */
  userEdit: User;
};


export type MutationCardCreateArgs = {
  card: CardCreateInput;
  deckId: Scalars['ID'];
  mainTemplate?: InputMaybe<Scalars['Boolean']>;
};


export type MutationCardDeleteArgs = {
  id: Scalars['ID'];
};


export type MutationCardEditArgs = {
  answers?: InputMaybe<Array<Scalars['String']>>;
  fullAnswer?: InputMaybe<Scalars['JSONObject']>;
  id: Scalars['ID'];
  mainTemplate?: InputMaybe<Scalars['Boolean']>;
  prompt?: InputMaybe<Scalars['JSONObject']>;
  template?: InputMaybe<Scalars['Boolean']>;
};


export type MutationCardUnsetMainTemplateArgs = {
  deckId: Scalars['ID'];
};


export type MutationDeckAddCardsArgs = {
  cards: Array<CardCreateInput>;
  deckId: Scalars['ID'];
};


export type MutationDeckAddSubdeckArgs = {
  id: Scalars['ID'];
  subdeckId: Scalars['ID'];
};


export type MutationDeckCreateArgs = {
  answerLang?: InputMaybe<Scalars['String']>;
  cards?: InputMaybe<Array<CardCreateInput>>;
  description?: InputMaybe<Scalars['JSONObject']>;
  name?: InputMaybe<Scalars['String']>;
  promptLang?: InputMaybe<Scalars['String']>;
  published?: InputMaybe<Scalars['Boolean']>;
};


export type MutationDeckDeleteArgs = {
  id: Scalars['ID'];
};


export type MutationDeckEditArgs = {
  answerLang?: InputMaybe<Scalars['String']>;
  description?: InputMaybe<Scalars['JSONObject']>;
  id: Scalars['ID'];
  name?: InputMaybe<Scalars['String']>;
  promptLang?: InputMaybe<Scalars['String']>;
  published?: InputMaybe<Scalars['Boolean']>;
};


export type MutationDeckRemoveSubdeckArgs = {
  id: Scalars['ID'];
  subdeckId: Scalars['ID'];
};


export type MutationDeckUsedArgs = {
  id: Scalars['ID'];
};


export type MutationFinalizeOauthSigninArgs = {
  code: Scalars['String'];
  nonce: Scalars['String'];
  provider: Scalars['String'];
  redirect_uri: Scalars['String'];
};


export type MutationMessageCreateArgs = {
  content?: InputMaybe<Scalars['JSON']>;
  roomId: Scalars['ID'];
  type: MessageContentType;
};


export type MutationOwnCardRecordSetArgs = {
  cardId: Scalars['ID'];
  correctRecordAppend: Array<Scalars['DateTime']>;
};


export type MutationOwnDeckRecordSetArgs = {
  deckId: Scalars['ID'];
  notes: Scalars['JSONObject'];
};


export type MutationRefreshArgs = {
  token: Scalars['JWT'];
};


export type MutationRoomAddOccupantArgs = {
  id: Scalars['ID'];
  occupantId: Scalars['ID'];
};


export type MutationRoomEditOwnerConfigArgs = {
  id: Scalars['ID'];
  ownerConfig: Scalars['JSONObject'];
};


export type MutationRoomSetDeckArgs = {
  deckId: Scalars['ID'];
  id: Scalars['ID'];
};


export type MutationRoomSetStateArgs = {
  id: Scalars['ID'];
  state: RoomState;
};


export type MutationUserEditArgs = {
  isPublic?: InputMaybe<Scalars['Boolean']>;
  name?: InputMaybe<Scalars['String']>;
};

export type Query = {
  __typename?: 'Query';
  deck: Deck;
  /** implicit limit of 60 */
  decks: Array<Deck>;
  health: Scalars['String'];
  message: Message;
  messagesOfRoom: Array<Message>;
  occupyingActiveRooms: Array<Room>;
  ownDeckRecord?: Maybe<UserDeckRecord>;
  room: Room;
  user: User;
};


export type QueryDeckArgs = {
  id: Scalars['ID'];
};


export type QueryDecksArgs = {
  cursor?: InputMaybe<Scalars['ID']>;
  scope?: InputMaybe<DecksQueryScope>;
  take?: InputMaybe<Scalars['Int']>;
  titleFilter?: InputMaybe<Scalars['String']>;
};


export type QueryMessageArgs = {
  id: Scalars['ID'];
};


export type QueryMessagesOfRoomArgs = {
  id: Scalars['ID'];
};


export type QueryOwnDeckRecordArgs = {
  deckId: Scalars['ID'];
};


export type QueryRoomArgs = {
  id: Scalars['ID'];
};


export type QueryUserArgs = {
  id?: InputMaybe<Scalars['ID']>;
};

export type Room = {
  __typename?: 'Room';
  createdAt: Scalars['DateTime'];
  deck?: Maybe<Deck>;
  deckId?: Maybe<Scalars['ID']>;
  id: Scalars['ID'];
  internalConfig: Scalars['JSONObject'];
  messageCount: Scalars['Int'];
  messages: Array<Message>;
  occupants: Array<User>;
  occupantsCount: Scalars['Int'];
  owner: User;
  ownerConfig: Scalars['JSONObject'];
  ownerId: Scalars['ID'];
  slug?: Maybe<Scalars['String']>;
  state: RoomState;
};

export enum RoomState {
  Served = 'SERVED',
  Serving = 'SERVING',
  Waiting = 'WAITING'
}

export type Subscription = {
  __typename?: 'Subscription';
  repeatHealth: Scalars['String'];
};

export type User = {
  __typename?: 'User';
  decks: Array<Deck>;
  facebookId?: Maybe<Scalars['String']>;
  googleId?: Maybe<Scalars['String']>;
  id: Scalars['ID'];
  isPublic: Scalars['Boolean'];
  name?: Maybe<Scalars['String']>;
  occupyingActiveRooms: Array<Room>;
  ownedRooms: Array<Room>;
  roles: Array<Scalars['String']>;
};

export type UserCardRecord = {
  __typename?: 'UserCardRecord';
  correctRecord: Array<Scalars['DateTime']>;
};

export type UserDeckRecord = {
  __typename?: 'UserDeckRecord';
  notes: Scalars['JSONObject'];
};

export type CardCreateMutationVariables = Exact<{
  card: CardCreateInput;
  deckId: Scalars['ID'];
  mainTemplate?: InputMaybe<Scalars['Boolean']>;
}>;


export type CardCreateMutation = { __typename?: 'Mutation', cardCreate: { __typename?: 'Card', answers: Array<string>, deckId: string, editedAt: string, fullAnswer: string, id: string, mainTemplate: boolean, prompt: string, template: boolean, ownRecord?: { __typename?: 'UserCardRecord', correctRecord: Array<string> } | null } };

export type CardDeleteMutationVariables = Exact<{
  id: Scalars['ID'];
}>;


export type CardDeleteMutation = { __typename?: 'Mutation', cardDelete: { __typename?: 'Card', answers: Array<string>, deckId: string, editedAt: string, fullAnswer: string, id: string, mainTemplate: boolean, prompt: string, template: boolean, ownRecord?: { __typename?: 'UserCardRecord', correctRecord: Array<string> } | null } };

export type CardDetailFragment = { __typename?: 'Card', answers: Array<string>, deckId: string, editedAt: string, fullAnswer: string, id: string, mainTemplate: boolean, prompt: string, template: boolean, ownRecord?: { __typename?: 'UserCardRecord', correctRecord: Array<string> } | null };

export type CardEditMutationVariables = Exact<{
  answers?: InputMaybe<Array<Scalars['String']> | Scalars['String']>;
  fullAnswer?: InputMaybe<Scalars['JSONObject']>;
  id: Scalars['ID'];
  mainTemplate?: InputMaybe<Scalars['Boolean']>;
  prompt?: InputMaybe<Scalars['JSONObject']>;
  template?: InputMaybe<Scalars['Boolean']>;
}>;


export type CardEditMutation = { __typename?: 'Mutation', cardEdit: { __typename?: 'Card', answers: Array<string>, deckId: string, editedAt: string, fullAnswer: string, id: string, mainTemplate: boolean, prompt: string, template: boolean, ownRecord?: { __typename?: 'UserCardRecord', correctRecord: Array<string> } | null } };

export type DashboardQueryVariables = Exact<{
  id?: InputMaybe<Scalars['ID']>;
}>;


export type DashboardQuery = { __typename?: 'Query', user: { __typename?: 'User', id: string, facebookId?: string | null, googleId?: string | null, isPublic: boolean, name?: string | null } };

export type DeckQueryVariables = Exact<{
  id: Scalars['ID'];
}>;


export type DeckQuery = { __typename?: 'Query', deck: { __typename?: 'Deck', answerLang: string, description: string, editedAt: string, id: string, name: string, promptLang: string, published: boolean, sortData: Array<string>, cardsDirect: Array<{ __typename?: 'Card', answers: Array<string>, deckId: string, editedAt: string, fullAnswer: string, id: string, mainTemplate: boolean, prompt: string, template: boolean, ownRecord?: { __typename?: 'UserCardRecord', correctRecord: Array<string> } | null }>, subdecks: Array<{ __typename?: 'Deck', answerLang: string, cardsDirectCount: number, subdecksCount: number, description: string, editedAt: string, id: string, name: string, promptLang: string, published: boolean, ownRecord?: { __typename?: 'UserDeckRecord', notes: string } | null }>, ownRecord?: { __typename?: 'UserDeckRecord', notes: string } | null } };

export type DeckAddCardsMutationVariables = Exact<{
  deckId: Scalars['ID'];
  cards: Array<CardCreateInput> | CardCreateInput;
}>;


export type DeckAddCardsMutation = { __typename?: 'Mutation', deckAddCards: { __typename?: 'Deck', answerLang: string, description: string, editedAt: string, id: string, name: string, promptLang: string, published: boolean, sortData: Array<string>, cardsDirect: Array<{ __typename?: 'Card', answers: Array<string>, deckId: string, editedAt: string, fullAnswer: string, id: string, mainTemplate: boolean, prompt: string, template: boolean, ownRecord?: { __typename?: 'UserCardRecord', correctRecord: Array<string> } | null }>, subdecks: Array<{ __typename?: 'Deck', answerLang: string, cardsDirectCount: number, subdecksCount: number, description: string, editedAt: string, id: string, name: string, promptLang: string, published: boolean, ownRecord?: { __typename?: 'UserDeckRecord', notes: string } | null }>, ownRecord?: { __typename?: 'UserDeckRecord', notes: string } | null } };

export type DeckAddSubdeckMutationVariables = Exact<{
  id: Scalars['ID'];
  subdeckId: Scalars['ID'];
}>;


export type DeckAddSubdeckMutation = { __typename?: 'Mutation', deckAddSubdeck: { __typename?: 'Deck', answerLang: string, cardsDirectCount: number, subdecksCount: number, description: string, editedAt: string, id: string, name: string, promptLang: string, published: boolean, subdecks: Array<{ __typename?: 'Deck', answerLang: string, cardsDirectCount: number, subdecksCount: number, description: string, editedAt: string, id: string, name: string, promptLang: string, published: boolean, ownRecord?: { __typename?: 'UserDeckRecord', notes: string } | null }>, ownRecord?: { __typename?: 'UserDeckRecord', notes: string } | null } };

export type DeckCardsDirectCountFragment = { __typename?: 'Deck', cardsDirectCount: number, id: string };

export type DeckCreateMutationVariables = Exact<{
  answerLang: Scalars['String'];
  cards: Array<CardCreateInput> | CardCreateInput;
  description: Scalars['JSONObject'];
  name: Scalars['String'];
  promptLang: Scalars['String'];
  published: Scalars['Boolean'];
}>;


export type DeckCreateMutation = { __typename?: 'Mutation', deckCreate: { __typename?: 'Deck', answerLang: string, description: string, editedAt: string, id: string, name: string, promptLang: string, published: boolean, sortData: Array<string>, cardsDirect: Array<{ __typename?: 'Card', answers: Array<string>, deckId: string, editedAt: string, fullAnswer: string, id: string, mainTemplate: boolean, prompt: string, template: boolean, ownRecord?: { __typename?: 'UserCardRecord', correctRecord: Array<string> } | null }>, subdecks: Array<{ __typename?: 'Deck', answerLang: string, cardsDirectCount: number, subdecksCount: number, description: string, editedAt: string, id: string, name: string, promptLang: string, published: boolean, ownRecord?: { __typename?: 'UserDeckRecord', notes: string } | null }>, ownRecord?: { __typename?: 'UserDeckRecord', notes: string } | null } };

export type DeckDetailFragment = { __typename?: 'Deck', answerLang: string, description: string, editedAt: string, id: string, name: string, promptLang: string, published: boolean, sortData: Array<string>, cardsDirect: Array<{ __typename?: 'Card', answers: Array<string>, deckId: string, editedAt: string, fullAnswer: string, id: string, mainTemplate: boolean, prompt: string, template: boolean, ownRecord?: { __typename?: 'UserCardRecord', correctRecord: Array<string> } | null }>, subdecks: Array<{ __typename?: 'Deck', answerLang: string, cardsDirectCount: number, subdecksCount: number, description: string, editedAt: string, id: string, name: string, promptLang: string, published: boolean, ownRecord?: { __typename?: 'UserDeckRecord', notes: string } | null }>, ownRecord?: { __typename?: 'UserDeckRecord', notes: string } | null };

export type DeckEditMutationVariables = Exact<{
  id: Scalars['ID'];
  answerLang?: InputMaybe<Scalars['String']>;
  description?: InputMaybe<Scalars['JSONObject']>;
  name?: InputMaybe<Scalars['String']>;
  promptLang?: InputMaybe<Scalars['String']>;
  published?: InputMaybe<Scalars['Boolean']>;
}>;


export type DeckEditMutation = { __typename?: 'Mutation', deckEdit: { __typename?: 'Deck', answerLang: string, description: string, editedAt: string, id: string, name: string, promptLang: string, published: boolean, sortData: Array<string>, cardsDirect: Array<{ __typename?: 'Card', answers: Array<string>, deckId: string, editedAt: string, fullAnswer: string, id: string, mainTemplate: boolean, prompt: string, template: boolean, ownRecord?: { __typename?: 'UserCardRecord', correctRecord: Array<string> } | null }>, subdecks: Array<{ __typename?: 'Deck', answerLang: string, cardsDirectCount: number, subdecksCount: number, description: string, editedAt: string, id: string, name: string, promptLang: string, published: boolean, ownRecord?: { __typename?: 'UserDeckRecord', notes: string } | null }>, ownRecord?: { __typename?: 'UserDeckRecord', notes: string } | null } };

export type DeckNameFragment = { __typename?: 'Deck', id: string, name: string };

export type DeckRemoveSubdeckMutationVariables = Exact<{
  id: Scalars['ID'];
  subdeckId: Scalars['ID'];
}>;


export type DeckRemoveSubdeckMutation = { __typename?: 'Mutation', deckRemoveSubdeck: { __typename?: 'Deck', answerLang: string, cardsDirectCount: number, subdecksCount: number, description: string, editedAt: string, id: string, name: string, promptLang: string, published: boolean, subdecks: Array<{ __typename?: 'Deck', answerLang: string, cardsDirectCount: number, subdecksCount: number, description: string, editedAt: string, id: string, name: string, promptLang: string, published: boolean, ownRecord?: { __typename?: 'UserDeckRecord', notes: string } | null }>, ownRecord?: { __typename?: 'UserDeckRecord', notes: string } | null } };

export type DeckSubdecksFragment = { __typename?: 'Deck', answerLang: string, cardsDirectCount: number, subdecksCount: number, description: string, editedAt: string, id: string, name: string, promptLang: string, published: boolean, subdecks: Array<{ __typename?: 'Deck', answerLang: string, cardsDirectCount: number, subdecksCount: number, description: string, editedAt: string, id: string, name: string, promptLang: string, published: boolean, ownRecord?: { __typename?: 'UserDeckRecord', notes: string } | null }>, ownRecord?: { __typename?: 'UserDeckRecord', notes: string } | null };

export type DeckSummaryFragment = { __typename?: 'Deck', answerLang: string, cardsDirectCount: number, subdecksCount: number, description: string, editedAt: string, id: string, name: string, promptLang: string, published: boolean, ownRecord?: { __typename?: 'UserDeckRecord', notes: string } | null };

export type DecksQueryVariables = Exact<{
  cursor?: InputMaybe<Scalars['ID']>;
  scope?: InputMaybe<DecksQueryScope>;
  take?: InputMaybe<Scalars['Int']>;
  titleFilter?: InputMaybe<Scalars['String']>;
}>;


export type DecksQuery = { __typename?: 'Query', decks: Array<{ __typename?: 'Deck', answerLang: string, cardsDirectCount: number, subdecksCount: number, description: string, editedAt: string, id: string, name: string, promptLang: string, published: boolean, ownRecord?: { __typename?: 'UserDeckRecord', notes: string } | null }> };

export type FinalizeOauthSigninMutationVariables = Exact<{
  code: Scalars['String'];
  provider: Scalars['String'];
  nonce: Scalars['String'];
  redirect_uri: Scalars['String'];
}>;


export type FinalizeOauthSigninMutation = { __typename?: 'Mutation', finalizeOauthSignin?: string | null };

export type HealthQueryQueryVariables = Exact<{ [key: string]: never; }>;


export type HealthQueryQuery = { __typename?: 'Query', health: string };

export type InitializeOauthSigninMutationVariables = Exact<{ [key: string]: never; }>;


export type InitializeOauthSigninMutation = { __typename?: 'Mutation', initializeOauthSignin: string };

export type OccupyingActiveRoomsQueryVariables = Exact<{ [key: string]: never; }>;


export type OccupyingActiveRoomsQuery = { __typename?: 'Query', occupyingActiveRooms: Array<{ __typename?: 'Room', createdAt: string, deckId?: string | null, id: string, internalConfig: string, messageCount: number, occupantsCount: number, ownerConfig: string, ownerId: string, slug?: string | null, state: RoomState, deck?: { __typename?: 'Deck', id: string, name: string } | null }> };

export type RefreshMutationVariables = Exact<{
  token: Scalars['JWT'];
}>;


export type RefreshMutation = { __typename?: 'Mutation', refresh?: string | null };

export type RepeatHealthSubscriptionSubscriptionVariables = Exact<{ [key: string]: never; }>;


export type RepeatHealthSubscriptionSubscription = { __typename?: 'Subscription', repeatHealth: string };

export type RoomCreateMutationVariables = Exact<{ [key: string]: never; }>;


export type RoomCreateMutation = { __typename?: 'Mutation', roomCreate: { __typename?: 'Room', deckId?: string | null, id: string, internalConfig: string, messageCount: number, occupantsCount: number, ownerConfig: string, ownerId: string, slug?: string | null, state: RoomState, deck?: { __typename?: 'Deck', answerLang: string, cardsDirectCount: number, subdecksCount: number, description: string, editedAt: string, id: string, name: string, promptLang: string, published: boolean, ownRecord?: { __typename?: 'UserDeckRecord', notes: string } | null } | null, occupants: Array<{ __typename?: 'User', id: string, isPublic: boolean, name?: string | null, roles: Array<string> }>, owner: { __typename?: 'User', id: string, isPublic: boolean, name?: string | null, roles: Array<string> } } };

export type RoomDetailFragment = { __typename?: 'Room', deckId?: string | null, id: string, internalConfig: string, messageCount: number, occupantsCount: number, ownerConfig: string, ownerId: string, slug?: string | null, state: RoomState, deck?: { __typename?: 'Deck', answerLang: string, cardsDirectCount: number, subdecksCount: number, description: string, editedAt: string, id: string, name: string, promptLang: string, published: boolean, ownRecord?: { __typename?: 'UserDeckRecord', notes: string } | null } | null, occupants: Array<{ __typename?: 'User', id: string, isPublic: boolean, name?: string | null, roles: Array<string> }>, owner: { __typename?: 'User', id: string, isPublic: boolean, name?: string | null, roles: Array<string> } };

export type RoomSummaryFragment = { __typename?: 'Room', createdAt: string, deckId?: string | null, id: string, internalConfig: string, messageCount: number, occupantsCount: number, ownerConfig: string, ownerId: string, slug?: string | null, state: RoomState, deck?: { __typename?: 'Deck', id: string, name: string } | null };

export type UserQueryVariables = Exact<{
  id?: InputMaybe<Scalars['ID']>;
}>;


export type UserQuery = { __typename?: 'Query', user: { __typename?: 'User', id: string, facebookId?: string | null, googleId?: string | null, isPublic: boolean, name?: string | null } };

export type UserEditMutationVariables = Exact<{
  isPublic?: InputMaybe<Scalars['Boolean']>;
  name?: InputMaybe<Scalars['String']>;
}>;


export type UserEditMutation = { __typename?: 'Mutation', userEdit: { __typename?: 'User', id: string, facebookId?: string | null, googleId?: string | null, isPublic: boolean, name?: string | null } };

export type UserUserAccessibleScalarsFragment = { __typename?: 'User', id: string, isPublic: boolean, name?: string | null, roles: Array<string> };

export const DeckCardsDirectCountFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"deckCardsDirectCount"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Deck"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"cardsDirectCount"}},{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]} as unknown as DocumentNode<DeckCardsDirectCountFragment, unknown>;
export const CardDetailFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"cardDetail"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Card"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"answers"}},{"kind":"Field","name":{"kind":"Name","value":"deckId"}},{"kind":"Field","name":{"kind":"Name","value":"editedAt"}},{"kind":"Field","name":{"kind":"Name","value":"fullAnswer"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"mainTemplate"}},{"kind":"Field","name":{"kind":"Name","value":"ownRecord"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"correctRecord"}}]}},{"kind":"Field","name":{"kind":"Name","value":"prompt"}},{"kind":"Field","name":{"kind":"Name","value":"template"}}]}}]} as unknown as DocumentNode<CardDetailFragment, unknown>;
export const DeckSummaryFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"deckSummary"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Deck"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"answerLang"}},{"kind":"Field","name":{"kind":"Name","value":"cardsDirectCount"}},{"kind":"Field","name":{"kind":"Name","value":"subdecksCount"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"editedAt"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"ownRecord"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"notes"}}]}},{"kind":"Field","name":{"kind":"Name","value":"promptLang"}},{"kind":"Field","name":{"kind":"Name","value":"published"}}]}}]} as unknown as DocumentNode<DeckSummaryFragment, unknown>;
export const DeckDetailFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"deckDetail"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Deck"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"answerLang"}},{"kind":"Field","name":{"kind":"Name","value":"cardsDirect"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"cardDetail"}}]}},{"kind":"Field","name":{"kind":"Name","value":"subdecks"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"deckSummary"}}]}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"editedAt"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"ownRecord"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"notes"}}]}},{"kind":"Field","name":{"kind":"Name","value":"promptLang"}},{"kind":"Field","name":{"kind":"Name","value":"published"}},{"kind":"Field","name":{"kind":"Name","value":"sortData"}}]}},...CardDetailFragmentDoc.definitions,...DeckSummaryFragmentDoc.definitions]} as unknown as DocumentNode<DeckDetailFragment, unknown>;
export const DeckSubdecksFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"deckSubdecks"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Deck"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"deckSummary"}},{"kind":"Field","name":{"kind":"Name","value":"subdecks"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"deckSummary"}}]}}]}},...DeckSummaryFragmentDoc.definitions]} as unknown as DocumentNode<DeckSubdecksFragment, unknown>;
export const UserUserAccessibleScalarsFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"userUserAccessibleScalars"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"User"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"isPublic"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"roles"}}]}}]} as unknown as DocumentNode<UserUserAccessibleScalarsFragment, unknown>;
export const RoomDetailFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"roomDetail"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Room"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"deck"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"deckSummary"}}]}},{"kind":"Field","name":{"kind":"Name","value":"deckId"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"internalConfig"}},{"kind":"Field","name":{"kind":"Name","value":"messageCount"}},{"kind":"Field","name":{"kind":"Name","value":"occupants"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"userUserAccessibleScalars"}}]}},{"kind":"Field","name":{"kind":"Name","value":"occupantsCount"}},{"kind":"Field","name":{"kind":"Name","value":"owner"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"userUserAccessibleScalars"}}]}},{"kind":"Field","name":{"kind":"Name","value":"ownerConfig"}},{"kind":"Field","name":{"kind":"Name","value":"ownerId"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"state"}}]}},...DeckSummaryFragmentDoc.definitions,...UserUserAccessibleScalarsFragmentDoc.definitions]} as unknown as DocumentNode<RoomDetailFragment, unknown>;
export const DeckNameFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"deckName"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Deck"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]} as unknown as DocumentNode<DeckNameFragment, unknown>;
export const RoomSummaryFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"roomSummary"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Room"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"deck"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"deckName"}}]}},{"kind":"Field","name":{"kind":"Name","value":"deckId"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"internalConfig"}},{"kind":"Field","name":{"kind":"Name","value":"messageCount"}},{"kind":"Field","name":{"kind":"Name","value":"occupantsCount"}},{"kind":"Field","name":{"kind":"Name","value":"ownerConfig"}},{"kind":"Field","name":{"kind":"Name","value":"ownerId"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"state"}}]}},...DeckNameFragmentDoc.definitions]} as unknown as DocumentNode<RoomSummaryFragment, unknown>;
export const CardCreateDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CardCreate"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"card"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CardCreateInput"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"deckId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"mainTemplate"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"cardCreate"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"card"},"value":{"kind":"Variable","name":{"kind":"Name","value":"card"}}},{"kind":"Argument","name":{"kind":"Name","value":"deckId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"deckId"}}},{"kind":"Argument","name":{"kind":"Name","value":"mainTemplate"},"value":{"kind":"Variable","name":{"kind":"Name","value":"mainTemplate"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"cardDetail"}}]}}]}},...CardDetailFragmentDoc.definitions]} as unknown as DocumentNode<CardCreateMutation, CardCreateMutationVariables>;
export const CardDeleteDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CardDelete"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"cardDelete"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"cardDetail"}}]}}]}},...CardDetailFragmentDoc.definitions]} as unknown as DocumentNode<CardDeleteMutation, CardDeleteMutationVariables>;
export const CardEditDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CardEdit"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"answers"}},"type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"fullAnswer"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"JSONObject"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"mainTemplate"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"prompt"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"JSONObject"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"template"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"cardEdit"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"answers"},"value":{"kind":"Variable","name":{"kind":"Name","value":"answers"}}},{"kind":"Argument","name":{"kind":"Name","value":"fullAnswer"},"value":{"kind":"Variable","name":{"kind":"Name","value":"fullAnswer"}}},{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}},{"kind":"Argument","name":{"kind":"Name","value":"mainTemplate"},"value":{"kind":"Variable","name":{"kind":"Name","value":"mainTemplate"}}},{"kind":"Argument","name":{"kind":"Name","value":"prompt"},"value":{"kind":"Variable","name":{"kind":"Name","value":"prompt"}}},{"kind":"Argument","name":{"kind":"Name","value":"template"},"value":{"kind":"Variable","name":{"kind":"Name","value":"template"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"cardDetail"}}]}}]}},...CardDetailFragmentDoc.definitions]} as unknown as DocumentNode<CardEditMutation, CardEditMutationVariables>;
export const DashboardDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"Dashboard"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"user"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"facebookId"}},{"kind":"Field","name":{"kind":"Name","value":"googleId"}},{"kind":"Field","name":{"kind":"Name","value":"isPublic"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]} as unknown as DocumentNode<DashboardQuery, DashboardQueryVariables>;
export const DeckDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"Deck"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"deck"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"deckDetail"}}]}}]}},...DeckDetailFragmentDoc.definitions]} as unknown as DocumentNode<DeckQuery, DeckQueryVariables>;
export const DeckAddCardsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"DeckAddCards"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"deckId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"cards"}},"type":{"kind":"NonNullType","type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CardCreateInput"}}}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"deckAddCards"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"deckId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"deckId"}}},{"kind":"Argument","name":{"kind":"Name","value":"cards"},"value":{"kind":"Variable","name":{"kind":"Name","value":"cards"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"deckDetail"}}]}}]}},...DeckDetailFragmentDoc.definitions]} as unknown as DocumentNode<DeckAddCardsMutation, DeckAddCardsMutationVariables>;
export const DeckAddSubdeckDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"DeckAddSubdeck"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"subdeckId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"deckAddSubdeck"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}},{"kind":"Argument","name":{"kind":"Name","value":"subdeckId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"subdeckId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"deckSubdecks"}}]}}]}},...DeckSubdecksFragmentDoc.definitions]} as unknown as DocumentNode<DeckAddSubdeckMutation, DeckAddSubdeckMutationVariables>;
export const DeckCreateDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"DeckCreate"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"answerLang"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"cards"}},"type":{"kind":"NonNullType","type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CardCreateInput"}}}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"description"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"JSONObject"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"name"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"promptLang"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"published"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"deckCreate"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"answerLang"},"value":{"kind":"Variable","name":{"kind":"Name","value":"answerLang"}}},{"kind":"Argument","name":{"kind":"Name","value":"cards"},"value":{"kind":"Variable","name":{"kind":"Name","value":"cards"}}},{"kind":"Argument","name":{"kind":"Name","value":"description"},"value":{"kind":"Variable","name":{"kind":"Name","value":"description"}}},{"kind":"Argument","name":{"kind":"Name","value":"name"},"value":{"kind":"Variable","name":{"kind":"Name","value":"name"}}},{"kind":"Argument","name":{"kind":"Name","value":"promptLang"},"value":{"kind":"Variable","name":{"kind":"Name","value":"promptLang"}}},{"kind":"Argument","name":{"kind":"Name","value":"published"},"value":{"kind":"Variable","name":{"kind":"Name","value":"published"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"deckDetail"}}]}}]}},...DeckDetailFragmentDoc.definitions]} as unknown as DocumentNode<DeckCreateMutation, DeckCreateMutationVariables>;
export const DeckEditDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"DeckEdit"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"answerLang"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"description"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"JSONObject"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"name"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"promptLang"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"published"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"deckEdit"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"answerLang"},"value":{"kind":"Variable","name":{"kind":"Name","value":"answerLang"}}},{"kind":"Argument","name":{"kind":"Name","value":"description"},"value":{"kind":"Variable","name":{"kind":"Name","value":"description"}}},{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}},{"kind":"Argument","name":{"kind":"Name","value":"name"},"value":{"kind":"Variable","name":{"kind":"Name","value":"name"}}},{"kind":"Argument","name":{"kind":"Name","value":"promptLang"},"value":{"kind":"Variable","name":{"kind":"Name","value":"promptLang"}}},{"kind":"Argument","name":{"kind":"Name","value":"published"},"value":{"kind":"Variable","name":{"kind":"Name","value":"published"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"deckDetail"}}]}}]}},...DeckDetailFragmentDoc.definitions]} as unknown as DocumentNode<DeckEditMutation, DeckEditMutationVariables>;
export const DeckRemoveSubdeckDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"DeckRemoveSubdeck"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"subdeckId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"deckRemoveSubdeck"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}},{"kind":"Argument","name":{"kind":"Name","value":"subdeckId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"subdeckId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"deckSubdecks"}}]}}]}},...DeckSubdecksFragmentDoc.definitions]} as unknown as DocumentNode<DeckRemoveSubdeckMutation, DeckRemoveSubdeckMutationVariables>;
export const DecksDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"Decks"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"cursor"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"scope"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"DecksQueryScope"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"take"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"titleFilter"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"decks"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"cursor"},"value":{"kind":"Variable","name":{"kind":"Name","value":"cursor"}}},{"kind":"Argument","name":{"kind":"Name","value":"scope"},"value":{"kind":"Variable","name":{"kind":"Name","value":"scope"}}},{"kind":"Argument","name":{"kind":"Name","value":"take"},"value":{"kind":"Variable","name":{"kind":"Name","value":"take"}}},{"kind":"Argument","name":{"kind":"Name","value":"titleFilter"},"value":{"kind":"Variable","name":{"kind":"Name","value":"titleFilter"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"deckSummary"}}]}}]}},...DeckSummaryFragmentDoc.definitions]} as unknown as DocumentNode<DecksQuery, DecksQueryVariables>;
export const FinalizeOauthSigninDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"FinalizeOauthSignin"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"code"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"provider"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"nonce"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"redirect_uri"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"finalizeOauthSignin"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"code"},"value":{"kind":"Variable","name":{"kind":"Name","value":"code"}}},{"kind":"Argument","name":{"kind":"Name","value":"provider"},"value":{"kind":"Variable","name":{"kind":"Name","value":"provider"}}},{"kind":"Argument","name":{"kind":"Name","value":"nonce"},"value":{"kind":"Variable","name":{"kind":"Name","value":"nonce"}}},{"kind":"Argument","name":{"kind":"Name","value":"redirect_uri"},"value":{"kind":"Variable","name":{"kind":"Name","value":"redirect_uri"}}}]}]}}]} as unknown as DocumentNode<FinalizeOauthSigninMutation, FinalizeOauthSigninMutationVariables>;
export const HealthQueryDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"HealthQuery"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"health"}}]}}]} as unknown as DocumentNode<HealthQueryQuery, HealthQueryQueryVariables>;
export const InitializeOauthSigninDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"InitializeOauthSignin"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"initializeOauthSignin"}}]}}]} as unknown as DocumentNode<InitializeOauthSigninMutation, InitializeOauthSigninMutationVariables>;
export const OccupyingActiveRoomsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"OccupyingActiveRooms"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"occupyingActiveRooms"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"roomSummary"}}]}}]}},...RoomSummaryFragmentDoc.definitions]} as unknown as DocumentNode<OccupyingActiveRoomsQuery, OccupyingActiveRoomsQueryVariables>;
export const RefreshDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"Refresh"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"token"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"JWT"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"refresh"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"token"},"value":{"kind":"Variable","name":{"kind":"Name","value":"token"}}}]}]}}]} as unknown as DocumentNode<RefreshMutation, RefreshMutationVariables>;
export const RepeatHealthSubscriptionDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"subscription","name":{"kind":"Name","value":"RepeatHealthSubscription"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"repeatHealth"}}]}}]} as unknown as DocumentNode<RepeatHealthSubscriptionSubscription, RepeatHealthSubscriptionSubscriptionVariables>;
export const RoomCreateDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"RoomCreate"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"roomCreate"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"roomDetail"}}]}}]}},...RoomDetailFragmentDoc.definitions]} as unknown as DocumentNode<RoomCreateMutation, RoomCreateMutationVariables>;
export const UserDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"User"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"user"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"facebookId"}},{"kind":"Field","name":{"kind":"Name","value":"googleId"}},{"kind":"Field","name":{"kind":"Name","value":"isPublic"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]} as unknown as DocumentNode<UserQuery, UserQueryVariables>;
export const UserEditDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UserEdit"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"isPublic"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"name"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"userEdit"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"isPublic"},"value":{"kind":"Variable","name":{"kind":"Name","value":"isPublic"}}},{"kind":"Argument","name":{"kind":"Name","value":"name"},"value":{"kind":"Variable","name":{"kind":"Name","value":"name"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"facebookId"}},{"kind":"Field","name":{"kind":"Name","value":"googleId"}},{"kind":"Field","name":{"kind":"Name","value":"isPublic"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]} as unknown as DocumentNode<UserEditMutation, UserEditMutationVariables>;