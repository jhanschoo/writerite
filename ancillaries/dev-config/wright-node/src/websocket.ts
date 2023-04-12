import { ClientRequestArgs } from "http";
import { URL } from "url";
import WebSocket, { ClientOptions } from "ws";

import { agent } from "./agent";

export class AgentWebSocket extends WebSocket {
  constructor(
    address: string | URL,
    protocols?: string | string[],
    options?: ClientOptions | ClientRequestArgs
  ) {
    super(address, protocols, { agent, ...options });
  }
}
