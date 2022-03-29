import { Button, Paper, Typography } from '@mui/material';
import { Masonry } from '@mui/lab';
import { useState, FC, MouseEvent } from 'react';

export const UserDecksSummary: FC<{}> = () => {
	const [showCreateDeckDialog, setShowCreateDeckDialog] = useState(false);
	const handleShowCreateDeckDialog = (e: MouseEvent<HTMLButtonElement>) => {
		e.preventDefault();
		setShowCreateDeckDialog(!showCreateDeckDialog);
	}
	return (
		<Paper sx={{ padding: 2 }}>
			<Masonry columns={{ xs: 2, sm: 3, md: 4 }} spacing={1}>
				<Button onClick={handleShowCreateDeckDialog} variant="large-action" size="large">
					Create a new Deck
				</Button>
			</Masonry>
		</Paper>
	);
};
