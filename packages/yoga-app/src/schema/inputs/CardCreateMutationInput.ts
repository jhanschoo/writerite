import { builder } from "../../builder";

export const CardCreateMutationInput = builder.inputType(
  "CardCreateMutationInput",
  {
    fields: (t) => ({
      prompt: t.field({ type: "JSONObject" }),
      fullAnswer: t.field({ type: "JSONObject" }),
      answers: t.stringList({ required: true }),
      isTemplate: t.boolean({ required: true }),
      isPrimaryTemplate: t.boolean(),
    }),
  }
);
