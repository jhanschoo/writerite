import { useRouter } from "next/router";
import {
  getAccessToken,
  SerializedSessionInfo,
  setSessionInfo,
} from "../../../lib/tokenManagement";

// Performs a login of the user if an access token is provided (albeit persisting the token) or there already exists a persisted access token.
// TODO: useLocalStorage
export function useLogin() {
  const router = useRouter();
  return async (serializedSessionInfo: SerializedSessionInfo) => {
    setSessionInfo(serializedSessionInfo);
    if (getAccessToken()) {
      console.log(getAccessToken());
      await router.push("/app");
    }
  };
}
