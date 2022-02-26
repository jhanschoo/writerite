import { useEffect } from 'react';
import { Box } from '@mui/material';
import type { NextPage } from 'next'
import { useRouter } from 'next/router';
import Head from 'next/head'
import { useQuery } from 'urql';
import { useLogout } from '../../components/core/signin/login/useLogout';
import { UserDocument } from '../../generated/graphql';

const Home: NextPage = () => {
	const router = useRouter();
	const [userResult, reexecuteUserQuery] = useQuery({
		query: UserDocument,
	});
	useEffect(() => {
		if (userResult.data?.user && !userResult.data?.user.name) {
			void router.push('/app/me/finalize');
		}
	}, [userResult, router]);
	const logout = useLogout();
	return (
		<div>
			{JSON.stringify(userResult.data)}
			<button onClick={logout}>logout</button>
		</div>
	);
}

export default Home
