import type { NextPage } from 'next'
import { useQuery } from 'urql';
import { Button, Stack, Typography } from '@mui/material';

import { useLogout } from '../../components/core/signin/login/useLogout';
import { UserDocument } from '../../generated/graphql';
import FinalizeUserDialog from '../../components/core/business/user/FinalizeUserDialog';
import { UserDecksSummary } from '../../components/core/business/deck/UserDecksSummary';

const Home: NextPage = () => {
	const [userResult, reexecuteUserQuery] = useQuery({
		query: UserDocument,
	});
	const showFinalizeUserModal = Boolean(userResult.data?.user && !userResult.data.user.name);
	const logout = useLogout();
	return (
		<>
		<FinalizeUserDialog open={showFinalizeUserModal} handleSuccessfulNameChange={reexecuteUserQuery} />
		<Stack spacing={2} padding={2}>
			<UserDecksSummary />
			<Button onClick={logout}>logout</Button>
			<Typography>{JSON.stringify(userResult.data, undefined, 2)}</Typography>
		</Stack>
		</>
	);
}

export default Home
