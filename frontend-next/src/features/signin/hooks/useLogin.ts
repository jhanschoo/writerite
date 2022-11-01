import { useRouter } from 'next/router';
import { getAccessToken, setAccessToken } from '../../../lib/tokenManagement';

// Performs a login of the user if an access token is provided (albeit persisting the token) or there already exists a persisted access token.
// TODO: useLocalStorage
export function useLogin() {
  const router = useRouter();
  return (token?: string) => {
    if (token) {
      setAccessToken(token);
    }
    if (getAccessToken()) {
      void router.push('/app');
    }
  };
}
