import { nonNull, queryField, subscriptionField } from "nexus";

export const HealthQuery = queryField("health", {
	type: nonNull("String"),
	resolve() {
		return "OK";
	},
});

export const RepeatHealthSubscription = subscriptionField("repeatHealth", {
	type: nonNull("String"),
	subscribe() {
		let times = 5;
		return (async function* repeatHealth() {
			while (times--) {
				yield String(times);
				await new Promise((resolve) => {
					setTimeout(resolve, 1000);
				});
			}
		}());
	},
	resolve(root: string) {
		return root;
	},
});
