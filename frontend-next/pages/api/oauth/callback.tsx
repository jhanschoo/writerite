// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { FinalizeThirdPartyOauthSigninDocument } from '../../../generated/graphql';
import { initDefaultUrqlClient } from '../../../lib/server/urql/initDefaultUrqlClient';

type Data = {
  name: string
}

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse<Data>
) {
	const { error, code, state } = req.query;
	if (typeof code !== 'string' || typeof state !== 'string') {
		res.status(400).end('Invalid callback parameters');
		return;
	}
	const { provider, nonce } = JSON.parse(state as string);
	if (typeof provider !== 'string' || typeof nonce !== 'string') {
		res.status(400).end('Invalid state');
		return;
	}
	const [client] = initDefaultUrqlClient();
	const mutationRes = await client.mutation(FinalizeThirdPartyOauthSigninDocument, {
		code, provider, nonce,
	}).toPromise();
	const token = mutationRes?.data?.finalizeThirdPartyOauthSignin;
	res.redirect(303, `/?token=${token}`);
}
