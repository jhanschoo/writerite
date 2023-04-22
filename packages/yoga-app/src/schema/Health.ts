import { builder } from "../builder";

builder.queryField("health", (t) =>
  t.field({
    type: "String",
    resolve() {
      return "OK";
    },
  })
);

builder.subscriptionField("repeatHealth", (t) =>
  t.field({
    type: "String",
    subscribe(_root, _args, { sub }) {
      return (async function* repeatHealth() {
        let times = 5;
        while (times--) {
          yield String(times) + (sub?.bareId ?? "");
          await new Promise((resolve) => {
            setTimeout(resolve, 1000);
          });
        }
      })();
    },
    resolve(root: string) {
      return root;
    },
  })
);
