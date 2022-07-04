import { Button, Stack, Typography } from '@mui/material';

import { useLogout } from '@features/signin/hooks/useLogout';
import BreadcrumbsNav from '@components/nav/BreadcrumbsNav';
import { FC } from 'react';

interface Props {
  breadcrumbs?: [string, string | JSX.Element][];
}

export const StandardLayout: FC<Props> = ({ breadcrumbs, children }) => {
  const logout = useLogout();
  return <Stack spacing={2} padding={2}>
    <BreadcrumbsNav breadcrumbs={breadcrumbs} />
    {children}
    <Button onClick={logout}>logout</Button>
  </Stack>;
}

