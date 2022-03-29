import type { NextPage } from 'next'
import { useRouter } from 'next/router'
import { Button, Stack } from '@mui/material';

const DeckCreate: NextPage = () => {
	const router = useRouter();
	const handleBack = (e: React.MouseEvent<HTMLButtonElement>) => {
		e.preventDefault();
		router.back();
	}
	return (
		<Stack spacing={2} padding={2}>
			<Button onClick={handleBack}>Back</Button>
		</Stack>
	);
}

export default DeckCreate;
