import { nonNull, queryField, subscriptionField } from "nexus";

export const HealthQuery = queryField("health", {
	type: nonNull("String"),
	resolve() {
		return "OK";
	},
});

export const RepeatHealthSubscription = subscriptionField("repeatHealth", {
	type: nonNull("String"),
	subscribe(_root, _args, ctx) {
		let times = 5;
		const { sub } = ctx;
		return (async function* repeatHealth() {
			while (times--) {
				yield String(times) + (sub?.id ?? "");
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
