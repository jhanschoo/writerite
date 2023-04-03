import SchemaBuilder from "@pothos/core";
import { Prisma } from "@prisma/client";
import PrismaPlugin from "@pothos/plugin-prisma";
import DirectivePlugin from "@pothos/plugin-directives";
import RelayPlugin from "@pothos/plugin-relay";
import ScopeAuthPlugin from "@pothos/plugin-scope-auth";
import ValidationPlugin from "@pothos/plugin-validation";
import type PrismaTypes from "@pothos/plugin-prisma/generated";
import { Context } from "./context";
import {
  DateTimeResolver,
  EmailAddressResolver,
  JSONObjectResolver,
  JSONResolver,
  JWTResolver,
  UUIDResolver,
} from "graphql-scalars";
import { Roles } from "./service/userJWT";
import { lit } from "./util/lit";

export const builder = new SchemaBuilder<{
  AuthScopes: {
    always: boolean;
    authenticated: boolean;
    subIdIs: unknown;
  };
  AuthContexts: {
    authenticated: Context & { sub: NonNullable<Context["sub"]> };
    admin: Context & { sub: NonNullable<Context["sub"]> };
    subIdIs: Context & { sub: NonNullable<Context["sub"]> };
  };
  Context: Context;
  Directives: {
    undefinedOnly: {
      locations: "ARGUMENT_DEFINITION" | "INPUT_FIELD_DEFINITION";
    };
  };
  PrismaTypes: PrismaTypes;
  Scalars: {
    DateTime: {
      Input: string;
      Output: string | Date;
    };
    EmailAddress: {
      Input: string;
      Output: string;
    };
    JSON: {
      Input: Prisma.JsonValue;
      Output: Prisma.JsonValue;
    };
    JSONObject: {
      Input: Prisma.JsonObject;
      Output: Prisma.JsonObject;
    };
    JWT: {
      Input: string;
      Output: string;
    };
    UUID: {
      Input: string;
      Output: string;
    };
  };
}>({
  authScopes: ({ sub }) => ({
    always: true,
    authenticated: !sub,
    admin: sub && sub.roles.includes(Roles.Admin),
    subIdIs: (id: unknown) => Boolean(sub?.id === id),
  }),
  plugins: [
    RelayPlugin,
    ScopeAuthPlugin,
    DirectivePlugin,
    ValidationPlugin,
    PrismaPlugin,
  ],
  prisma: {
    client: ({ prisma }) => prisma,
    // Because the prisma client is loaded dynamically, we need to explicitly provide the some information about the prisma schema
    dmmf: Prisma.dmmf,
    // use where clause from prismaRelatedConnection for totalCount (will true by default in next major version)
    filterConnectionTotalCount: true,
  },
  relayOptions: {
    // These will become the defaults in the next major version
    clientMutationId: "omit",
    cursorType: "ID",
  },
});

builder.queryType({});
builder.mutationType({});
builder.subscriptionType({});

builder.addScalarType("DateTime", DateTimeResolver, {});
builder.addScalarType("EmailAddress", EmailAddressResolver, {});
builder.addScalarType("JSON", JSONResolver, {});
builder.addScalarType("JSONObject", JSONObjectResolver, {});
builder.addScalarType("JWT", JWTResolver, {});
builder.addScalarType("UUID", UUIDResolver, {});

// gao: grant authorization object
export const gao = <T extends string>(s: T) => ({ $granted: s });
export const ungao = <T extends string>(ss: { $granted: T }[]) =>
  ss.map((s) => s.$granted);
