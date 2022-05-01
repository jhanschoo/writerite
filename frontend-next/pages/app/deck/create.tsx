import type { NextPage } from 'next'
import { Stack } from '@mui/material';
import { motion } from 'framer-motion';
import { useMotionContext } from '../../../src/hooks/useMotionContext';
import BreadcrumbsNav from '../../../src/components/nav/BreadcrumbsNav';
import CreateDeck from '../../../src/components/deck/CreateDeck';

const DeckCreate: NextPage = () => {
	const { motionProps } = useMotionContext();
	return (
		<motion.div {...motionProps}>
			<Stack spacing={2} padding={2} sx={{ overflow: "auto", height: "100%" }}>
				<BreadcrumbsNav showBack={true} breadcrumbs={[["/app", "Home"], ["/app/deck", "Decks"], ["/app/deck/create", "Create Deck"]]} />
				<CreateDeck />
			</Stack>
		</motion.div>
	);
}

export default DeckCreate;
