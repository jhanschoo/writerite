/* eslint-disable */
import * as types from './graphql';
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';

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
    "\n      mutation DeckCreateEmpty($input: DeckCreateMutationInput!) {\n        deckCreate(input: $input) {\n          id\n          answerLang\n          description\n          editedAt\n          name\n          owner {\n            id\n          }\n          promptLang\n          published\n          sortData\n        }\n      }\n    ": types.DeckCreateEmptyDocument,
    "\n      mutation DeckAddSubdeck($deckId: ID!, $subdeckId: ID!) {\n        deckAddSubdeck(deckId: $deckId, subdeckId: $subdeckId) {\n          id\n        }\n      }\n    ": types.DeckAddSubdeckDocument,
    "\n      mutation DeckRemoveSubdeck($deckId: ID!, $subdeckId: ID!) {\n        deckRemoveSubdeck(deckId: $deckId, subdeckId: $subdeckId) {\n          id\n        }\n      }\n    ": types.DeckRemoveSubdeckDocument,
    "\n      mutation DeckEdit($input: DeckEditMutationInput!) {\n        deckEdit(input: $input) {\n          id\n          name\n        }\n      }\n    ": types.DeckEditDocument,
    "\n      query Deck($id: ID!) {\n        deck(id: $id) {\n          answerLang\n          description\n          editedAt\n          name\n          owner {\n            id\n          }\n          promptLang\n          published\n          sortData\n        }\n      }\n    ": types.DeckDocument,
    "\n      query Decks(\n        $after: ID\n        $before: ID\n        $first: Int\n        $last: Int\n        $input: DecksQueryInput!\n      ) {\n        decks(\n          after: $after\n          before: $before\n          first: $first\n          last: $last\n          input: $input\n        ) {\n          edges {\n            cursor\n            node {\n              id\n            }\n          }\n          pageInfo {\n            endCursor\n            hasNextPage\n            hasPreviousPage\n            startCursor\n          }\n        }\n      }\n    ": types.DecksDocument,
    "\n      mutation Befriend($befriendedId: ID!) {\n        befriend(befriendedId: $befriendedId) {\n          id\n        }\n      }\n    ": types.BefriendDocument,
    "\n      query Health {\n        health\n      }\n    ": types.HealthDocument,
    "\n      subscription RepeatHealth {\n        repeatHealth\n      }\n    ": types.RepeatHealthDocument,
    "\n      mutation SendTextMessage($roomId: ID!, $textContent: String!) {\n        sendTextMessage(roomId: $roomId, textContent: $textContent) {\n          content\n          createdAt\n          id\n          sender {\n            id\n          }\n          type\n        }\n      }\n    ": types.SendTextMessageDocument,
    "\n      subscription MessageUpdatesByRoomId($id: ID!) {\n        messageUpdatesByRoomId(id: $id) {\n          operation\n          value {\n            content\n            createdAt\n            id\n            sender {\n              id\n            }\n            type\n          }\n        }\n      }\n    ": types.MessageUpdatesByRoomIdDocument,
    "\n      mutation RoomCreate {\n        roomCreate {\n          id\n          type\n          activeRound {\n            id\n            deck {\n              id\n            }\n            isActive\n            state\n            slug\n          }\n          occupants {\n            id\n          }\n        }\n      }\n    ": types.RoomCreateDocument,
    "\n      mutation RoomSetDeck($id: ID!, $deckId: ID!) {\n        roomSetDeck(id: $id, deckId: $deckId) {\n          id\n          type\n          activeRound {\n            id\n            deck {\n              id\n            }\n            isActive\n            state\n            slug\n          }\n          occupants {\n            id\n          }\n        }\n      }\n    ": types.RoomSetDeckDocument,
    "\n      mutation RoomStartRound($id: ID!) {\n        roomStartRound(id: $id) {\n          id\n          type\n          activeRound {\n            id\n            deck {\n              id\n            }\n            isActive\n            state\n            slug\n          }\n          occupants {\n            id\n          }\n        }\n      }\n    ": types.RoomStartRoundDocument,
    "\n      mutation RoomEndRound($id: ID!) {\n        roomEndRound(id: $id) {\n          id\n          type\n          activeRound {\n            id\n            deck {\n              id\n            }\n            isActive\n            state\n            slug\n          }\n          occupants {\n            id\n          }\n        }\n      }\n    ": types.RoomEndRoundDocument,
    "\n      mutation RoomArchive($id: ID!) {\n        roomArchive(id: $id) {\n          id\n          type\n          activeRound {\n            id\n            deck {\n              id\n            }\n            isActive\n            state\n            slug\n          }\n          occupants {\n            id\n          }\n        }\n      }\n    ": types.RoomArchiveDocument,
    "\n      mutation RoomJoin($id: ID!) {\n        roomJoin(id: $id) {\n          id\n          type\n          activeRound {\n            id\n            deck {\n              id\n            }\n            isActive\n            state\n            slug\n          }\n          occupants {\n            id\n          }\n        }\n      }\n    ": types.RoomJoinDocument,
    "\n      query Room($id: ID!) {\n        room(id: $id) {\n          id\n          type\n          activeRound {\n            id\n            deck {\n              id\n            }\n            isActive\n            state\n            slug\n          }\n          occupants {\n            id\n          }\n        }\n      }\n    ": types.RoomDocument,
    "\n      query OccupyingUnarchivedRooms {\n        occupyingUnarchivedRooms {\n          id\n          type\n          activeRound {\n            id\n            deck {\n              id\n            }\n            isActive\n            state\n            slug\n          }\n          occupants {\n            id\n          }\n        }\n      }\n    ": types.OccupyingUnarchivedRoomsDocument,
    "\n      subscription RoomUpdatesByRoomId($id: ID!) {\n        roomUpdatesByRoomId(id: $id) {\n          operation\n          value {\n            id\n            type\n            activeRound {\n              id\n              deck {\n                id\n              }\n              isActive\n              state\n              slug\n            }\n            occupants {\n              id\n            }\n          }\n        }\n      }\n    ": types.RoomUpdatesByRoomIdDocument,
    "\n      mutation CreateUser($input: FinalizeOauthSigninMutationInput!) {\n        finalizeOauthSignin(input: $input) {\n          currentUser\n          token\n        }\n      }\n    ": types.CreateUserDocument,
    "\n      mutation NameUser($input: OwnProfileEditMutationInput!) {\n        ownProfileEdit(input: $input) {\n          id\n          name\n        }\n      }\n    ": types.NameUserDocument,
    "\n      mutation Refresh($token: JWT!) {\n        refresh(token: $token) {\n          currentUser\n          token\n        }\n      }\n    ": types.RefreshDocument,
    "\n      query Me {\n        me {\n          isPublic\n          name\n          roles\n        }\n      }\n    ": types.MeDocument,
    "\n      mutation UserEdit($input: OwnProfileEditMutationInput!) {\n        ownProfileEdit(input: $input) {\n          id\n          name\n        }\n      }\n    ": types.UserEditDocument,
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
export function graphql(source: "\n      mutation DeckCreateEmpty($input: DeckCreateMutationInput!) {\n        deckCreate(input: $input) {\n          id\n          answerLang\n          description\n          editedAt\n          name\n          owner {\n            id\n          }\n          promptLang\n          published\n          sortData\n        }\n      }\n    "): (typeof documents)["\n      mutation DeckCreateEmpty($input: DeckCreateMutationInput!) {\n        deckCreate(input: $input) {\n          id\n          answerLang\n          description\n          editedAt\n          name\n          owner {\n            id\n          }\n          promptLang\n          published\n          sortData\n        }\n      }\n    "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n      mutation DeckAddSubdeck($deckId: ID!, $subdeckId: ID!) {\n        deckAddSubdeck(deckId: $deckId, subdeckId: $subdeckId) {\n          id\n        }\n      }\n    "): (typeof documents)["\n      mutation DeckAddSubdeck($deckId: ID!, $subdeckId: ID!) {\n        deckAddSubdeck(deckId: $deckId, subdeckId: $subdeckId) {\n          id\n        }\n      }\n    "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n      mutation DeckRemoveSubdeck($deckId: ID!, $subdeckId: ID!) {\n        deckRemoveSubdeck(deckId: $deckId, subdeckId: $subdeckId) {\n          id\n        }\n      }\n    "): (typeof documents)["\n      mutation DeckRemoveSubdeck($deckId: ID!, $subdeckId: ID!) {\n        deckRemoveSubdeck(deckId: $deckId, subdeckId: $subdeckId) {\n          id\n        }\n      }\n    "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n      mutation DeckEdit($input: DeckEditMutationInput!) {\n        deckEdit(input: $input) {\n          id\n          name\n        }\n      }\n    "): (typeof documents)["\n      mutation DeckEdit($input: DeckEditMutationInput!) {\n        deckEdit(input: $input) {\n          id\n          name\n        }\n      }\n    "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n      query Deck($id: ID!) {\n        deck(id: $id) {\n          answerLang\n          description\n          editedAt\n          name\n          owner {\n            id\n          }\n          promptLang\n          published\n          sortData\n        }\n      }\n    "): (typeof documents)["\n      query Deck($id: ID!) {\n        deck(id: $id) {\n          answerLang\n          description\n          editedAt\n          name\n          owner {\n            id\n          }\n          promptLang\n          published\n          sortData\n        }\n      }\n    "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n      query Decks(\n        $after: ID\n        $before: ID\n        $first: Int\n        $last: Int\n        $input: DecksQueryInput!\n      ) {\n        decks(\n          after: $after\n          before: $before\n          first: $first\n          last: $last\n          input: $input\n        ) {\n          edges {\n            cursor\n            node {\n              id\n            }\n          }\n          pageInfo {\n            endCursor\n            hasNextPage\n            hasPreviousPage\n            startCursor\n          }\n        }\n      }\n    "): (typeof documents)["\n      query Decks(\n        $after: ID\n        $before: ID\n        $first: Int\n        $last: Int\n        $input: DecksQueryInput!\n      ) {\n        decks(\n          after: $after\n          before: $before\n          first: $first\n          last: $last\n          input: $input\n        ) {\n          edges {\n            cursor\n            node {\n              id\n            }\n          }\n          pageInfo {\n            endCursor\n            hasNextPage\n            hasPreviousPage\n            startCursor\n          }\n        }\n      }\n    "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n      mutation Befriend($befriendedId: ID!) {\n        befriend(befriendedId: $befriendedId) {\n          id\n        }\n      }\n    "): (typeof documents)["\n      mutation Befriend($befriendedId: ID!) {\n        befriend(befriendedId: $befriendedId) {\n          id\n        }\n      }\n    "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n      query Health {\n        health\n      }\n    "): (typeof documents)["\n      query Health {\n        health\n      }\n    "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n      subscription RepeatHealth {\n        repeatHealth\n      }\n    "): (typeof documents)["\n      subscription RepeatHealth {\n        repeatHealth\n      }\n    "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n      mutation SendTextMessage($roomId: ID!, $textContent: String!) {\n        sendTextMessage(roomId: $roomId, textContent: $textContent) {\n          content\n          createdAt\n          id\n          sender {\n            id\n          }\n          type\n        }\n      }\n    "): (typeof documents)["\n      mutation SendTextMessage($roomId: ID!, $textContent: String!) {\n        sendTextMessage(roomId: $roomId, textContent: $textContent) {\n          content\n          createdAt\n          id\n          sender {\n            id\n          }\n          type\n        }\n      }\n    "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n      subscription MessageUpdatesByRoomId($id: ID!) {\n        messageUpdatesByRoomId(id: $id) {\n          operation\n          value {\n            content\n            createdAt\n            id\n            sender {\n              id\n            }\n            type\n          }\n        }\n      }\n    "): (typeof documents)["\n      subscription MessageUpdatesByRoomId($id: ID!) {\n        messageUpdatesByRoomId(id: $id) {\n          operation\n          value {\n            content\n            createdAt\n            id\n            sender {\n              id\n            }\n            type\n          }\n        }\n      }\n    "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n      mutation RoomCreate {\n        roomCreate {\n          id\n          type\n          activeRound {\n            id\n            deck {\n              id\n            }\n            isActive\n            state\n            slug\n          }\n          occupants {\n            id\n          }\n        }\n      }\n    "): (typeof documents)["\n      mutation RoomCreate {\n        roomCreate {\n          id\n          type\n          activeRound {\n            id\n            deck {\n              id\n            }\n            isActive\n            state\n            slug\n          }\n          occupants {\n            id\n          }\n        }\n      }\n    "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n      mutation RoomSetDeck($id: ID!, $deckId: ID!) {\n        roomSetDeck(id: $id, deckId: $deckId) {\n          id\n          type\n          activeRound {\n            id\n            deck {\n              id\n            }\n            isActive\n            state\n            slug\n          }\n          occupants {\n            id\n          }\n        }\n      }\n    "): (typeof documents)["\n      mutation RoomSetDeck($id: ID!, $deckId: ID!) {\n        roomSetDeck(id: $id, deckId: $deckId) {\n          id\n          type\n          activeRound {\n            id\n            deck {\n              id\n            }\n            isActive\n            state\n            slug\n          }\n          occupants {\n            id\n          }\n        }\n      }\n    "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n      mutation RoomStartRound($id: ID!) {\n        roomStartRound(id: $id) {\n          id\n          type\n          activeRound {\n            id\n            deck {\n              id\n            }\n            isActive\n            state\n            slug\n          }\n          occupants {\n            id\n          }\n        }\n      }\n    "): (typeof documents)["\n      mutation RoomStartRound($id: ID!) {\n        roomStartRound(id: $id) {\n          id\n          type\n          activeRound {\n            id\n            deck {\n              id\n            }\n            isActive\n            state\n            slug\n          }\n          occupants {\n            id\n          }\n        }\n      }\n    "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n      mutation RoomEndRound($id: ID!) {\n        roomEndRound(id: $id) {\n          id\n          type\n          activeRound {\n            id\n            deck {\n              id\n            }\n            isActive\n            state\n            slug\n          }\n          occupants {\n            id\n          }\n        }\n      }\n    "): (typeof documents)["\n      mutation RoomEndRound($id: ID!) {\n        roomEndRound(id: $id) {\n          id\n          type\n          activeRound {\n            id\n            deck {\n              id\n            }\n            isActive\n            state\n            slug\n          }\n          occupants {\n            id\n          }\n        }\n      }\n    "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n      mutation RoomArchive($id: ID!) {\n        roomArchive(id: $id) {\n          id\n          type\n          activeRound {\n            id\n            deck {\n              id\n            }\n            isActive\n            state\n            slug\n          }\n          occupants {\n            id\n          }\n        }\n      }\n    "): (typeof documents)["\n      mutation RoomArchive($id: ID!) {\n        roomArchive(id: $id) {\n          id\n          type\n          activeRound {\n            id\n            deck {\n              id\n            }\n            isActive\n            state\n            slug\n          }\n          occupants {\n            id\n          }\n        }\n      }\n    "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n      mutation RoomJoin($id: ID!) {\n        roomJoin(id: $id) {\n          id\n          type\n          activeRound {\n            id\n            deck {\n              id\n            }\n            isActive\n            state\n            slug\n          }\n          occupants {\n            id\n          }\n        }\n      }\n    "): (typeof documents)["\n      mutation RoomJoin($id: ID!) {\n        roomJoin(id: $id) {\n          id\n          type\n          activeRound {\n            id\n            deck {\n              id\n            }\n            isActive\n            state\n            slug\n          }\n          occupants {\n            id\n          }\n        }\n      }\n    "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n      query Room($id: ID!) {\n        room(id: $id) {\n          id\n          type\n          activeRound {\n            id\n            deck {\n              id\n            }\n            isActive\n            state\n            slug\n          }\n          occupants {\n            id\n          }\n        }\n      }\n    "): (typeof documents)["\n      query Room($id: ID!) {\n        room(id: $id) {\n          id\n          type\n          activeRound {\n            id\n            deck {\n              id\n            }\n            isActive\n            state\n            slug\n          }\n          occupants {\n            id\n          }\n        }\n      }\n    "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n      query OccupyingUnarchivedRooms {\n        occupyingUnarchivedRooms {\n          id\n          type\n          activeRound {\n            id\n            deck {\n              id\n            }\n            isActive\n            state\n            slug\n          }\n          occupants {\n            id\n          }\n        }\n      }\n    "): (typeof documents)["\n      query OccupyingUnarchivedRooms {\n        occupyingUnarchivedRooms {\n          id\n          type\n          activeRound {\n            id\n            deck {\n              id\n            }\n            isActive\n            state\n            slug\n          }\n          occupants {\n            id\n          }\n        }\n      }\n    "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n      subscription RoomUpdatesByRoomId($id: ID!) {\n        roomUpdatesByRoomId(id: $id) {\n          operation\n          value {\n            id\n            type\n            activeRound {\n              id\n              deck {\n                id\n              }\n              isActive\n              state\n              slug\n            }\n            occupants {\n              id\n            }\n          }\n        }\n      }\n    "): (typeof documents)["\n      subscription RoomUpdatesByRoomId($id: ID!) {\n        roomUpdatesByRoomId(id: $id) {\n          operation\n          value {\n            id\n            type\n            activeRound {\n              id\n              deck {\n                id\n              }\n              isActive\n              state\n              slug\n            }\n            occupants {\n              id\n            }\n          }\n        }\n      }\n    "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n      mutation CreateUser($input: FinalizeOauthSigninMutationInput!) {\n        finalizeOauthSignin(input: $input) {\n          currentUser\n          token\n        }\n      }\n    "): (typeof documents)["\n      mutation CreateUser($input: FinalizeOauthSigninMutationInput!) {\n        finalizeOauthSignin(input: $input) {\n          currentUser\n          token\n        }\n      }\n    "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n      mutation NameUser($input: OwnProfileEditMutationInput!) {\n        ownProfileEdit(input: $input) {\n          id\n          name\n        }\n      }\n    "): (typeof documents)["\n      mutation NameUser($input: OwnProfileEditMutationInput!) {\n        ownProfileEdit(input: $input) {\n          id\n          name\n        }\n      }\n    "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n      mutation Refresh($token: JWT!) {\n        refresh(token: $token) {\n          currentUser\n          token\n        }\n      }\n    "): (typeof documents)["\n      mutation Refresh($token: JWT!) {\n        refresh(token: $token) {\n          currentUser\n          token\n        }\n      }\n    "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n      query Me {\n        me {\n          isPublic\n          name\n          roles\n        }\n      }\n    "): (typeof documents)["\n      query Me {\n        me {\n          isPublic\n          name\n          roles\n        }\n      }\n    "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n      mutation UserEdit($input: OwnProfileEditMutationInput!) {\n        ownProfileEdit(input: $input) {\n          id\n          name\n        }\n      }\n    "): (typeof documents)["\n      mutation UserEdit($input: OwnProfileEditMutationInput!) {\n        ownProfileEdit(input: $input) {\n          id\n          name\n        }\n      }\n    "];

export function graphql(source: string) {
  return (documents as any)[source] ?? {};
}

export type DocumentType<TDocumentNode extends DocumentNode<any, any>> = TDocumentNode extends DocumentNode<  infer TType,  any>  ? TType  : never;