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
  Menu,
  Space,
  Stack,
  Text,
  UnstyledButton,
  useMantineColorScheme,
  useMantineTheme,
} from '@mantine/core';
import { useLogout } from '@features/signin/hooks/useLogout';
import BreadcrumbsNav from '@components/nav/BreadcrumbsNav';
import { FC, PropsWithChildren, useState } from 'react';
import BrandText from '@/components/typography/BrandText';
import Link from 'next/link';
import { ExitIcon, MoonIcon, SunIcon } from '@radix-ui/react-icons';
import { useCurrentUser } from '@/hooks';
import { generatedAvatarUrl } from '@/utils/generatedAvatarUrl';
import { ProfilePicture } from '@/features/profilePicture/components';
import { useMediaQuery } from '@mantine/hooks';

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
  const theme = useMantineTheme();
  const useDrawer = useMediaQuery(`(max-width: ${theme.breakpoints.sm}px)`);
  const { classes } = useStyles({ vhHeight });
  const [showProfileOptions, setShowProfileOptions] = useState(false);
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
          {currentUser && (
            <Menu opened={!useDrawer && showProfileOptions} onChange={setShowProfileOptions}>
              <Menu.Target>
                <UnstyledButton onClick={() => setShowProfileOptions(!showProfileOptions)}>
                  <ProfilePicture user={currentUser} />
                </UnstyledButton>
              </Menu.Target>
              <Menu.Dropdown>
                <Menu.Item icon={<ProfilePicture user={currentUser} />}>
                  <Text fw="bolder">{currentUser.name}</Text>
                </Menu.Item>
                <Menu.Item
                  icon={colorScheme === 'light' ? <MoonIcon /> : <SunIcon />}
                  onClick={() => toggleColorScheme()}
                >
                  <Text>Use{colorScheme === 'light' ? ' dark ' : ' light '}theme</Text>
                </Menu.Item>
                <Menu.Item icon={<ExitIcon />}>Logout</Menu.Item>
              </Menu.Dropdown>
            </Menu>
          )}
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
