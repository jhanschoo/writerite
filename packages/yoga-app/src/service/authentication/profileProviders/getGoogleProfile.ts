/* eslint-disable @typescript-eslint/naming-convention */

// eslint-disable-next-line @typescript-eslint/no-shadow
import { URL } from 'url';
import { JWTPayload } from 'jose';

import env from '../../../safeEnv';
import { setSearchParams } from '../../../util';
import { parseArbitraryJWT } from '../../crypto';
import { ExternalProfileInformationProvider } from './types';

const GOOGLE_OAUTH_TOKEN_BASE_URL = new URL(
  'https://oauth2.googleapis.com/token'
);
const { GAPI_CLIENT_ID, GAPI_CLIENT_SECRET } = env;

interface GoogleTokenResponse {
  access_token: string;
  expires_in: number; // seconds integer
  id_token: string; // JWT
  scope: string; // 'openid email profile'
  token_type: 'Bearer';
}

interface GoogleIdTokenWithEmailOpenIDAndProfile extends JWTPayload {
  aud: string; // === GAPI_CLIENT_ID
  exp: number; // seconds since epoch
  iat: number; // seconds since epoch
  iss: 'https://accounts.google.com' | 'accounts.google.com';
  sub: string; // user id
  email: string;
  email_verified: boolean;
  locale: string; // BCP 47 language tag
  name?: string;
  picture?: string; // URL to Google's profile picture
}

export const getGoogleProfile: ExternalProfileInformationProvider = async ({
  code,
  redirect_uri,
}) => {
  const url = setSearchParams(new URL(GOOGLE_OAUTH_TOKEN_BASE_URL.toString()), {
    code,
    client_id: GAPI_CLIENT_ID,
    client_secret: GAPI_CLIENT_SECRET,
    grant_type: 'authorization_code',
    redirect_uri,
  });
  const res = await fetch(url.toString(), { method: 'POST' });
  if (!res.ok) {
    return null;
  }
  const { id_token } = (await res.json()) as GoogleTokenResponse;
  const parsedJWT =
    parseArbitraryJWT<GoogleIdTokenWithEmailOpenIDAndProfile>(id_token);
  const { sub, email, name } = parsedJWT;
  return { email, id: sub, name: name ?? email };
};
