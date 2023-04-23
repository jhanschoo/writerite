import { builder } from '../../builder';
import { CardCreateMutationInput } from './CardCreateMutationInput';

export const DeckCreateMutationInput = builder.inputType(
  'DeckCreateMutationInput',
  {
    fields: (t) => ({
      name: t.string({ required: true }),
      description: t.field({ type: 'JSONObject' }),
      promptLang: t.string({ required: true, validate: { minLength: 2 } }),
      answerLang: t.string({ required: true, validate: { minLength: 2 } }),
      published: t.boolean(),
      cards: t.field({ type: [CardCreateMutationInput], required: true }),
      parentDeckId: t.id(),
      notes: t.field({ type: 'JSONObject' }),
    }),
  }
);
