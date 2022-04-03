import type { NextPage } from 'next'
import { useRouter } from 'next/router'
import { Button, Stack } from '@mui/material';
import { motion } from 'framer-motion';
import { useMotionContext } from '../../../components/core/framer-motion/useMotionContext';
import { nextTick } from '../../../lib/core/utilities/nextTick';

const DeckCreate: NextPage = () => {
	const router = useRouter();
	const { motionProps, setMotionProps } = useMotionContext();
	const handleBack = async (e: React.MouseEvent<HTMLButtonElement>) => {
		e.preventDefault();
		await nextTick(() => setMotionProps({
			initial: { x: '-100%' },
			animate: { x: 0 },
			exit: { x: '100%' },
		}));
		router.back();
	}
	return (
		<motion.div {...motionProps}>
			<Stack spacing={2} padding={2}>
				<Button onClick={handleBack}>Back</Button>
			</Stack>
		</motion.div>
	);
}

export default DeckCreate;
