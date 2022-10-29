export const STANDARD_DEBOUNCE_MS = 500;
export const STANDARD_MAX_WAIT_DEBOUNCE_MS = 2000;

// Environment variables. Fully qualified names are used on the RHS
//   due to concerns regarding injection at time of transpilation.
export const NEXT_PUBLIC_GRAPHQL_HTTP = process.env.NEXT_PUBLIC_GRAPHQL_HTTP as string;
export const NEXT_PUBLIC_GRAPHQL_WS = process.env.NEXT_PUBLIC_GRAPHQL_WS as string;

// Note (2022-08-14): this limit is not enforced by the server.
export const NEXT_PUBLIC_MAX_CARDS_PER_DECK = parseInt(
  process.env.NEXT_PUBLIC_MAX_CARDS_PER_DECK as string
);
