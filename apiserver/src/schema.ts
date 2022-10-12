import { fieldAuthorizePlugin, makeSchema } from "nexus";
import { join } from "path";
import * as types from "./graphql";
import { scalarMapping } from "./graphql/scalarUtil";
import { undefinedOnlyPlugin } from "./graphql/undefinedOnlyPlugin";

const { NODE_ENV } = process.env;

// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call
export const schema = makeSchema({
  types,
  outputs: {
    typegen: join(process.cwd(), "generated", "nexus-typegen.ts"),
    schema: join(process.cwd(), "generated", "schema.graphql"),
  },
  plugins: [undefinedOnlyPlugin, fieldAuthorizePlugin()],
  sourceTypes: {
    debug: NODE_ENV !== "test",
    modules: [
      {
        module: join(process.cwd(), "node_modules", ".prisma", "client", "index.d.ts"),
        alias: "p",
      },
    ],
    mapping: {
      ...scalarMapping,
    },
  },
  contextType: {
    module: join(process.cwd(), "src", "/context.ts"),
    export: "Context",
  },
});
