import { Button } from '@mui/material';
import { useState, FC, MouseEvent } from 'react';

export const UserDecksSummary: FC<{}> = () => {
	const [showCreateDeckDialog, setShowCreateDeckDialog] = useState(false);
	const handleShowCreateDeckDialog = (e: MouseEvent<HTMLButtonElement>) => {
		e.preventDefault();
		setShowCreateDeckDialog(!showCreateDeckDialog);
	}
	return (<div>
		<Button onClick={handleShowCreateDeckDialog}>
			Create a new Deck
		</Button>
	</div>)
};
