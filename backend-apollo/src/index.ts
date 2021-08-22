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

apollo.applyMiddleware({
	app,
	cors: {
		origin: NODE_ENV === "production"
			? "https://www.writerite.site"
			: "https://localhost:3000",
		credentials: true,
	},
});

export const server = CERT_FILE && KEY_FILE
	? https.createServer({
		cert: fs.readFileSync(CERT_FILE),
		key: fs.readFileSync(KEY_FILE),
	}, app.callback())
	: http.createServer(app.callback());

server.listen({ port: 4000 }, () => {
	// eslint-disable-next-line no-console
	console.log(`🚀 Server ready at http${
		CERT_FILE && KEY_FILE ? "s" : ""
	}://localhost:${4000}${apollo.graphqlPath} in environment ${String(NODE_ENV)}`);
});

export function stop(): void {
	server.removeAllListeners();
	server.close();
	void apollo.stop();
	void stopContextServices();
}
