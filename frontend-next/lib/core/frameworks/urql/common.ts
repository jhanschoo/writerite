import { dedupExchange, fetchExchange, cacheExchange, makeOperation, subscriptionExchange } from "urql/core";
import { createClient as createSSEClient } from 'graphql-sse';
import { authExchange } from '@urql/exchange-auth';
import { SSRExchange } from "next-urql";
import { isSSRContext } from "../../utilities";
import { getAccessKey } from "../../../browser/tokenManagement";

export const commonUrqlOptions = {
	url: process.env.NEXT_PUBLIC_GRAPHQL_HTTP as string,
	preferGetMethod: true,
} as const;

const auth = authExchange<string | null>({
	addAuthToOperation({ authState, operation }) {
		if (isSSRContext() || !authState) {
			return operation;
		}
		const prevFetchOptions = 
		typeof operation.context.fetchOptions === 'function'
			? operation.context.fetchOptions()
			: operation.context.fetchOptions || {};
		const fetchOptions = {
			...prevFetchOptions,
			headers: {
				...prevFetchOptions.headers,
				"Authorization": `Bearer ${authState}`,
			},
		};

		return makeOperation(operation.kind, operation, {
			...operation.context,
			fetchOptions,
		})
	},
	async getAuth({ authState, mutate }) {
		return authState || getAccessKey();
	},
	didAuthError({ error, authState }) {
		return authState === null;
	}
});

// Note: SSE via POST is not supported by cross-fetch, though supported
// by browser fetch implementations.
const sseClient = createSSEClient({
	url: commonUrqlOptions.url,
});

const subscription = subscriptionExchange({
	forwardSubscription: (operation) => ({
		subscribe: (sink) => ({
			unsubscribe: sseClient.subscribe(operation, sink),
		}),
	}),
});

// commented out subscription implementation: this ad-hoc implementation
// uses GET method with EventSource API.
// const subscription = subscriptionExchange({
// 	forwardSubscription(operation) {
// 		const url = new URL(commonUrqlOptions.url);
// 		url.searchParams.append('query', operation.query);
// 		url.searchParams.append('variables', JSON.stringify(operation.variables));
// 		return {
// 			subscribe(sink) {
// 				const eventSource = new EventSource(url.toString());
// 				eventSource.addEventListener("next", (event) => {
// 					const data = JSON.parse((event as MessageEvent<any>).data);
// 					sink.next(data);
// 					if (eventSource.readyState === 2) {
// 						sink.complete();
// 					}
// 				});
// 				eventSource.addEventListener("complete", (event) => {
// 					sink.complete();
// 				});
// 				eventSource.onerror = (error) => sink.error(error);
// 				return {
// 					unsubscribe: () => eventSource.close(),
// 				};
// 			},
// 		};
// 	},
// });

export const getExchanges = (ssr: SSRExchange) => [
	dedupExchange,
	cacheExchange,
	ssr,
	auth,
	fetchExchange,
	subscription,
];
