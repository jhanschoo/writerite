import { CacheProvider, EmotionCache, ThemeProvider } from '@emotion/react';
import type { MotionProps } from 'framer-motion';
import { useMemo, useState } from 'react';
import { cache } from '@lib/emotion/cache';
import { emotionTheme } from '@lib/mui/theme';
import { initialMotionState, MotionContext } from '@stores/motionContext';

interface ProvidersProps {
	emotionCache?: EmotionCache;
}

export const Providers: React.FC<ProvidersProps> = ({ emotionCache, children }) => {
	const [motionProps, setMotionProps] = useState<MotionProps>(initialMotionState.motionProps);
	const motionState = useMemo(() => ({ motionProps, setMotionProps }), [motionProps]);
	return (
		<CacheProvider value={emotionCache || cache}>
			<ThemeProvider theme={emotionTheme}>
				<MotionContext.Provider value={motionState}>
					{children}
				</MotionContext.Provider>
			</ThemeProvider>
		</CacheProvider>
	);
}
