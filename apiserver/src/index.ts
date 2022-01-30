import fs from "fs";
import https from "https";
import http from "http";

import express from "express";
import helmet from "helmet";
import cors from "cors";

import { contextFactory } from "./context";
import { graphQLServerFactory } from "./graphqlServer";

const { NODE_ENV, CERT_FILE, KEY_FILE } = process.env;

export const [context, stopContextServices] = contextFactory();

export const graphQLServer = graphQLServerFactory(context);

// Initialize express

const app = express();

app.use(helmet({
	contentSecurityPolicy: NODE_ENV === "production",
}));

// we handle cors here since cors handling in GraphQL Yoga is iffy
app.use(cors({
	origin: NODE_ENV === "production" ? "https://www.writerite.site" : "http://localhost:3000",
}));

// we handle health here since health handling in GraphQL Yoga is iffy
app.get("/health", (_req, res) => {
	res.send("OK");
});
app.get("/readiness", (_req, res) => {
	res.send("OK");
});

// eslint-disable-next-line @typescript-eslint/no-misused-promises
app.use("/graphql", graphQLServer.requestListener);

const serverPromise: Promise<https.Server | http.Server> = Promise.resolve((async () => {

	const server = CERT_FILE && KEY_FILE
		? https.createServer({
			cert: fs.readFileSync(CERT_FILE),
			key: fs.readFileSync(KEY_FILE),
		}, app)
		: http.createServer(app);

	return new Promise<https.Server | http.Server>((res) => {
		server.listen({ port: 4000 }, () => {
		// eslint-disable-next-line no-console
			console.log(`GraphQL Server running at http${
				CERT_FILE && KEY_FILE ? "s" : ""
			}://localhost:${4000}/graphql in environment ${String(NODE_ENV)}`);
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
		}), graphQLServer.stop(), stopContextServices(),
	]);
}
