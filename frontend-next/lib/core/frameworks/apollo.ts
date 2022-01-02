import {
	ApolloClient, InMemoryCache
} from "@apollo/client";
import { LocalStorageWrapper, persistCache } from "apollo3-cache-persist";
import { isSSRContext } from "../utilities";

const clientPromise = (async () => {
	const cache = new InMemoryCache();
	if (!isSSRContext()) {
		await persistCache({
			cache,
			storage: new LocalStorageWrapper(window.localStorage)
		});
	}
	const client = new ApolloClient({
		ssrMode: isSSRContext(),
		uri: process.env.NEXT_PUBLIC_GRAPHQL_HTTP,
		cache,
	});
	return client;
})();

export async function getClient(): Promise<ApolloClient<any>> {
	return clientPromise;
}