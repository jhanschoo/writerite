import { nonNull, queryField } from "nexus";

export const HealthQuery = queryField("health", {
	type: nonNull("String"),
	resolve() {
		return "OK";
	},
});
