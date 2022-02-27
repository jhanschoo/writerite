import type { NextPage } from 'next'
import { useQuery } from 'urql';

import { useLogout } from '../../components/core/signin/login/useLogout';
import { UserDocument } from '../../generated/graphql';
import FinalizeUserDialog from '../../components/core/business/user/FinalizeUserDialog';

const Home: NextPage = () => {
	const [userResult, reexecuteUserQuery] = useQuery({
		query: UserDocument,
	});
	const showFinalizeUserModal = Boolean(userResult.data?.user && !userResult.data.user.name);
	const logout = useLogout();
	return (
		<div>
			{JSON.stringify(userResult.data)}
			<button onClick={logout}>logout</button>
			<FinalizeUserDialog open={showFinalizeUserModal} handleSuccessfulNameChange={reexecuteUserQuery} />
		</div>
	);
}

export default Home
