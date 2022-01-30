import { YogaInitialContext } from "@graphql-yoga/common";
import { createServer } from "@graphql-yoga/node";
import { Context } from "./context";
import { schema } from "./schema";

const { NODE_ENV } = process.env;

// This type is defined because GraphQL Yoga doesn't export the YogaNodeServer type.
export type WrServer = ReturnType<typeof graphQLServerFactory>;

export function graphQLServerFactory(context: (initialContext: YogaInitialContext) => Context) {
	return createServer<Context, unknown>({
		// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
		schema,
		maskedErrors: NODE_ENV === "production",
		context,
		/*
		 * context,
		 * mocks: NODE_ENV === "frontend-testing",
		 * debug: NODE_ENV !== "production",
		 */
	});
}
