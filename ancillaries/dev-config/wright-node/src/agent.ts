import fs from "fs";
import http from "http";
import https from "https";
import { URL } from "url";

// eslint-disable-next-line @typescript-eslint/naming-convention
const { CA_CERT_FILE } = process.env;
const {
  // eslint-disable-next-line @typescript-eslint/naming-convention
  GRAPHQL_HTTP, GRAPHQL_WS,
} = process.env as Record<string, string>;

const httpUrl = new URL(GRAPHQL_HTTP);
const wsUrl = new URL(GRAPHQL_WS);

export const agent = httpUrl.protocol === "https:" && wsUrl.protocol === "wss:"
  ? new https.Agent({
    keepAlive: true,
    ca: !CA_CERT_FILE
      ? undefined
      : fs.readFileSync(CA_CERT_FILE),
  })
  : httpUrl.protocol === "http:" && wsUrl.protocol === "ws:"
    ? http.globalAgent
    : undefined;

if (agent === undefined) {
  throw new Error("GRAPHQL_HTTP and GRAPHQL_WS are inconsistent; their protocols need to be either https: and wss: or http: and ws:");
}
