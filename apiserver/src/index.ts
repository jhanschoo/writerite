import fs from "fs";

import { contextFactory } from "./context";
import { graphQLServerFactory } from "./graphqlServer";

const { NODE_ENV, CERT_FILE, KEY_FILE } = process.env;

export const [context, stopContextServices] = contextFactory();

export const graphQLServer = graphQLServerFactory({
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

const serverPromise = graphQLServer.start();

export async function stop(): Promise<PromiseSettledResult<unknown>[]> {
	const server = await serverPromise;
	server.removeAllListeners();
	return Promise.allSettled<unknown>([
		new Promise<void>((res, rej) => {
			server.close((err) => err ? rej(err) : res());
		}), graphQLServer.stop(), stopContextServices(),
	]);
}
