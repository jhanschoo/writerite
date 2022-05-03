import { useRouter } from 'next/router';
import { Button, Paper, Typography } from '@mui/material';
import { Masonry } from '@mui/lab';
import { FC, MouseEvent } from 'react';
import { useMotionContext } from '../../../hooks/useMotionContext';
import { motionThemes } from '../../../lib/framer-motion/motionThemes';
import { Link } from '../../../components/link/Link';
import { useQuery } from 'urql';
import { DecksDocument, DecksQueryScope } from '@generated/graphql';

export const USER_DECK_SUMMARY_DECKS_NUM = 20;

export const UserDecksSummary: FC<{}> = () => {
	const router = useRouter();
	const { setMotionProps } = useMotionContext();
	const handleShowCreateDeckDialog = (_e: MouseEvent<HTMLButtonElement>) => {
		setMotionProps(motionThemes.forward);
		router.push('/app/deck/create');
	}
	const [decksResult, reexecuteDecksQuery] = useQuery({
		query: DecksDocument,
		variables: {
			scope: DecksQueryScope.Owned,
			take: USER_DECK_SUMMARY_DECKS_NUM,
		},
	});
	console.log(decksResult);
	return (
		<Paper sx={{ padding: 2 }} variant="outlined">
			<Typography variant="h4" paddingBottom={2}><Link href="/app/deck" underline="none">Decks</Link></Typography>
			<Masonry
				defaultColumns={2}
				defaultSpacing={2}
				defaultHeight={150}
				columns={{ xs: 2, sm: 3, md: 4, lg: 5, xl: 6 }}
				spacing={2}
			>
				<Button onClick={handleShowCreateDeckDialog} variant="large-action" size="large" key="deck-create-button">
					Create a new Deck
				</Button>
			</Masonry>
		</Paper>
	);
};
