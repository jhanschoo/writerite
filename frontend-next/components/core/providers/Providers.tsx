import { useMemo, useState } from 'react';
import { CacheProvider, EmotionCache, ThemeProvider } from '@emotion/react'
import { cache } from '../../../lib/browser/emotion/cache';
import { emotionTheme } from '../../../lib/core/frameworks/mui/theme';
import { initialMotionState, MotionContext } from '../../../lib/core/frameworks/framer-motion/motionContext';

interface ProvidersProps {
	emotionCache?: EmotionCache;
}

export const Providers: React.FC<ProvidersProps> = ({ emotionCache, children }) => {
	const [motionProps, setMotionProps] = useState(initialMotionState.motionProps);
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
