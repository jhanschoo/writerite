import { builder } from '../../builder';

export const DeckEditMutationInput = builder.inputType(
  'DeckEditMutationInput',
  {
    fields: (t) => ({
      id: t.id({ required: true }),
      name: t.string({ directives: { undefinedOnly: true } }),
      description: t.field({ type: 'JSONObject' }),
      promptLang: t.string({
        directives: { undefinedOnly: true },
        validate: { minLength: 2 },
      }),
      answerLang: t.string({
        directives: { undefinedOnly: true },
        validate: { minLength: 2 },
      }),
      notes: t.field({ type: 'JSONObject' }),
    }),
  }
);
