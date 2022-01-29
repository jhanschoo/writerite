import React from 'react';
import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { Providers } from '../components/core/providers/Providers';
import Head from 'next/head';
import { withDefaultUrqlClient } from '../lib/core/frameworks/urql/withDefaultUrqlClient';

const WrApp: React.FC<AppProps> = ({ Component, pageProps }) => {
	const { emotionCache, ...pagePropsRest } = pageProps;
	return (
		<Providers emotionCache={emotionCache}>
			<Head>
				<meta name="viewport" content="initial-scale=1, width=device-width" />
			</Head>
			<Component {...pagePropsRest} />
		</Providers>
	);
};

export default withDefaultUrqlClient(WrApp);
