/* eslint-disable @typescript-eslint/naming-convention */
import { IResolvers } from "apollo-server-koa";
import { GraphQLDateTime as DateTime } from "graphql-iso-date";
import GraphQLJSON, { GraphQLJSONObject } from "graphql-type-json";

import { Query } from "./Query";
import { Mutation } from "./Mutation";
import { Subscription } from "./Subscription";
import { WrContext } from "../types";
import { User } from "./User";
import { Deck } from "./Deck";
import { Card } from "./Card";
import { Room } from "./Room";
import { ChatMsg } from "./ChatMsg";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const resolvers: IResolvers<any, WrContext> = {
  Query,
  Mutation,
  Subscription,
  User,
  Deck,
  Card,
  Room,
  ChatMsg,
  DateTime,
  Json: GraphQLJSON,
  JsonObject: GraphQLJSONObject,
  // Note: Upload resolver automatically added by apollo-server
};

export default resolvers;
