import { useState } from 'react';
import { useMutation } from 'urql';
import { InitializeOauthSigninDocument } from '../../../../generated/graphql';

const DEFAULT_DEVELOPER_NAME = 'developer';

export default function useDevelopmentSignin(name = DEFAULT_DEVELOPER_NAME) {
  const [, executeInitializeOauth] = useMutation(InitializeOauthSigninDocument);
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
        throw new Error('Unable to initializeOauthSignin');
      }
      const nonce = data.initializeOauthSignin;
      const url = new URL(
        `${window.location.origin}/api/oauth/callback?code=${encodeURIComponent(
          name
        )}&state=${encodeURIComponent(
          JSON.stringify({
            provider: 'development',
            nonce,
            redirect_uri,
          })
        )}`
      );
      window.location.assign(url);
    },
  ] as const;
}
