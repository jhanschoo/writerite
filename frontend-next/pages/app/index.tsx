import { Box } from '@mui/material';
import type { NextPage } from 'next'
import Head from 'next/head'
import { useLogout } from '../../components/core/signin/login/useLogout';

const Home: NextPage = () => {
	const logout = useLogout();
	return (
		<button onClick={logout}>logout</button>
	);
}

export default Home
