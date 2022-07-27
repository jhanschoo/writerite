import { AppShell, Button, Center, Footer, Group, Header, Stack, Text } from '@mantine/core';
import { useLogout } from '@features/signin/hooks/useLogout';
import BreadcrumbsNav from '@components/nav/BreadcrumbsNav';
import { FC } from 'react';
import BrandText from '@/components/typography/BrandText';
import { NextLinkAnchor } from '@/components/link/NextLinkAnchor';

interface Props {
  breadcrumbs?: [string, string | JSX.Element][];
}

export const StandardLayout: FC<Props> = ({ breadcrumbs, children }) => {
  const logout = useLogout();
  return (
    <AppShell
      padding="md"
      fixed={false}
      header={
        <Header height="3rem">
          <Group sx={({ spacing: { md } }) => ({ position: 'relative', width: '100%', height: '100%', padding: `0 ${md}px`, justifyContent: 'space-between', zIndex: 0 })}>
            <BreadcrumbsNav breadcrumbs={breadcrumbs} groupProps={{ sx: { zIndex: 200 } }} />
            <Group sx={{ justifyContent: 'flex-end', zIndex: 200 }}>
              <Button onClick={logout} size="xs">logout</Button>
            </Group>
            <Center sx={{ position: 'absolute', width: '100%', height: '100%', zIndex: 100 }}>
              <NextLinkAnchor variant="text" href="/app"><BrandText full /></NextLinkAnchor>
            </Center>
          </Group>
        </Header>
      }
      footer={<Footer height="3rem"><Center><Text>Hello, World!</Text></Center></Footer>}
      styles={(theme) => {
        const { background } = theme.fn.variant({ variant: 'light', color: 'gray' });
        return {
          main: { backgroundColor: background },
        };
      }}
      sx={{
        minHeight: '100vh',
      }}
    >
      <Stack spacing={2}>
        {children}
      </Stack>
    </AppShell>
  );
};
