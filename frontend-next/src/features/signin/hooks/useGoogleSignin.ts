import { useState } from 'react';
import { useMutation } from 'urql';
import { InitializeThirdPartyOauthSigninDocument } from '../../../../generated/graphql';

// https://developers.google.com/identity/protocols/oauth2/web-server#httprest
const client_id = process.env.NEXT_PUBLIC_GAPI_CLIENT_ID as string;

export default function useGoogleSignin() {
  const [, executeInitializeOauth] = useMutation(InitializeThirdPartyOauthSigninDocument);
  const [signinUnderway, setSigninUnderway] = useState(false);
  return [
    signinUnderway,
    async () => {
      setSigninUnderway(true);
      const initializeOauth = await executeInitializeOauth({});
      const redirect_uri = `${window.location.origin}/api/oauth/callback`;
      const { data } = initializeOauth;
      if (!data) {
        setSigninUnderway(false);
        throw new Error('Unable to initializeThirdPartyOauthSignin');
      }
      const nonce = data.initializeThirdPartyOauthSignin;
      const url = new URL(
        `https://accounts.google.com/o/oauth2/v2/auth?client_id=${client_id}&redirect_uri=${redirect_uri}&response_type=code&scope=profile email openid&state=${JSON.stringify(
          {
            provider: 'google',
            nonce,
            redirect_uri,
          }
        )}`
      );
      window.location.assign(url);
    },
  ] as const;
}
