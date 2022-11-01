import { useRouter } from 'next/router';
import { removeAccessToken } from '../../../lib/tokenManagement';

// Performs a login of the user if an access token is provided (albeit persisting the token) or there already exists a persisted access token.
export function useLogout() {
  const router = useRouter();
  return () => {
    removeAccessToken();
    void router.push('/');
  };
}
