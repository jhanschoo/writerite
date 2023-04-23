import { builder } from '../../builder';

export const CardEditMutationInput = builder.inputType(
  'CardEditMutationInput',
  {
    fields: (t) => ({
      id: t.id({ required: true }),
      prompt: t.field({ type: 'JSONObject' }),
      fullAnswer: t.field({ type: 'JSONObject' }),
      answers: t.stringList({ required: true }),
      isTemplate: t.boolean({ required: true }),
      isPrimaryTemplate: t.boolean(),
    }),
  }
);
