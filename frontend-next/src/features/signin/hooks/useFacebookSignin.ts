import { useState } from "react";
import { useMutation } from "urql";
import { InitializeThirdPartyOauthSigninDocument } from "../../../../generated/graphql";

// https://developers.facebook.com/docs/facebook-login/manually-build-a-login-flow
const client_id = process.env.NEXT_PUBLIC_FACEBOOK_APP_ID as string;

export default function useFacebookSignin() {
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
        throw new Error("Unable to initializeThirdPartyOauthSignin");
      }
      const nonce = data.initializeThirdPartyOauthSignin;
      const url = new URL(`https://www.facebook.com/v12.0/dialog/oauth?client_id=${client_id}&redirect_uri=${redirect_uri}&response_type=code&scope=email public_profile&state=${
        JSON.stringify({
          provider: "facebook",
          nonce,
          redirect_uri,
        })
      }`);
      window.location.assign(url);
    }
  ] as const;
}
