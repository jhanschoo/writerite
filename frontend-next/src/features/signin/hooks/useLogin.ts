import { useRouter } from 'next/router';
import { getAccessKey, setAccessKey } from '../../../lib/tokenManagement';

// Performs a login of the user if an access token is provided (albeit persisting the token) or there already exists a persisted access token.
// TODO: useLocalStorage
export function useLogin() {
  const router = useRouter();
  return (token?: string) => {
    if (token) {
      setAccessKey(token);
    }
    if (getAccessKey()) {
      void router.push('/app');
    }
  };
}
