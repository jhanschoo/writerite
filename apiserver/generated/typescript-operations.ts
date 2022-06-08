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
  DateTime: any;
  /** A field whose value conforms to the standard internet email address format as specified in RFC822: https://www.w3.org/Protocols/rfc822/. */
  EmailAddress: any;
  /** The `JSON` scalar type represents JSON values as specified by [ECMA-404](http://www.ecma-international.org/publications/files/ECMA-ST/ECMA-404.pdf). */
  JSON: any;
  /** The `JSONObject` scalar type represents JSON objects as specified by [ECMA-404](http://www.ecma-international.org/publications/files/ECMA-ST/ECMA-404.pdf). */
  JSONObject: any;
  /** A field whose value is a JSON Web Token (JWT): https://jwt.io/introduction. */
  JWT: any;
  /** A field whose value is a generic Universally Unique Identifier: https://en.wikipedia.org/wiki/Universally_unique_identifier. */
  UUID: any;
};

export type Card = {
  __typename?: 'Card';
  answers: Array<Scalars['String']>;
  editedAt: Scalars['DateTime'];
  fullAnswer: Scalars['JSONObject'];
  id: Scalars['ID'];
  mainTemplate: Scalars['Boolean'];
  ownRecord?: Maybe<UserCardRecord>;
  prompt: Scalars['JSONObject'];
  sortKey: Scalars['String'];
  template: Scalars['Boolean'];
};

export type CardCreateInput = {
  answers: Array<Scalars['String']>;
  fullAnswer: Scalars['JSONObject'];
  prompt: Scalars['JSONObject'];
  sortKey?: InputMaybe<Scalars['String']>;
  template?: InputMaybe<Scalars['Boolean']>;
};

export type Deck = {
  __typename?: 'Deck';
  answerLang: Scalars['String'];
  archived: Scalars['Boolean'];
  /** all cards directly belonging to some descendant (reflexive, transitive closure of subdeck) deck of this deck */
  cardsAllUnder: Array<Card>;
  /** all cards directly belonging to this deck */
  cardsDirect: Array<Card>;
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
  /** all direct subdecks of this deck */
  subdecks: Array<Deck>;
  usedAt: Scalars['DateTime'];
};

export enum DecksQueryScope {
  Owned = 'OWNED',
  Participated = 'PARTICIPATED',
  Unarchived = 'UNARCHIVED',
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
  deckAddSubdeck: Deck;
  deckCreate: Deck;
  deckDelete: Deck;
  deckEdit: Deck;
  deckRemoveSubdeck: Deck;
  deckUsed: Deck;
  finalizeThirdPartyOauthSignin?: Maybe<Scalars['JWT']>;
  initializeThirdPartyOauthSignin: Scalars['String'];
  /**
   * @subscriptionsTriggered(
   *     signatures: ["chatMsgsOfRoomUpdates"]
   *   )
   */
  messageCreate: Message;
  ownCardRecordSet?: Maybe<UserCardRecord>;
  ownDeckRecordSet: UserDeckRecord;
  /**
   * @subscriptionsTriggered(
   *     signatures: ["roomUpdates", "roomsUpdates"]
   *   )
   */
  roomAddOccupant: Room;
  /**
   * @subscriptionsTriggered(
   *     signatures: ["roomUpdates", "roomsUpdates"]
   *   )
   */
  roomAddOccupantByName: Room;
  /**
   * @subscriptionsTriggered(
   *     signatures: ["roomUpdates", "roomsUpdates"]
   *   )
   */
  roomCleanUpDead: Scalars['Int'];
  /**
   * @subscriptionsTriggered(
   *     signatures: ["roomUpdates", "roomsUpdates"]
   *   )
   */
  roomCreate: Room;
  /**
   * @subscriptionsTriggered(
   *     signatures: ["roomUpdates", "roomsUpdates"]
   *   )
   */
  roomEditOwnerConfig: Room;
  /**
   * @subscriptionsTriggered(
   *     signatures: ["roomUpdates", "roomsUpdates"]
   *   )
   */
  roomSetState: Room;
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
  sortKey?: InputMaybe<Scalars['String']>;
  template?: InputMaybe<Scalars['Boolean']>;
};


export type MutationCardUnsetMainTemplateArgs = {
  deckId: Scalars['ID'];
};


export type MutationDeckAddSubdeckArgs = {
  id: Scalars['ID'];
  subdeckId: Scalars['ID'];
};


export type MutationDeckCreateArgs = {
  answerLang?: InputMaybe<Scalars['String']>;
  archived?: InputMaybe<Scalars['Boolean']>;
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
  archived?: InputMaybe<Scalars['Boolean']>;
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


export type MutationFinalizeThirdPartyOauthSigninArgs = {
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


export type MutationRoomAddOccupantArgs = {
  id: Scalars['ID'];
  occupantId: Scalars['ID'];
};


export type MutationRoomAddOccupantByNameArgs = {
  id: Scalars['ID'];
  name: Scalars['String'];
};


export type MutationRoomCreateArgs = {
  ownerConfig: Scalars['JSONObject'];
};


export type MutationRoomEditOwnerConfigArgs = {
  id: Scalars['ID'];
  ownerConfig: Scalars['JSONObject'];
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
  occupyingRooms: Array<Room>;
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
  id: Scalars['ID'];
  internalConfig: Scalars['JSONObject'];
  messages: Array<Message>;
  occupants: Array<User>;
  owner: User;
  ownerConfig: Scalars['JSONObject'];
  ownerId: Scalars['ID'];
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
  occupyingRooms: Array<Room>;
  ownedRooms: Array<Room>;
  roles: Array<Scalars['String']>;
};

export type UserCardRecord = {
  __typename?: 'UserCardRecord';
  cardId: Scalars['ID'];
  correctRecord: Array<Scalars['DateTime']>;
  userId: Scalars['ID'];
};

export type UserDeckRecord = {
  __typename?: 'UserDeckRecord';
  deckId: Scalars['ID'];
  notes: Scalars['JSONObject'];
  userId: Scalars['ID'];
};

export type DeckCreateEmptyMutationVariables = Exact<{ [key: string]: never; }>;


export type DeckCreateEmptyMutation = { __typename?: 'Mutation', deckCreate: { __typename?: 'Deck', id: string } };

export type DeckAddSubdeckMutationVariables = Exact<{
  id: Scalars['ID'];
  subdeckId: Scalars['ID'];
}>;


export type DeckAddSubdeckMutation = { __typename?: 'Mutation', deckAddSubdeck: { __typename?: 'Deck', id: string } };

export type DeckRemoveSubdeckMutationVariables = Exact<{
  id: Scalars['ID'];
  subdeckId: Scalars['ID'];
}>;


export type DeckRemoveSubdeckMutation = { __typename?: 'Mutation', deckRemoveSubdeck: { __typename?: 'Deck', id: string } };

export type DeckEditNameMutationVariables = Exact<{
  id: Scalars['ID'];
  name: Scalars['String'];
}>;


export type DeckEditNameMutation = { __typename?: 'Mutation', deckEdit: { __typename?: 'Deck', id: string, name: string } };

export type DeckUsedMutationVariables = Exact<{
  id: Scalars['ID'];
}>;


export type DeckUsedMutation = { __typename?: 'Mutation', deckUsed: { __typename?: 'Deck', id: string } };

export type DeckQueryVariables = Exact<{
  id: Scalars['ID'];
}>;


export type DeckQuery = { __typename?: 'Query', deck: { __typename?: 'Deck', id: string, answerLang: string, archived: boolean, description: any, editedAt: any, name: string, ownerId: string, promptLang: string, published: boolean, usedAt: any } };

export type DecksQueryVariables = Exact<{ [key: string]: never; }>;


export type DecksQuery = { __typename?: 'Query', decks: Array<{ __typename?: 'Deck', id: string }> };

export type HealthQueryVariables = Exact<{ [key: string]: never; }>;


export type HealthQuery = { __typename?: 'Query', health: string };

export type CreateUserMutationVariables = Exact<{
  code: Scalars['String'];
  nonce: Scalars['String'];
  provider: Scalars['String'];
  redirect_uri: Scalars['String'];
}>;


export type CreateUserMutation = { __typename?: 'Mutation', finalizeThirdPartyOauthSignin?: any | null };

export type NameUserMutationVariables = Exact<{
  name: Scalars['String'];
}>;


export type NameUserMutation = { __typename?: 'Mutation', userEdit: { __typename?: 'User', id: string, name?: string | null } };

export type UserAccessibleUserScalarsQueryVariables = Exact<{
  id: Scalars['ID'];
}>;


export type UserAccessibleUserScalarsQuery = { __typename?: 'Query', user: { __typename?: 'User', id: string, isPublic: boolean, name?: string | null, roles: Array<string> } };

export type UserPublicScalarsQueryVariables = Exact<{
  id: Scalars['ID'];
}>;


export type UserPublicScalarsQuery = { __typename?: 'Query', user: { __typename?: 'User', id: string, isPublic: boolean } };

export type UserEditMutationVariables = Exact<{
  name?: InputMaybe<Scalars['String']>;
  isPublic?: InputMaybe<Scalars['Boolean']>;
}>;


export type UserEditMutation = { __typename?: 'Mutation', userEdit: { __typename?: 'User', id: string } };
