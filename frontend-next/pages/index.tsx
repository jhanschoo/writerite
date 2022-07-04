import type { NextPage } from 'next'
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { Signin, useLogin } from '@features/signin';
import { Flex } from '@components/Flex';
import HeroHeading from '@components/HeroHeading';
import BrandText from '@components/typography/BrandText';

const Home: NextPage = () => {
  const router = useRouter();
  const login = useLogin();
  useEffect(() => {
    const { token } = router.query;
    if (window?.localStorage) {
      login(token as string | undefined);
    }
  }, [router, login]);
  return (
    <Flex
      sx={{
        flexDirection: 'column',
        height: "100vh",
        gridTemplateColumns: "repeat(12, 1fr)",
      }}
    >
      <Flex sx={{ justifyContent: "space-around", width: "100%", minHeight: "25vw" }}>
        <HeroHeading sx={{
          maxWidth: "50vw",
        }}>
          <em>Study with supercharged flashcards on </em>
          <BrandText full suffix=".">WriteRite</BrandText>
        </HeroHeading>
      </Flex>
      <Flex paddingX={4} sx={{ flexDirection: 'column' }} >
        <Signin sx={{ width: "100%" }} />
      </Flex>
    </Flex>
  );
}

export default Home
