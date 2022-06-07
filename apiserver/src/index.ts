import fs from "fs";
import { WebSocketServer } from "ws";
import { useServer } from "graphql-ws/lib/use/ws";

import { contextFactory } from "./context";
import { graphQLServerFactory } from "./graphqlServer";

const { NODE_ENV, CERT_FILE, KEY_FILE } = process.env;

export const [context, stopContextServices] = contextFactory();

export const yogaApp = graphQLServerFactory({
	port: 4000,
	context,
	https: CERT_FILE && KEY_FILE ? {
		cert: fs.readFileSync(CERT_FILE),
		key: fs.readFileSync(KEY_FILE),
	} : undefined,
	cors: {
		origin: NODE_ENV === "production" ? "https://www.writerite.site" : "http://localhost:3000",
	},
});

async function main() {
	const httpServer = await yogaApp.start();
	const wsServer = new WebSocketServer({
		server: httpServer,
		path: yogaApp.getAddressInfo().endpoint,
	});
	useServer({
		execute: (args: any) => args.rootValue.execute(args),
		subscribe: (args: any) => args.rootValue.subscribe(args),
		onSubscribe: async (ctx, msg) => {
			const { schema, execute, subscribe, contextFactory, parse, validate } = yogaApp.getEnveloped(ctx);

			const args = {
				schema,
				operationName: msg.payload.operationName,
				document: parse(msg.payload.query),
				variableValues: msg.payload.variables,
				contextValue: await contextFactory(),
				rootValue: {
					execute,
					subscribe,
				},
			};

			const errors = validate(args.schema, args.document);
			if (errors.length) {
				return errors;
			}
			return args;
		},
	}, wsServer);
	return [httpServer, wsServer];
}

const mainPromise = main();
mainPromise.catch((e) => {
	// eslint-disable-next-line no-console
	console.error(e);
	process.exit(1);
});

export async function stop(): Promise<PromiseSettledResult<unknown>[]> {
	const [httpServer, wsServer] = await mainPromise;
	httpServer.removeAllListeners();
	return Promise.allSettled<unknown>([
		new Promise<void>((res, rej) => {
			httpServer.close((err) => err ? rej(err) : res());
		}),
		new Promise<void>((res, rej) => {
			wsServer.close((err) => err ? rej(err) : res());
		}),
		yogaApp.stop(),
		stopContextServices(),
	]);
}
