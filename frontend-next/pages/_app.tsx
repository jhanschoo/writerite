import React from 'react';
import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { Providers } from '../components/core/providers/Providers';
import Head from 'next/head';

const WrApp: React.FC<AppProps> = ({ Component, pageProps }) => {
	const { apolloClient, emotionCache, ...pagePropsRest } = pageProps;
	return (
		<Providers emotionCache={emotionCache} apolloClient={apolloClient}>
			<Head>
				<meta name="viewport" content="initial-scale=1, width=device-width" />
			</Head>
			<Component {...pagePropsRest} />
		</Providers>
	);
};

export default WrApp;
