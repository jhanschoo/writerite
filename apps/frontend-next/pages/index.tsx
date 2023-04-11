import type { NextPage } from 'next';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { Signin, useLogin } from '@features/signin';
import HeroHeading from '@components/HeroHeading';
import BrandText from '@components/typography/BrandText';
import { Center, Stack } from '@mantine/core';

const Home: NextPage = () => {
  const router = useRouter();
  const login = useLogin();
  useEffect(() => {
    const { token, currentUser } = router.query;
    if (window?.localStorage && typeof token === 'string' && typeof currentUser === 'string') {
      login({ token, currentUser });
    }
  }, [router, login]);
  return (
    <Stack
      align="center"
      sx={{
        height: '100vh',
      }}
    >
      <Center sx={(theme) => ({ minHeight: '25vw', maxWidth: '50vw', margin: theme.spacing.lg })}>
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
