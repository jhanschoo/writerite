import type { NextPage } from 'next'
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { Signin } from '../src/features/signin/components/Signin';
import { Flex } from '../src/components/Flex';
import HeroHeading from '../src/components/HeroHeading';
import { useLogin } from '../src/features/signin';
import BrandText from '../src/components/typography/BrandText';

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
