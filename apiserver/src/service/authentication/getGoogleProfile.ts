/* eslint-disable @typescript-eslint/naming-convention */
import env from '../../safeEnv';
import { parseArbitraryJWT } from '../crypto/jwtUtil';
// eslint-disable-next-line @typescript-eslint/no-shadow
import { URL } from 'url';
import { setSearchParams } from '../../util';
import { ThirdPartyProfileInformation } from './types';
import { JWTPayload } from 'jose';

const GOOGLE_OAUTH_TOKEN_BASE_URL = new URL('https://oauth2.googleapis.com/token');
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

export async function getGoogleProfile({
  code,
  redirect_uri,
}: {
  code: string;
  redirect_uri: string;
}): Promise<ThirdPartyProfileInformation | null> {
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
  const parsedJWT = parseArbitraryJWT<GoogleIdTokenWithEmailOpenIDAndProfile>(id_token);
  const { sub, email } = parsedJWT;
  return { email, id: sub };
}
