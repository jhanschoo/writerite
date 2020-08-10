/*
 * Note: the gql's are separated by query/mutation/subscription
 * for ease of writing update functions:
 * In general, data from queries can become stale in important places
 * that has a large negative hit on UX, whereas data directly from
 * mutations and subscriptions are generally used in ways that are
 * tolerated if they become stale.
 * Hence the separation allows us to easily scan for queries that need
 * updating while writing an update function for a mutation or
 * subscription witnessing an entity being created or deleted.
 */


export * from "./queries";
export * from "./mutations";
