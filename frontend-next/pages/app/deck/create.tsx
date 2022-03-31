import type { NextPage } from 'next'
import { useRouter } from 'next/router'
import { Button, Stack } from '@mui/material';
import { motion } from 'framer-motion';

const DeckCreate: NextPage = () => {
	const router = useRouter();
	const handleBack = (e: React.MouseEvent<HTMLButtonElement>) => {
		e.preventDefault();
		router.back();
	}
	return (
		<motion.div initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }} key="app-deck-create">
			<Stack spacing={2} padding={2}>
				<Button onClick={handleBack}>Back</Button>
			</Stack>
		</motion.div>
	);
}

export default DeckCreate;
