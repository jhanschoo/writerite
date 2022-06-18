import { motion } from 'framer-motion';
import type { NextPage } from 'next'
import { useQuery } from 'urql';

import { UserDocument } from '@generated/graphql';
import FinalizeUserDialog from '@components/user/FinalizeUserDialog';
import { useMotionContext } from '@hooks/useMotionContext';
import { Dashboard } from '@/features/dashboard';
import { StandardLayout } from '@/features/standardLayout/components/StandardLayout';

const Home: NextPage = () => {
	const { motionProps } = useMotionContext();
	const [userResult, reexecuteUserQuery] = useQuery({
		query: UserDocument,
	});
	const showFinalizeUserModal = Boolean(userResult.data?.user && !userResult.data.user.name);
	return (
		<motion.div {...motionProps}>
			<FinalizeUserDialog open={showFinalizeUserModal} handleSuccessfulNameChange={reexecuteUserQuery} />
			<StandardLayout breadcrumbs={[["/app", "Home"]]}>
				<Dashboard />
			</StandardLayout>
		</motion.div>
	);
}

export default Home;
