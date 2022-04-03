import { motion } from 'framer-motion';
import { Button, Stack, Typography } from '@mui/material';
import type { NextPage } from 'next'
import { useQuery } from 'urql';

import { useLogout } from '../../components/core/signin/login/useLogout';
import { UserDocument } from '../../generated/graphql';
import FinalizeUserDialog from '../../components/core/business/user/FinalizeUserDialog';
import { UserDecksSummary } from '../../components/core/business/deck/UserDecksSummary';
import { useMotionContext } from '../../components/core/framer-motion/useMotionContext';
import BreadcrumbsNav from '../../components/core/nav/BreadcrumbsNav';

const Home: NextPage = () => {
	const { motionProps } = useMotionContext();
	const [userResult, reexecuteUserQuery] = useQuery({
		query: UserDocument,
	});
	const showFinalizeUserModal = Boolean(userResult.data?.user && !userResult.data.user.name);
	const logout = useLogout();
	return (
		<motion.div {...motionProps}>
			<FinalizeUserDialog open={showFinalizeUserModal} handleSuccessfulNameChange={reexecuteUserQuery} />
			<Stack spacing={2} padding={2}>
				<BreadcrumbsNav breadcrumbs={[["/app", "Home"]]} />
				<UserDecksSummary />
				<Button onClick={logout}>logout</Button>
				<Typography>{JSON.stringify(userResult.data, undefined, 2)}</Typography>
			</Stack>
		</motion.div>
	);
}

export default Home;
