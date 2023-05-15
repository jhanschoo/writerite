import '@styles/globals.css';
import React from 'react';
import type { AppProps } from 'next/app';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { withDefaultUrqlClient } from '@lib/urql/withDefaultUrqlClient';
import { Providers } from '@providers/Providers';
import { WithUrqlProps } from 'next-urql';

const WrApp = ({ Component, ...rest }: AppProps & WithUrqlProps) => {
  const router = useRouter();

  return (
    <>
      <Head>
        <meta
          name="viewport"
          content="minimum-scale=1, initial-scale=1, width=device-width"
        />
        <title>WriteRite</title>
        <meta name="description" content="WriteRite: Quizzes from Cards" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Providers resetUrqlClient={rest.resetUrqlClient}>
        <Component {...rest} key={router.route} />
      </Providers>
    </>
  );
};

export default withDefaultUrqlClient(WrApp);
