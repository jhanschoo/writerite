import { builder } from "../../builder";

export const CardInput = builder.inputType("CardCreateInput", {
  fields: (t) => ({
    prompt: t.field({ type: "JSONObject", required: true }),
    fullAnswer: t.field({ type: "JSONObject", required: true }),
    answers: t.stringList({ required: true }),
    isTemplate: t.boolean({ required: true }),
  }),
});
