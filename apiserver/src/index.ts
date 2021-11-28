import fs from "fs";
import https from "https";
import http from "http";

import Koa from "koa";
import helmet from "koa-helmet";

import { contextFactory } from "./context";
import { apolloFactory } from "./apollo";

const { NODE_ENV, CERT_FILE, KEY_FILE } = process.env;

export const [context, stopContextServices] = contextFactory();

export const apollo = apolloFactory(context);

// Initialize express

const app = new Koa();

app.use(helmet({
	contentSecurityPolicy: NODE_ENV === "production",
}));

const serverPromise: Promise<https.Server | http.Server> = Promise.resolve((async () => {
	await apollo.start();
	apollo.applyMiddleware({
		app,
		cors: {
			origin: "*",
			credentials: true,
		},
	});

	const server = CERT_FILE && KEY_FILE
		? https.createServer({
			cert: fs.readFileSync(CERT_FILE),
			key: fs.readFileSync(KEY_FILE),
		}, app.callback())
		: http.createServer(app.callback());

	return new Promise<https.Server | http.Server>((res) => {
		server.listen({ port: 4000 }, () => {
		// eslint-disable-next-line no-console
			console.log(`🚀 Server ready at http${
				CERT_FILE && KEY_FILE ? "s" : ""
			}://localhost:${4000}${apollo.graphqlPath} in environment ${String(NODE_ENV)}`);
			res(server);
		});
	});
})());

export async function stop(): Promise<PromiseSettledResult<unknown>[]> {
	const server = await serverPromise;
	server.removeAllListeners();
	return Promise.allSettled<unknown>([
		new Promise<void>((res, rej) => {
			server.close((err) => err ? rej(err) : res());
		}), apollo.stop(), stopContextServices(),
	]);
}