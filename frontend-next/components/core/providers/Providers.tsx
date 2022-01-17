import { CacheProvider, EmotionCache, ThemeProvider } from '@emotion/react'
import { ApolloClient, ApolloProvider } from '@apollo/client';
import { cache } from '../../../lib/browser/emotion/cache';
import { emotionTheme } from '../../../lib/core/frameworks/emotion/theme';
import { useEffect, useState } from 'react';
import { getBrowserClient } from '../../../lib/browser/apollo/client';

interface ProvidersProps {
	apolloClient?: ApolloClient<any>;
	emotionCache?: EmotionCache;
}

export const Providers: React.FC<ProvidersProps> = ({ apolloClient: apolloClientProp, emotionCache, children }) => {
	const [apolloClient, setApolloClient] = useState<ApolloClient<any> | undefined>(apolloClientProp);
	useEffect(() => {
		if (!apolloClientProp) {
			(async () => {
				setApolloClient(await getBrowserClient());
			})();
		}
	}, [apolloClientProp])
	if (!apolloClient) {
		return null;
	}
	return (
		<ApolloProvider client={apolloClient}>
			<CacheProvider value={emotionCache || cache}>
				<ThemeProvider theme={emotionTheme}>
					{children}
				</ThemeProvider>
			</CacheProvider>
		</ApolloProvider>
	);
}
