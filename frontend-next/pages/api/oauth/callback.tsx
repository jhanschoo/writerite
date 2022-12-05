// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import { FinalizeOauthSigninDocument } from '@generated/graphql';
import { initDefaultServerSideUrqlClient } from '@lib/urql/initDefaultServerSideUrqlClient';

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
      .mutation(FinalizeOauthSigninDocument, {
        code,
        provider,
        nonce,
        redirect_uri,
      })
      .toPromise();
    const sessionInfo = mutationRes?.data?.finalizeOauthSignin;
    if (sessionInfo) {
      const { currentUser, token } = sessionInfo;
      const queryParams = new URLSearchParams({
        token,
        currentUser: JSON.stringify(currentUser),
      });
      return res.redirect(303, `/?${queryParams.toString()}`), undefined;
    }
  }
  return res.redirect(303, '/'), undefined;
}
