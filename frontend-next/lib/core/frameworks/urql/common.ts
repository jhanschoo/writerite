import { dedupExchange, fetchExchange, cacheExchange } from "urql";
import { SSRExchange } from "next-urql";

export const commonUrqlOptions = {
	url: process.env.NEXT_PUBLIC_GRAPHQL_HTTP as string
} as const;

export const getExchanges = (ssrExchange: SSRExchange) => [
	dedupExchange,
	cacheExchange,
	ssrExchange,
	fetchExchange,
];
