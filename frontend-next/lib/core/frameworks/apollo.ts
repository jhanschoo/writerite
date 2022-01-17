import {
	ApolloClient, InMemoryCache
} from "@apollo/client";
import { LocalStorageWrapper, persistCache } from "apollo3-cache-persist";

export async function createClient({ ssr }: { ssr: boolean }): Promise<ApolloClient<any>> {
	const cache = new InMemoryCache();
	if (!ssr) {
		await persistCache({
			cache,
			storage: new LocalStorageWrapper(window.localStorage)
		});
	}
	const client = new ApolloClient({
		ssrMode: ssr,
		uri: process.env.NEXT_PUBLIC_GRAPHQL_HTTP,
		cache,
	});
	return client;
}