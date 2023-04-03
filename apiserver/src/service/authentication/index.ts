/**
 * The `authentication` service manages the relationship between
 * a set of claims and a user on the platform. Thus, it handles
 * login and signup of users, up to the point of identifying
 * or creating a particular user on the platform.
 */
export * from "./profileProviders";
export * from "./finalizeOauthSignin";
export * from "./providerStrategies";
export * from "./types";
export * from "./util";
