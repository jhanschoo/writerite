import { Box } from '@mui/material';
import type { NextPage } from 'next'
import Head from 'next/head'
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { Signin } from '../components/browser/Signin';
import { Flex } from '../components/core/basic/Flex';
import HeroHeading from '../components/core/basic/HeroHeading';
import { useLogin } from '../components/core/signin/login/useLogin';
import BrandText from '../components/core/typography/BrandText';

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
		<>
			<Head>
				<title>WriteRite</title>
				<meta name="description" content="WriteRite: Quizzes from Cards" />
				<link rel="icon" href="/favicon.ico" />
			</Head>
			<Box
				sx={{
					display: "grid",
					alignItems: "stretch",
					height: "100vh",
					gridTemplateColumns: "repeat(12, 1fr)",
				}}
				gap={2}
			>
				<Flex gridColumn={{ xs: "span 12", md: "span 7" }}>
					<Flex sx={{ textAlign: "center", justifyContent: "space-around", alignItems: "center", width: "100%" }}>
						<HeroHeading sx={{
							maxWidth: "50vw",
						}}>
							<em>Study with supercharged flashcards on </em>
							<BrandText full suffix=".">WriteRite</BrandText>
						</HeroHeading>
					</Flex>
				</Flex>
				<Flex gridColumn={{ xs: "span 12", md: "span 5" }}>
					<Flex sx={{ width: "100%", alignItems: "center" }}>
						<Signin sx={{ width: "100%" }} />
					</Flex>
				</Flex>
			</Box>
		</>
	);
}

export default Home
