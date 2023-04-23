import { builder } from '../../builder';

export const FinalizeOauthSigninMutationInput = builder.inputType(
  'FinalizeOauthSigninMutationInput',
  {
    fields: (t) => ({
      code: t.string({ required: true }),
      provider: t.string({ required: true }),
      nonce: t.string({ required: true }),
      redirect_uri: t.string({ required: true }),
    }),
  }
);
