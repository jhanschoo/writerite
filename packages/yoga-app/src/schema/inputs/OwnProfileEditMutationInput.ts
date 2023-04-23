import { builder } from '../../builder';

export const OwnProfileEditMutationInput = builder.inputType(
  'OwnProfileEditMutationInput',
  {
    fields: (t) => ({
      name: t.string({ directives: { undefinedOnly: true } }),
      bio: t.field({ type: 'JSONObject', directives: { undefinedOnly: true } }),
      isPublic: t.boolean({ directives: { undefinedOnly: true } }),
    }),
  }
);
