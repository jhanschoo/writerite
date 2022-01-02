import { Box } from '@mui/material';
import type { NextPage } from 'next'
import Head from 'next/head'
import HeroHeading from '../components/core/basic/HeroHeading';
import BrandText from '../components/core/typography/BrandText';

const Home: NextPage = () => {
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
				<Box gridColumn="span 7">
					<Box sx={{ background: 'pink' }}>
						<HeroHeading sx={{
							maxWidth: "50vw",
						}}>
							<em>Study with supercharged flashcards on </em>
							<BrandText full suffix=".">WriteRite</BrandText>
						</HeroHeading>
					</Box>
				</Box>
				<Box gridColumn="span 5">
					<Box sx={{ background: 'gray' }}>
						Signin component
					</Box>
				</Box>
			</Box>
		</>
	);
}

export default Home
