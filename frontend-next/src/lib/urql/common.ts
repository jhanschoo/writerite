import { SSRExchange } from "next-urql";
import { dedupExchange, fetchExchange, makeOperation, subscriptionExchange } from "urql/core";
import { devtoolsExchange } from '@urql/devtools';
import { authExchange } from '@urql/exchange-auth';
import { cacheExchange } from '@urql/exchange-graphcache';
import { getAccessKey } from "@lib/tokenManagement";
import { isSSRContext } from "@/utils";
import { createClient } from "graphql-ws";
import WebSocket from "isomorphic-ws";
import schema from "@root/graphql.schema.json";

export const commonUrqlOptions = {
	url: process.env.NEXT_PUBLIC_GRAPHQL_HTTP as string,
	requestPolicy: 'cache-and-network',
	// preferGetMethod: true seems to be necessary for my implementation of subscriptions to work
	// preferGetMethod: true,
} as const;

const wsClient = createClient({
	url: process.env.NEXT_PUBLIC_GRAPHQL_WS as string,
	webSocketImpl: WebSocket,
})

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
	async getAuth({ authState }) {
		return authState || getAccessKey();
	},
	didAuthError({ authState }) {
		return authState === null;
	}
});

const subscription = subscriptionExchange({
	forwardSubscription: (operation) => ({
		subscribe: (sink) => ({
			unsubscribe: wsClient.subscribe(operation, sink),
		}),
	}),
});

export const getExchanges = (ssr: SSRExchange) => [
	devtoolsExchange,
	dedupExchange,
	cacheExchange({
		// @ts-expect-error https://github.com/microsoft/TypeScript/issues/32063
		schema,
	}),
	ssr,
	auth,
	fetchExchange,
	subscription,
];
