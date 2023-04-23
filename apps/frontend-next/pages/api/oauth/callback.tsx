// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import { graphql } from '@generated/gql';
import { initDefaultServerSideUrqlClient } from '@lib/urql/initDefaultServerSideUrqlClient';

export const FinalizeOauthSigninMutation = graphql(/* GraphQL */ `
  mutation FinalizeOauthSignin($input: FinalizeOauthSigninMutationInput!) {
    finalizeOauthSignin(input: $input) {
      currentUser
      token
    }
  }
`);

type Data = {
  name: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
): Promise<void> {
  const { error, code, state } = req.query;
  if (!error) {
    if (typeof code !== 'string' || typeof state !== 'string') {
      res.status(400).end('Invalid callback parameters');
      return;
    }
    const { provider, nonce, redirect_uri } = JSON.parse(state as string);
    if (typeof provider !== 'string' || typeof nonce !== 'string') {
      res.status(400).end('Invalid state');
      return;
    }
    const [client] = initDefaultServerSideUrqlClient();
    const mutationRes = await client
      .mutation(FinalizeOauthSigninMutation, {
        input: {
          code,
          provider,
          nonce,
          redirect_uri,
        },
      })
      .toPromise();
    const sessionInfo = mutationRes?.data?.finalizeOauthSignin;
    if (sessionInfo) {
      const { currentUser, token } = sessionInfo;
      const queryParams = new URLSearchParams({
        token,
        currentUser: JSON.stringify(currentUser),
      });
      return res.redirect(303, `/?${queryParams}`), undefined;
    }
  }
  return res.redirect(303, '/'), undefined;
}
