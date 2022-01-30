import type { WrServer } from "../../../src/graphqlServer";

export async function queryHealth(server: WrServer) {
	return server.inject({
		operationName: "HealthQuery",
		document: `
			query HealthQuery {
				health
			}
		`,
	});
}
