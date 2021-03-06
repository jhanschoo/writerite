/* eslint-disable @typescript-eslint/naming-convention */

// eslint-disable-next-line @typescript-eslint/no-shadow
import { URL } from 'url';

import env from '../../../safeEnv';
import { setSearchParams } from '../../../util';
import { ExternalProfileInformationProvider } from './types';

// https://developers.facebook.com/docs/graph-api/overview
const FACEBOOK_OAUTH_TOKEN_BASE_URL = new URL(
  'https://graph.facebook.com/oauth/access_token'
);
const { FACEBOOK_APP_ID, FACEBOOK_APP_SECRET } = env;

interface FacebookTokenResponse {
  access_token: string;
  expires_in: number; // seconds integer
  token_type: 'bearer';
}

interface FacebookPublicProfile {
  id: string; // numberic string
  email?: string; // string
  name: string;
}

export const getFacebookProfile: ExternalProfileInformationProvider = async ({
  code,
  redirect_uri,
}) => {
  const tokenUrl = setSearchParams(
    new URL(FACEBOOK_OAUTH_TOKEN_BASE_URL.toString()),
    {
      client_id: FACEBOOK_APP_ID,
      client_secret: FACEBOOK_APP_SECRET,
      code,
      redirect_uri,
    }
  );
  const tokenRes = await fetch(tokenUrl.toString());
  if (!tokenRes.ok) {
    return null;
  }
  const { access_token } = (await tokenRes.json()) as FacebookTokenResponse;
  const profileUrl = setSearchParams(new URL('https://graph.facebook.com/me'), {
    access_token,
    fields: 'id,email',
  });
  const profileRes = await fetch(profileUrl.toString());
  const { email, id, name } =
    (await profileRes.json()) as FacebookPublicProfile;

  return { email, id, name };
};
