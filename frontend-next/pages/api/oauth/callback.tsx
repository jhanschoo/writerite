// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import { FinalizeThirdPartyOauthSigninDocument } from '@generated/graphql';
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
      .mutation(FinalizeThirdPartyOauthSigninDocument, {
        code,
        provider,
        nonce,
        redirect_uri,
      })
      .toPromise();
    const token = mutationRes?.data?.finalizeThirdPartyOauthSignin;
    if (token) {
      return res.redirect(303, `/?token=${token}`), undefined;
    }
  }
  return res.redirect(303, '/'), undefined;
}
