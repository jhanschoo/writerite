import { useInterval } from '@mantine/hooks';
import { useEffect } from 'react';
import { useClient } from 'urql';
import { useRefreshToken } from './useRefreshToken';

// Performs a login of the user if an access token is provided (albeit persisting the token) or there already exists a persisted access token.
// TODO: useLocalStorage
export function usePeriodicallyRefreshToken(timeoutInMsOverride?: number) {
  const ms = timeoutInMsOverride ?? Number(process.env.NEXT_PUBLIC_ACCESS_TOKEN_TIMEOUT_IN_MS as string);
  const client = useClient();
  const refreshToken = useRefreshToken(client);
  const interval = useInterval(refreshToken, ms);
  useEffect(() => {
    interval.start();
    return interval.stop;
  }, [])
}
