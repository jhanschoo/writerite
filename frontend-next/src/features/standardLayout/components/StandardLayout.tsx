import {
  ActionIcon,
  AppShell,
  Avatar,
  Button,
  Center,
  createStyles,
  Footer,
  Group,
  Header,
  Space,
  Stack,
  useMantineColorScheme,
} from '@mantine/core';
import { useLogout } from '@features/signin/hooks/useLogout';
import BreadcrumbsNav from '@components/nav/BreadcrumbsNav';
import { FC, PropsWithChildren } from 'react';
import BrandText from '@/components/typography/BrandText';
import Link from 'next/link';
import { MoonIcon, SunIcon } from '@radix-ui/react-icons';
import { useCurrentUser } from '@/hooks';

interface Props {
  breadcrumbs?: [string, string | JSX.Element][];
  vhHeight?: boolean;
}

const useStyles = createStyles((theme, { vhHeight }: Pick<Props, 'vhHeight'>) => {
  const { background } = theme.fn.variant({ variant: 'light', color: 'gray' });
  return {
    main: {
      backgroundColor: background,
      display: 'flex',
      flexDirection: 'column',
      height: vhHeight ? '100vh' : undefined,
    },
    root: {
      flexGrow: 1,
    },
  };
});

export const StandardLayout: FC<PropsWithChildren<Props>> = ({ children, vhHeight }) => {
  const logout = useLogout();
  const currentUser = useCurrentUser();
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();
  const { classes } = useStyles({ vhHeight });
  return (
    <AppShell
      padding={0}
      header={
        <Header
          height={50}
          px="md"
          sx={({ spacing }) => ({
            display: 'flex',
            flexDirection: 'row',
            height: '100%',
            alignItems: 'center',
            columnGap: `${spacing.sm}px`,
          })}
        >
          <Link href="/app">
            <BrandText />
          </Link>
          <Space sx={{ flexGrow: 1 }} />
          <ActionIcon variant="outline" onClick={() => toggleColorScheme()}>
            {colorScheme === 'light' ? <MoonIcon /> : <SunIcon />}
          </ActionIcon>
          <Avatar variant="outline" radius="xl" onClick={logout}>
            A
          </Avatar>
        </Header>
      }
      // footer={<Footer height={40}><Center><Text>Hello, World!</Text></Center></Footer>}
      classNames={classes}
    >
      <Stack spacing={2} sx={{ flexGrow: 1, height: vhHeight ? '100%' : undefined }}>
        {children}
      </Stack>
    </AppShell>
  );
};
