import { ChangeEvent, MouseEvent } from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, TextField } from '@mui/material';
import { FC } from 'react';
import { useLogout } from '../../features/signin';
import { useFinalizeUser } from './useFinalizeUser';

interface FinalizeUserProps {
	open: boolean;
	handleSuccessfulNameChange: () => void;
}

// This page is shown to get the user to set a nickname.
const FinalizeUserDialog: FC<FinalizeUserProps> = ({ open, handleSuccessfulNameChange }) => {
	const logout = useLogout();
	const [name, setName, finalize] = useFinalizeUser(handleSuccessfulNameChange);
	const handleNicknameChange = ({ target: { value } }: ChangeEvent<HTMLInputElement>) => {
		setName(value);
	}
	const handleSubmit = async (e: MouseEvent<HTMLButtonElement>) => {
		e.preventDefault();
		finalize();
	}
	const handleLogout = async (e: MouseEvent<HTMLButtonElement>) => {
		e.preventDefault();
		logout();
	}
	return (
		<Dialog open={open}>
			<DialogContent>
				<DialogContentText id="set-name-description">
					Set name <TextField id="name" label="Name" variant="standard" value={name} onChange={handleNicknameChange} />
				</DialogContentText>
			</DialogContent>
			<DialogActions>
				<Button onClick={handleLogout}>
					Logout
				</Button>
				<Button variant="outlined" onClick={handleSubmit}>Submit</Button>
			</DialogActions>
		</Dialog>
	);
}

export default FinalizeUserDialog;
