import '../styles/globals.css'

import { AnimatePresence } from 'framer-motion';
import React from 'react';
import { CssBaseline } from '@mui/material';
import type { AppProps } from 'next/app'
import Head from 'next/head';
import { useRouter } from 'next/router';

import { Providers } from '../components/core/application/providers/Providers';
import { withDefaultUrqlClient } from '../lib/core/frameworks/urql/withDefaultUrqlClient';

const WrApp: React.FC<AppProps> = ({ Component, pageProps }) => {
	const { emotionCache, ...pagePropsRest } = pageProps;
	const router = useRouter();

	return (
		<Providers emotionCache={emotionCache}>
			<Head>
				<meta name="viewport" content="initial-scale=1, width=device-width" />
				<title>WriteRite</title>
				<meta name="description" content="WriteRite: Quizzes from Cards" />
				<link rel="icon" href="/favicon.ico" />
			</Head>
			<CssBaseline />
			<AnimatePresence>
				<Component {...pagePropsRest} key={router.route} />
			</AnimatePresence>
		</Providers>
	);
};

export default withDefaultUrqlClient(WrApp);
