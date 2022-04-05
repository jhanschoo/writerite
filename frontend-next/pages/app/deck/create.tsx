import type { NextPage } from 'next'
import { Stack } from '@mui/material';
import { motion } from 'framer-motion';
import { useMotionContext } from '../../../components/core/framer-motion/useMotionContext';
import BreadcrumbsNav from '../../../components/core/nav/BreadcrumbsNav';
import CreateDeckWidget from '../../../components/core/business/deck/CreateDeckWidget';

const DeckCreate: NextPage = () => {
	const { motionProps } = useMotionContext();
	return (
		<motion.div {...motionProps}>
			<Stack spacing={2} padding={2}>
				<BreadcrumbsNav showBack={true} breadcrumbs={[["/app", "Home"], ["/app/deck", "Decks"], ["/app/deck/create", "Create Deck"]]} />
				<CreateDeckWidget />
			</Stack>
		</motion.div>
	);
}

export default DeckCreate;
