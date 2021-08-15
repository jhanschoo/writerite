/* eslint-disable @typescript-eslint/naming-convention */
import dotenv from "dotenv";
dotenv.config();

type EnvKeys =
| "APOLLO_GRAPH_ID"
| "APOLLO_GRAPH_VARIANT"
| "APOLLO_KEY"
| "APOLLO_SCHEMA_REPORTING"
| "DATABASE_URL"
| "FACEBOOK_APP_ID"
| "FACEBOOK_APP_SECRET"
| "GAPI_CLIENT_ID"
| "GAPI_CLIENT_SECRET"
| "JWT_PRIVATE_KEY"
| "JWT_PUBLIC_KEY"
| "REDIS_HOST"
| "REDIS_PORT"
| "RECAPTCHA_SECRET";

const {
	APOLLO_GRAPH_ID, APOLLO_GRAPH_VARIANT, APOLLO_KEY, APOLLO_SCHEMA_REPORTING, DATABASE_URL, FACEBOOK_APP_ID, FACEBOOK_APP_SECRET, GAPI_CLIENT_ID, GAPI_CLIENT_SECRET, JWT_PRIVATE_KEY, JWT_PUBLIC_KEY, REDIS_HOST, REDIS_PORT, RECAPTCHA_SECRET,
} = process.env;

const env: Record<EnvKeys, string | undefined> = {
	APOLLO_GRAPH_ID,
	APOLLO_GRAPH_VARIANT,
	APOLLO_KEY,
	APOLLO_SCHEMA_REPORTING,
	DATABASE_URL,
	FACEBOOK_APP_ID,
	FACEBOOK_APP_SECRET,
	GAPI_CLIENT_ID,
	GAPI_CLIENT_SECRET,
	JWT_PRIVATE_KEY,
	JWT_PUBLIC_KEY,
	REDIS_HOST,
	REDIS_PORT,
	RECAPTCHA_SECRET,
};

for (const key of Object.keys(env) as EnvKeys[]) {
	if (env[key] === undefined) {
		throw new Error(`configuration value ${key} not found`);
	}
}

export default env as Record<EnvKeys, string>;
