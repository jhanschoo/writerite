import { AppShell, Button, Center, createStyles, Footer, Group, Header, Stack } from '@mantine/core';
import { useLogout } from '@features/signin/hooks/useLogout';
import BreadcrumbsNav from '@components/nav/BreadcrumbsNav';
import { FC, PropsWithChildren } from 'react';
import BrandText from '@/components/typography/BrandText';
import { NextLinkAnchor } from '@/components/link/NextLinkAnchor';

interface Props {
  breadcrumbs?: [string, string | JSX.Element][];
}

const useStyles = createStyles((theme) => {
  const { background } = theme.fn.variant({ variant: 'light', color: 'gray' });
  return {
    main: {
      backgroundColor: background,
      display: 'flex',
      flexDirection: 'column',
    },
    root: {
      flexGrow: 1,
    },
  };
});

export const StandardLayout: FC<PropsWithChildren<Props>> = ({ breadcrumbs, children }) => {
  const logout = useLogout();
  const { classes } = useStyles();
  return (
    <AppShell
      padding={0}
      header={
        <Header height={50}>
          <Group sx={({ spacing: { md } }) => ({ position: 'relative', width: `calc(100% - ${md * 2}px)`, height: '100%', padding: `0 ${md}px`, justifyContent: 'space-between', zIndex: 0 })}>
            <BreadcrumbsNav breadcrumbs={breadcrumbs} groupProps={{ sx: { zIndex: 200 } }} />
            <Group sx={{ justifyContent: 'flex-end', zIndex: 200 }}>
              <Button onClick={logout} size="xs">logout</Button>
            </Group>
            <Center sx={({ spacing: { md } }) => ({ position: 'absolute', width: `calc(100% - ${md * 2}px)`, height: '100%', zIndex: 100 })}>
              <NextLinkAnchor variant="text" href="/app"><BrandText full /></NextLinkAnchor>
            </Center>
          </Group>
        </Header>
      }
      // footer={<Footer height={40}><Center><Text>Hello, World!</Text></Center></Footer>}
      classNames={classes}
    >
      <Stack spacing={2} sx={{ flexGrow: 1 }}>
        {children}
      </Stack>
    </AppShell>
  );
};
