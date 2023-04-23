import { useRouter } from 'next/router';

import {
  SerializedSessionInfo,
  getAccessToken,
  setSessionInfo,
} from '../../../lib/tokenManagement';

// Performs a login of the user if an access token is provided (albeit persisting the token) or there already exists a persisted access token.
// TODO: useLocalStorage
export function useLogin() {
  const router = useRouter();
  return async (serializedSessionInfo: SerializedSessionInfo) => {
    setSessionInfo(serializedSessionInfo);
    if (getAccessToken()) {
      await router.push('/app');
    }
  };
}
