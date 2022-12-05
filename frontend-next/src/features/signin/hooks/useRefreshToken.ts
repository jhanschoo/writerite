import { RefreshDocument } from '@generated/graphql';
import { Client } from 'urql';
import { getAccessToken, setSessionInfo } from '../../../lib/tokenManagement';

// Performs a login of the user if an access token is provided (albeit persisting the token) or there already exists a persisted access token.
// TODO: useLocalStorage
export function useRefreshToken(client: Client) {
  return async () => {
    const token = getAccessToken();
    if (!token) {
      console.error('token refresh failed: no token');
      return;
    }
    const result = await client.mutation(RefreshDocument, { token }).toPromise();
    const newSessionInfo = result.data?.refresh;
    if (!newSessionInfo) {
      console.error('token refresh failed: no token response');
      return;
    }
    setSessionInfo({
      token: newSessionInfo.token,
      currentUser: JSON.stringify(newSessionInfo.currentUser),
    });
  };
}
