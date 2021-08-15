import { makeSchema } from "nexus";
import { join } from "path";
import * as types from "./graphql";
import { scalarMapping } from "./graphql/scalarUtils";
import { undefinedOnlyPlugin } from "./graphql/undefinedOnlyPlugin";

// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call
export const schema = makeSchema({
	types,
	outputs: {
		typegen: join(__dirname, "..", "generated", "nexus-typegen.ts"),
		schema: join(__dirname, "..", "generated", "schema.graphql"),
	},
	plugins: [undefinedOnlyPlugin],
	sourceTypes: {
		debug: true,
		modules: [
			{
				module: join(__dirname, "..", "node_modules", ".prisma", "client", "index.d.ts"),
				alias: "p",
			},
		],
		mapping: {
			...scalarMapping,
		},
	},
	contextType: {
		module: join(__dirname, "./context.ts"),
		export: "Context",
	},
});
