/**
 * This file was generated by Nexus Schema
 * Do not make changes to this file directly
 */

import type * as p from "./../node_modules/.prisma/client/index"
import type { Context } from "./../src/context"
import type { FieldAuthorizeResolver } from "nexus/dist/plugins/fieldAuthorizePlugin"
import type { core } from "nexus"
declare global {
  interface NexusGenCustomInputMethods<TypeName extends string> {
    /**
     * A date-time string at UTC, such as 2007-12-03T10:15:30Z, compliant with the `date-time` format outlined in section 5.6 of the RFC 3339 profile of the ISO 8601 standard for representation of dates and times using the Gregorian calendar.
     */
    dateTime<FieldName extends string>(fieldName: FieldName, opts?: core.CommonInputFieldConfig<TypeName, FieldName>): void // "DateTime";
    /**
     * A field whose value conforms to the standard internet email address format as specified in RFC822: https://www.w3.org/Protocols/rfc822/.
     */
    emailAddress<FieldName extends string>(fieldName: FieldName, opts?: core.CommonInputFieldConfig<TypeName, FieldName>): void // "EmailAddress";
    /**
     * The `JSON` scalar type represents JSON values as specified by [ECMA-404](http://www.ecma-international.org/publications/files/ECMA-ST/ECMA-404.pdf).
     */
    json<FieldName extends string>(fieldName: FieldName, opts?: core.CommonInputFieldConfig<TypeName, FieldName>): void // "JSON";
    /**
     * The `JSONObject` scalar type represents JSON objects as specified by [ECMA-404](http://www.ecma-international.org/publications/files/ECMA-ST/ECMA-404.pdf).
     */
    jsonObject<FieldName extends string>(fieldName: FieldName, opts?: core.CommonInputFieldConfig<TypeName, FieldName>): void // "JSONObject";
    /**
     * A field whose value is a JSON Web Token (JWT): https://jwt.io/introduction.
     */
    jwt<FieldName extends string>(fieldName: FieldName, opts?: core.CommonInputFieldConfig<TypeName, FieldName>): void // "JWT";
    /**
     * A field whose value is a generic Universally Unique Identifier: https://en.wikipedia.org/wiki/Universally_unique_identifier.
     */
    uuid<FieldName extends string>(fieldName: FieldName, opts?: core.CommonInputFieldConfig<TypeName, FieldName>): void // "UUID";
  }
}
declare global {
  interface NexusGenCustomOutputMethods<TypeName extends string> {
    /**
     * A date-time string at UTC, such as 2007-12-03T10:15:30Z, compliant with the `date-time` format outlined in section 5.6 of the RFC 3339 profile of the ISO 8601 standard for representation of dates and times using the Gregorian calendar.
     */
    dateTime<FieldName extends string>(fieldName: FieldName, ...opts: core.ScalarOutSpread<TypeName, FieldName>): void // "DateTime";
    /**
     * A field whose value conforms to the standard internet email address format as specified in RFC822: https://www.w3.org/Protocols/rfc822/.
     */
    emailAddress<FieldName extends string>(fieldName: FieldName, ...opts: core.ScalarOutSpread<TypeName, FieldName>): void // "EmailAddress";
    /**
     * The `JSON` scalar type represents JSON values as specified by [ECMA-404](http://www.ecma-international.org/publications/files/ECMA-ST/ECMA-404.pdf).
     */
    json<FieldName extends string>(fieldName: FieldName, ...opts: core.ScalarOutSpread<TypeName, FieldName>): void // "JSON";
    /**
     * The `JSONObject` scalar type represents JSON objects as specified by [ECMA-404](http://www.ecma-international.org/publications/files/ECMA-ST/ECMA-404.pdf).
     */
    jsonObject<FieldName extends string>(fieldName: FieldName, ...opts: core.ScalarOutSpread<TypeName, FieldName>): void // "JSONObject";
    /**
     * A field whose value is a JSON Web Token (JWT): https://jwt.io/introduction.
     */
    jwt<FieldName extends string>(fieldName: FieldName, ...opts: core.ScalarOutSpread<TypeName, FieldName>): void // "JWT";
    /**
     * A field whose value is a generic Universally Unique Identifier: https://en.wikipedia.org/wiki/Universally_unique_identifier.
     */
    uuid<FieldName extends string>(fieldName: FieldName, ...opts: core.ScalarOutSpread<TypeName, FieldName>): void // "UUID";
  }
}


declare global {
  interface NexusGen extends NexusGenTypes {}
}

export interface NexusGenInputs {
  CardCreateInput: { // input type
    answers: string[]; // [String!]!
    fullAnswer: NexusGenScalars['JSONObject']; // JSONObject!
    prompt: NexusGenScalars['JSONObject']; // JSONObject!
    template?: boolean | null; // Boolean
  }
}

export interface NexusGenEnums {
  DecksQueryScope: "OWNED" | "PARTICIPATED" | "UNARCHIVED" | "VISIBLE"
  MessageContentType: "CONFIG" | "CONTEST_SCORE" | "ROUND_SCORE" | "ROUND_START" | "ROUND_WIN" | "TEXT"
  RoomState: p.RoomState
}

export interface NexusGenScalars {
  String: string
  Int: number
  Float: number
  Boolean: boolean
  ID: string
  DateTime: Date
  EmailAddress: string
  JSON: unknown
  JSONObject: Record<string, unknown>
  JWT: string
  UUID: string
}

export interface NexusGenObjects {
  Card: p.Card;
  Deck: p.Deck;
  Message: p.Message;
  Mutation: {};
  Query: {};
  Room: p.Room;
  Subscription: {};
  User: p.User;
  UserCardRecord: p.UserCardRecord;
  UserDeckRecord: p.UserDeckRecord;
}

export interface NexusGenInterfaces {
}

export interface NexusGenUnions {
}

export type NexusGenRootTypes = NexusGenObjects

export type NexusGenAllTypes = NexusGenRootTypes & NexusGenScalars & NexusGenEnums

export interface NexusGenFieldTypes {
  Card: { // field return type
    answers: string[]; // [String!]!
    editedAt: NexusGenScalars['DateTime']; // DateTime!
    fullAnswer: NexusGenScalars['JSONObject']; // JSONObject!
    id: string; // ID!
    mainTemplate: boolean; // Boolean!
    ownRecord: NexusGenRootTypes['UserCardRecord'] | null; // UserCardRecord
    prompt: NexusGenScalars['JSONObject']; // JSONObject!
    template: boolean; // Boolean!
  }
  Deck: { // field return type
    answerLang: string; // String!
    archived: boolean; // Boolean!
    cardsAllUnder: NexusGenRootTypes['Card'][]; // [Card!]!
    cardsDirect: NexusGenRootTypes['Card'][]; // [Card!]!
    descendantDecks: NexusGenRootTypes['Deck'][]; // [Deck!]!
    description: NexusGenScalars['JSONObject']; // JSONObject!
    editedAt: NexusGenScalars['DateTime']; // DateTime!
    id: string; // ID!
    name: string; // String!
    ownRecord: NexusGenRootTypes['UserDeckRecord'] | null; // UserDeckRecord
    owner: NexusGenRootTypes['User']; // User!
    ownerId: string; // ID!
    promptLang: string; // String!
    published: boolean; // Boolean!
    sortData: string[]; // [String!]!
    subdecks: NexusGenRootTypes['Deck'][]; // [Deck!]!
    usedAt: NexusGenScalars['DateTime']; // DateTime!
  }
  Message: { // field return type
    content: NexusGenScalars['JSON']; // JSON!
    createdAt: NexusGenScalars['DateTime']; // DateTime!
    id: string; // ID!
    room: NexusGenRootTypes['Room']; // Room!
    roomId: string; // ID!
    sender: NexusGenRootTypes['User'] | null; // User
    senderId: string | null; // ID
    type: NexusGenEnums['MessageContentType']; // MessageContentType!
  }
  Mutation: { // field return type
    cardCreate: NexusGenRootTypes['Card']; // Card!
    cardDelete: NexusGenRootTypes['Card']; // Card!
    cardEdit: NexusGenRootTypes['Card']; // Card!
    cardUnsetMainTemplate: NexusGenRootTypes['Card'] | null; // Card
    deckAddSubdeck: NexusGenRootTypes['Deck']; // Deck!
    deckCreate: NexusGenRootTypes['Deck']; // Deck!
    deckDelete: NexusGenRootTypes['Deck']; // Deck!
    deckEdit: NexusGenRootTypes['Deck']; // Deck!
    deckRemoveSubdeck: NexusGenRootTypes['Deck']; // Deck!
    deckUsed: NexusGenRootTypes['Deck']; // Deck!
    finalizeThirdPartyOauthSignin: NexusGenScalars['JWT'] | null; // JWT
    initializeThirdPartyOauthSignin: string; // String!
    messageCreate: NexusGenRootTypes['Message']; // Message!
    ownCardRecordSet: NexusGenRootTypes['UserCardRecord'] | null; // UserCardRecord
    ownDeckRecordSet: NexusGenRootTypes['UserDeckRecord']; // UserDeckRecord!
    roomAddOccupant: NexusGenRootTypes['Room']; // Room!
    roomAddOccupantByName: NexusGenRootTypes['Room']; // Room!
    roomCleanUpDead: number; // Int!
    roomCreate: NexusGenRootTypes['Room']; // Room!
    roomEditOwnerConfig: NexusGenRootTypes['Room']; // Room!
    roomSetState: NexusGenRootTypes['Room']; // Room!
    userEdit: NexusGenRootTypes['User']; // User!
  }
  Query: { // field return type
    deck: NexusGenRootTypes['Deck']; // Deck!
    decks: NexusGenRootTypes['Deck'][]; // [Deck!]!
    health: string; // String!
    message: NexusGenRootTypes['Message']; // Message!
    messagesOfRoom: NexusGenRootTypes['Message'][]; // [Message!]!
    occupyingRooms: NexusGenRootTypes['Room'][]; // [Room!]!
    ownDeckRecord: NexusGenRootTypes['UserDeckRecord'] | null; // UserDeckRecord
    room: NexusGenRootTypes['Room']; // Room!
    user: NexusGenRootTypes['User']; // User!
  }
  Room: { // field return type
    id: string; // ID!
    internalConfig: NexusGenScalars['JSONObject']; // JSONObject!
    messages: NexusGenRootTypes['Message'][]; // [Message!]!
    occupants: NexusGenRootTypes['User'][]; // [User!]!
    owner: NexusGenRootTypes['User']; // User!
    ownerConfig: NexusGenScalars['JSONObject']; // JSONObject!
    ownerId: string; // ID!
    state: NexusGenEnums['RoomState']; // RoomState!
  }
  Subscription: { // field return type
    repeatHealth: string; // String!
  }
  User: { // field return type
    decks: NexusGenRootTypes['Deck'][]; // [Deck!]!
    facebookId: string | null; // String
    googleId: string | null; // String
    id: string; // ID!
    isPublic: boolean; // Boolean!
    name: string | null; // String
    occupyingRooms: NexusGenRootTypes['Room'][]; // [Room!]!
    ownedRooms: NexusGenRootTypes['Room'][]; // [Room!]!
    roles: string[]; // [String!]!
  }
  UserCardRecord: { // field return type
    correctRecord: NexusGenScalars['DateTime'][]; // [DateTime!]!
  }
  UserDeckRecord: { // field return type
    notes: NexusGenScalars['JSONObject']; // JSONObject!
  }
}

export interface NexusGenFieldTypeNames {
  Card: { // field return type name
    answers: 'String'
    editedAt: 'DateTime'
    fullAnswer: 'JSONObject'
    id: 'ID'
    mainTemplate: 'Boolean'
    ownRecord: 'UserCardRecord'
    prompt: 'JSONObject'
    template: 'Boolean'
  }
  Deck: { // field return type name
    answerLang: 'String'
    archived: 'Boolean'
    cardsAllUnder: 'Card'
    cardsDirect: 'Card'
    descendantDecks: 'Deck'
    description: 'JSONObject'
    editedAt: 'DateTime'
    id: 'ID'
    name: 'String'
    ownRecord: 'UserDeckRecord'
    owner: 'User'
    ownerId: 'ID'
    promptLang: 'String'
    published: 'Boolean'
    sortData: 'String'
    subdecks: 'Deck'
    usedAt: 'DateTime'
  }
  Message: { // field return type name
    content: 'JSON'
    createdAt: 'DateTime'
    id: 'ID'
    room: 'Room'
    roomId: 'ID'
    sender: 'User'
    senderId: 'ID'
    type: 'MessageContentType'
  }
  Mutation: { // field return type name
    cardCreate: 'Card'
    cardDelete: 'Card'
    cardEdit: 'Card'
    cardUnsetMainTemplate: 'Card'
    deckAddSubdeck: 'Deck'
    deckCreate: 'Deck'
    deckDelete: 'Deck'
    deckEdit: 'Deck'
    deckRemoveSubdeck: 'Deck'
    deckUsed: 'Deck'
    finalizeThirdPartyOauthSignin: 'JWT'
    initializeThirdPartyOauthSignin: 'String'
    messageCreate: 'Message'
    ownCardRecordSet: 'UserCardRecord'
    ownDeckRecordSet: 'UserDeckRecord'
    roomAddOccupant: 'Room'
    roomAddOccupantByName: 'Room'
    roomCleanUpDead: 'Int'
    roomCreate: 'Room'
    roomEditOwnerConfig: 'Room'
    roomSetState: 'Room'
    userEdit: 'User'
  }
  Query: { // field return type name
    deck: 'Deck'
    decks: 'Deck'
    health: 'String'
    message: 'Message'
    messagesOfRoom: 'Message'
    occupyingRooms: 'Room'
    ownDeckRecord: 'UserDeckRecord'
    room: 'Room'
    user: 'User'
  }
  Room: { // field return type name
    id: 'ID'
    internalConfig: 'JSONObject'
    messages: 'Message'
    occupants: 'User'
    owner: 'User'
    ownerConfig: 'JSONObject'
    ownerId: 'ID'
    state: 'RoomState'
  }
  Subscription: { // field return type name
    repeatHealth: 'String'
  }
  User: { // field return type name
    decks: 'Deck'
    facebookId: 'String'
    googleId: 'String'
    id: 'ID'
    isPublic: 'Boolean'
    name: 'String'
    occupyingRooms: 'Room'
    ownedRooms: 'Room'
    roles: 'String'
  }
  UserCardRecord: { // field return type name
    correctRecord: 'DateTime'
  }
  UserDeckRecord: { // field return type name
    notes: 'JSONObject'
  }
}

export interface NexusGenArgTypes {
  Mutation: {
    cardCreate: { // args
      card: NexusGenInputs['CardCreateInput']; // CardCreateInput!
      deckId: string; // ID!
      mainTemplate?: boolean | null; // Boolean
    }
    cardDelete: { // args
      id: string; // ID!
    }
    cardEdit: { // args
      answers?: string[] | null; // [String!]
      fullAnswer?: NexusGenScalars['JSONObject'] | null; // JSONObject
      id: string; // ID!
      mainTemplate?: boolean | null; // Boolean
      prompt?: NexusGenScalars['JSONObject'] | null; // JSONObject
      template?: boolean | null; // Boolean
    }
    cardUnsetMainTemplate: { // args
      deckId: string; // ID!
    }
    deckAddSubdeck: { // args
      id: string; // ID!
      subdeckId: string; // ID!
    }
    deckCreate: { // args
      answerLang?: string | null; // String
      archived?: boolean | null; // Boolean
      cards?: NexusGenInputs['CardCreateInput'][] | null; // [CardCreateInput!]
      description?: NexusGenScalars['JSONObject'] | null; // JSONObject
      name?: string | null; // String
      promptLang?: string | null; // String
      published?: boolean | null; // Boolean
    }
    deckDelete: { // args
      id: string; // ID!
    }
    deckEdit: { // args
      answerLang?: string | null; // String
      archived?: boolean | null; // Boolean
      description?: NexusGenScalars['JSONObject'] | null; // JSONObject
      id: string; // ID!
      name?: string | null; // String
      promptLang?: string | null; // String
      published?: boolean | null; // Boolean
    }
    deckRemoveSubdeck: { // args
      id: string; // ID!
      subdeckId: string; // ID!
    }
    deckUsed: { // args
      id: string; // ID!
    }
    finalizeThirdPartyOauthSignin: { // args
      code: string; // String!
      nonce: string; // String!
      provider: string; // String!
      redirect_uri: string; // String!
    }
    messageCreate: { // args
      content?: NexusGenScalars['JSON'] | null; // JSON
      roomId: string; // ID!
      type: NexusGenEnums['MessageContentType']; // MessageContentType!
    }
    ownCardRecordSet: { // args
      cardId: string; // ID!
      correctRecordAppend: NexusGenScalars['DateTime'][]; // [DateTime!]!
    }
    ownDeckRecordSet: { // args
      deckId: string; // ID!
      notes: NexusGenScalars['JSONObject']; // JSONObject!
    }
    roomAddOccupant: { // args
      id: string; // ID!
      occupantId: string; // ID!
    }
    roomAddOccupantByName: { // args
      id: string; // ID!
      name: string; // String!
    }
    roomCreate: { // args
      ownerConfig: NexusGenScalars['JSONObject']; // JSONObject!
    }
    roomEditOwnerConfig: { // args
      id: string; // ID!
      ownerConfig: NexusGenScalars['JSONObject']; // JSONObject!
    }
    roomSetState: { // args
      id: string; // ID!
      state: NexusGenEnums['RoomState']; // RoomState!
    }
    userEdit: { // args
      isPublic?: boolean | null; // Boolean
      name?: string | null; // String
    }
  }
  Query: {
    deck: { // args
      id: string; // ID!
    }
    decks: { // args
      cursor?: string | null; // ID
      scope?: NexusGenEnums['DecksQueryScope'] | null; // DecksQueryScope
      take?: number | null; // Int
      titleFilter?: string | null; // String
    }
    message: { // args
      id: string; // ID!
    }
    messagesOfRoom: { // args
      id: string; // ID!
    }
    ownDeckRecord: { // args
      deckId: string; // ID!
    }
    room: { // args
      id: string; // ID!
    }
    user: { // args
      id?: string | null; // ID
    }
  }
}

export interface NexusGenAbstractTypeMembers {
}

export interface NexusGenTypeInterfaces {
}

export type NexusGenObjectNames = keyof NexusGenObjects;

export type NexusGenInputNames = keyof NexusGenInputs;

export type NexusGenEnumNames = keyof NexusGenEnums;

export type NexusGenInterfaceNames = never;

export type NexusGenScalarNames = keyof NexusGenScalars;

export type NexusGenUnionNames = never;

export type NexusGenObjectsUsingAbstractStrategyIsTypeOf = never;

export type NexusGenAbstractsUsingStrategyResolveType = never;

export type NexusGenFeaturesConfig = {
  abstractTypeStrategies: {
    isTypeOf: false
    resolveType: true
    __typename: false
  }
}

export interface NexusGenTypes {
  context: Context;
  inputTypes: NexusGenInputs;
  rootTypes: NexusGenRootTypes;
  inputTypeShapes: NexusGenInputs & NexusGenEnums & NexusGenScalars;
  argTypes: NexusGenArgTypes;
  fieldTypes: NexusGenFieldTypes;
  fieldTypeNames: NexusGenFieldTypeNames;
  allTypes: NexusGenAllTypes;
  typeInterfaces: NexusGenTypeInterfaces;
  objectNames: NexusGenObjectNames;
  inputNames: NexusGenInputNames;
  enumNames: NexusGenEnumNames;
  interfaceNames: NexusGenInterfaceNames;
  scalarNames: NexusGenScalarNames;
  unionNames: NexusGenUnionNames;
  allInputTypes: NexusGenTypes['inputNames'] | NexusGenTypes['enumNames'] | NexusGenTypes['scalarNames'];
  allOutputTypes: NexusGenTypes['objectNames'] | NexusGenTypes['enumNames'] | NexusGenTypes['unionNames'] | NexusGenTypes['interfaceNames'] | NexusGenTypes['scalarNames'];
  allNamedTypes: NexusGenTypes['allInputTypes'] | NexusGenTypes['allOutputTypes']
  abstractTypes: NexusGenTypes['interfaceNames'] | NexusGenTypes['unionNames'];
  abstractTypeMembers: NexusGenAbstractTypeMembers;
  objectsUsingAbstractStrategyIsTypeOf: NexusGenObjectsUsingAbstractStrategyIsTypeOf;
  abstractsUsingStrategyResolveType: NexusGenAbstractsUsingStrategyResolveType;
  features: NexusGenFeaturesConfig;
}


declare global {
  interface NexusGenPluginTypeConfig<TypeName extends string> {
  }
  interface NexusGenPluginInputTypeConfig<TypeName extends string> {
  }
  interface NexusGenPluginFieldConfig<TypeName extends string, FieldName extends string> {
    /**
     * Authorization for an individual field. Returning "true"
     * or "Promise<true>" means the field can be accessed.
     * Returning "false" or "Promise<false>" will respond
     * with a "Not Authorized" error for the field.
     * Returning or throwing an error will also prevent the
     * resolver from executing.
     */
    authorize?: FieldAuthorizeResolver<TypeName, FieldName>
  }
  interface NexusGenPluginInputFieldConfig<TypeName extends string, FieldName extends string> {
    /**
     * Whether the type, if nullable, allows only `undefined` values; i.e.
     * `null` values are an error.
     */
    undefinedOnly?: boolean
  }
  interface NexusGenPluginSchemaConfig {
  }
  interface NexusGenPluginArgConfig {
    /**
     * Whether the type, if nullable, allows only `undefined` values; i.e.
     * `null` values are an error.
     */
    undefinedOnly?: boolean
  }
}