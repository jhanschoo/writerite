import { useEffect, useState } from 'react';
import type { NextPage } from 'next';
import { useRouter } from 'next/router';
import HeroHeading from '@components/HeroHeading';
import BrandText from '@components/typography/BrandText';
import { Signin, useLogin } from '@features/signin';
import { Center, LoadingOverlay, Stack } from '@mantine/core';

const Home: NextPage = () => {
  const router = useRouter();
  const login = useLogin();
  const { token, currentUser } = router.query;
  // on the server side this is false
  const [inspectingToken, setInspectingToken] = useState(false);
  useEffect(() => {
    if (
      window?.localStorage &&
      typeof token === 'string' &&
      typeof currentUser === 'string' &&
      !inspectingToken
    ) {
      setInspectingToken(true);
      login({ token, currentUser }).catch(() => setInspectingToken(false));
    }
  }, [router, login]);
  return (
    <Stack
      align="center"
      sx={{
        height: '100vh',
      }}
    >
      <LoadingOverlay visible={inspectingToken} />
      <Center
        sx={(theme) => ({
          minHeight: '25vw',
          maxWidth: '50vw',
          margin: theme.spacing.lg,
        })}
      >
        <HeroHeading>
          <em>Study with supercharged flashcards on </em>
          <BrandText full suffix=".">
            WriteRite
          </BrandText>
        </HeroHeading>
      </Center>
      <Center sx={(theme) => ({ maxWidth: '50vw' })}>
        <Signin sx={{ width: '100%' }} />
      </Center>
    </Stack>
  );
};

export default Home;
