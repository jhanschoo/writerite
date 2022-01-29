import { ssrExchange, Client } from "urql";
import { initUrqlClient, SSRData } from "next-urql";
import { commonUrqlOptions, getExchanges } from "../../core/frameworks/urql/common";

export const initDefaultUrqlClient = (): [Client, () => SSRData] => {
	const ssrCache = ssrExchange({ isClient: false });
	const client = initUrqlClient({
		...commonUrqlOptions,
		exchanges: getExchanges(ssrCache),
	}, false);
	if (!client) {
		throw new Error("unable to initialize urql client in initDefaultUrqlClient");
	}
	const getUrqlState = () => ssrCache.extractData();
	return [client, getUrqlState];
}
