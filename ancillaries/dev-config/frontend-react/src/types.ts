import type { ChatMsgDetail } from "./client-models/gqlTypes";
import type { ChatMsgContentType } from "./gqlTypes";

export enum Roles {
  user = "user",
  admin = "admin",
  wright = "wright",
}

export interface CurrentUser {
  readonly id: string;
  readonly email: string;
  readonly name: string | null;
  readonly roles: readonly Roles[];
}

export interface CurrentUserAndToken {
  readonly token: string;
  readonly user: CurrentUser;
}

export interface CardFields {
  readonly prompt: Record<string, unknown>;
  readonly fullAnswer: Record<string, unknown>;
  readonly answers: string[];
}

export interface TextChatMsgDetail extends ChatMsgDetail {
  type: ChatMsgContentType.TEXT;
  content: string;
}

export interface RoundStartChatMsgDetail extends ChatMsgDetail {
  type: ChatMsgContentType.ROUND_START;
  content: {
    cardId: string,
    prompt: Record<string, unknown>,
  };
}

export interface RoundWinChatMsgDetail extends ChatMsgDetail {
  type: ChatMsgContentType.ROUND_WIN;
  content: {
    userId: string | null,
    cardId: string,
  };
}

export interface RoundScoreChatMsgDetail extends ChatMsgDetail {
  type: ChatMsgContentType.ROUND_SCORE;
  content: {
    userIds: (string | null)[],
    cardId: string,
    prompt: Record<string, unknown>
    fullAnswer: Record<string, unknown>
    answers: readonly string[],
    deckId: string,
  };
}

export type DiscriminatedChatMsgDetail =
  | TextChatMsgDetail
  | RoundStartChatMsgDetail
  | RoundWinChatMsgDetail
  | RoundScoreChatMsgDetail;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type FixRef<T extends { ref?: any }> = Omit<T, "ref"> & { ref?: Exclude<T["ref"], string> };
