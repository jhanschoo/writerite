import { CacheProvider, EmotionCache, ThemeProvider } from '@emotion/react'
import { cache } from '../../../lib/browser/emotion/cache';
import { emotionTheme } from '../../../lib/core/frameworks/emotion/theme';

interface ProvidersProps {
	emotionCache?: EmotionCache;
}

export const Providers: React.FC<ProvidersProps> = ({ emotionCache, children }) => {
	return (
		<CacheProvider value={emotionCache || cache}>
			<ThemeProvider theme={emotionTheme}>
				{children}
			</ThemeProvider>
		</CacheProvider>
	);
}
