import type { NextPage } from 'next'
import { useQuery } from 'urql';

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
		<div>
			<FinalizeUserDialog open={showFinalizeUserModal} handleSuccessfulNameChange={reexecuteUserQuery} />
			<UserDecksSummary />
			<button onClick={logout}>logout</button>
			<p>{JSON.stringify(userResult.data)}</p>
		</div>
	);
}

export default Home
