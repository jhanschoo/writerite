import { Box, TextField } from '@mui/material';
import type { NextPage } from 'next'
import Head from 'next/head'
import { useLogout } from '../../../components/core/signin/login/useLogout';

// This page is shown to get the user to set a nickname.
const Finalize: NextPage = () => {
	const logout = useLogout();
	return (
		<div>
			Set a nickname.
			<TextField id="name" label="Nickname" variant="standard" />

			<button onClick={logout}>logout</button>
		</div>
	);
}

export default Finalize;
