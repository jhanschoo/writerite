import { ApolloServer } from "apollo-server-koa";
import { schema } from "./schema";
import { ContextFunction } from "apollo-server-core";

const { NODE_ENV } = process.env;

export function apolloFactory(context: ContextFunction): ApolloServer {
	return new ApolloServer({
		// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
		schema,
		context,
		mocks: NODE_ENV === "frontend-testing",
		debug: NODE_ENV !== "production",
	});
}
