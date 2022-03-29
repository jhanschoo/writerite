import { useRouter } from 'next/router';
import { Button, Paper, Typography } from '@mui/material';
import { Masonry } from '@mui/lab';
import { useState, FC, MouseEvent } from 'react';

export const UserDecksSummary: FC<{}> = () => {
	const router = useRouter();
	const handleShowCreateDeckDialog = (e: MouseEvent<HTMLButtonElement>) => {
		e.preventDefault();
		router.push('/app/deck/create');
	}
	return (
		<Paper sx={{ padding: 2 }} variant="outlined">
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
