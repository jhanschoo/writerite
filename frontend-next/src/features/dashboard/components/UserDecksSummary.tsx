import { formatISO, parseISO } from 'date-fns';
import { Button, Paper, Stack, Typography, useTheme } from '@mui/material';
import { useRouter } from 'next/router';
import { FC, MouseEvent } from 'react';
import { useQuery } from 'urql';
import { useMotionContext } from '@hooks/useMotionContext';
import { motionThemes } from '@lib/framer-motion/motionThemes';
import { DecksDocument, DecksQuery, DecksQueryScope } from '@generated/graphql';
import { Add } from '@mui/icons-material';

export const USER_DECK_SUMMARY_DECKS_NUM = 20;

const DeckItem = ({ deck: { id, name, editedAt, subdecks, cardsDirect } }: { deck: DecksQuery["decks"][number] }) => {
	const theme = useTheme();
	const router = useRouter();
	const nameDisplay = name ? <Typography variant="h5">{name}</Typography> : <Typography variant="h5" sx={{ fontStyle: "italic", color: theme.palette.text.secondary }}>Untitled</Typography>;
	const editedAtDisplay = formatISO(parseISO(editedAt), { representation: "date" });
	const handleClick = (e: MouseEvent) => {
		e.stopPropagation();
		router.push(`/app/deck/${id}`);
	};
	return <Paper elevation={2} onClick={handleClick}>
		<Stack padding={2}>
			{nameDisplay}
			<Typography>{subdecks.length} subdecks<br />
			{cardsDirect.length} cards<br />
			last edited at {editedAtDisplay}
			</Typography>
		</Stack>
	</Paper>
}

export const UserDecksSummary: FC<Record<string, unknown>> = () => {
	const router = useRouter();
	const { setMotionProps } = useMotionContext();
	const handleCreateDeckDialog = (e: MouseEvent) => {
		e.stopPropagation();
		setMotionProps(motionThemes.forward);
		router.push('/app/deck/create');
	}
	const handleManageDecksDialog = (e: MouseEvent) => {
		e.stopPropagation();
		setMotionProps(motionThemes.forward);
		router.push('/app/deck');
	}
	const [decksResult] = useQuery({
		query: DecksDocument,
		variables: {
			scope: DecksQueryScope.Owned,
			take: USER_DECK_SUMMARY_DECKS_NUM,
		},
	});
	const decks = (decksResult.data?.decks || []).map((deck, index) => <DeckItem key={index} deck={deck} />);
	return (
		<Paper sx={{ padding: 2, cursor: "pointer" }} variant="outlined" onClick={handleManageDecksDialog}>
			<Stack direction="row" alignItems="baseline" spacing={2}>
				<Typography variant="h4" paddingBottom={2}>Decks</Typography>
			</Stack>
			<Stack direction="row" alignItems="stretch" spacing={2}>
				<Button onClick={handleCreateDeckDialog} variant="large-action" size="large" key="deck-create-button" aria-label="Create an new Deck">
					<Add />
				</Button>
				{decks}
				<Button onClick={handleManageDecksDialog} size="large" key="manage-decks-button">
					more...
				</Button>
			</Stack>
		</Paper>
	);
};
