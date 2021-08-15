import { ApolloServer } from "apollo-server-koa";
import { schema } from "./schema";
import { context } from "./context";

// import resolvers from './resolver';

const { NODE_ENV } = process.env;

export const apollo = new ApolloServer({
	// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
	schema,
	context,
	mocks: NODE_ENV === "frontend-testing",
	debug: NODE_ENV !== "production",
});
