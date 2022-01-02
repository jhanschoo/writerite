import React from 'react';
import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { Providers } from '../components/core/providers/Providers';

const WrApp: React.FC<AppProps> = ({ Component, pageProps }) => {
	return (
		<Providers emotionCache={pageProps.emotionCache}>
			<Component {...pageProps} />
		</Providers>
	);
};

export default WrApp;
