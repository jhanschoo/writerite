import { Button, Stack, Typography } from '@mui/material';
import { useQuery } from 'urql';

import { useLogout } from '@features/signin/hooks/useLogout';
import { UserDocument } from '@generated/graphql';
import { UserDecksSummary } from '@/features/dashboard/components/UserDecksSummary';
import BreadcrumbsNav from '@components/nav/BreadcrumbsNav';
import { FC } from 'react';

export const Dashboard: FC = () => {
	const [userResult] = useQuery({
		query: UserDocument,
	});
	const logout = useLogout();
	return <Stack spacing={2} padding={2}>
		<BreadcrumbsNav breadcrumbs={[["/app", "Home"]]} />
		<UserDecksSummary />
		<Button onClick={logout}>logout</Button>
		<Typography>{JSON.stringify(userResult.data, undefined, 2)}</Typography>
	</Stack>;
}

