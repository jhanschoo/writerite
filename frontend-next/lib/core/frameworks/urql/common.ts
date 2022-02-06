import { dedupExchange, fetchExchange, cacheExchange, makeOperation } from "urql/core";
import { authExchange } from '@urql/exchange-auth';
import { SSRExchange } from "next-urql";
import { isSSRContext } from "../../utilities";
import { getAccessKey } from "../../../browser/tokenManagement";

export const commonUrqlOptions = {
	url: process.env.NEXT_PUBLIC_GRAPHQL_HTTP as string
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
	}
});

export const getExchanges = (ssrExchange: SSRExchange) => [
	dedupExchange,
	cacheExchange,
	ssrExchange,
	auth,
	fetchExchange,
];
