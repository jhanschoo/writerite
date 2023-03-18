import {
  AppShell,
  Button,
  createStyles,
  Drawer,
  Flex,
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
import { FC, PropsWithChildren, useState } from 'react';
import BrandText from '@/components/typography/BrandText';
import Link from 'next/link';
import { IconBell, IconLogout, IconMoonStars, IconSun } from '@tabler/icons-react';
import { useCurrentUser } from '@/hooks';
import { ProfilePicture } from '@/features/profilePicture/components';
import { useMediaQuery } from '@mantine/hooks';
import { ActionIcon } from '@/components/ActionIcon';
import { useRouter } from 'next/router';
import { PROFILE_PATH } from '@/paths';

interface Props {
  breadcrumbs?: [string, string | JSX.Element][];
  vhHeight?: boolean;
}

const useShellStyles = createStyles((theme, { vhHeight }: Pick<Props, 'vhHeight'>) => {
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

const useDrawerButtonStyles = createStyles((theme) => {
  return {
    inner: {
      justifyContent: 'flex-start',
    },
  };
});

export const StandardLayout: FC<PropsWithChildren<Props>> = ({ children, vhHeight }) => {
  const logout = useLogout();
  const currentUser = useCurrentUser();
  const router = useRouter();
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();
  const theme = useMantineTheme();
  const useMenu = useMediaQuery(`(min-width: ${theme.breakpoints.sm})`);
  const { classes: shellClasses } = useShellStyles({ vhHeight });
  const { classes: drawerButtonClasses } = useDrawerButtonStyles();
  const [showProfileOptions, setShowProfileOptions] = useState(false);
  const handleGoToProfile = () => router.push(PROFILE_PATH);
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
            columnGap: spacing.sm,
          })}
        >
          <Link href="/app">
            <BrandText />
          </Link>
          <Space sx={{ flexGrow: 1 }} />
          <ActionIcon>
            <IconBell />
          </ActionIcon>
          {currentUser && (
            <>
              <Menu opened={useMenu && showProfileOptions} onChange={setShowProfileOptions}>
                <Menu.Target>
                  <UnstyledButton onClick={() => setShowProfileOptions(!showProfileOptions)}>
                    <ProfilePicture user={currentUser} />
                  </UnstyledButton>
                </Menu.Target>
                <Menu.Dropdown>
                  <Menu.Item
                    icon={<ProfilePicture user={currentUser} />}
                    onClick={handleGoToProfile}
                  >
                    <Text fw="bolder">{currentUser.name}</Text>
                    <Text>View profile & friends</Text>
                  </Menu.Item>
                  <Menu.Item
                    icon={colorScheme === 'light' ? <IconMoonStars /> : <IconSun />}
                    onClick={() => toggleColorScheme()}
                  >
                    <Text>Use{colorScheme === 'light' ? ' dark ' : ' light '}theme</Text>
                  </Menu.Item>
                  <Menu.Item icon={<IconLogout />} onClick={logout}>
                    Logout
                  </Menu.Item>
                </Menu.Dropdown>
              </Menu>
              <Drawer
                opened={!useMenu && showProfileOptions}
                onClose={() => setShowProfileOptions(false)}
                position="right"
                title={
                  <Flex gap="sm" onClick={handleGoToProfile}>
                    <ProfilePicture user={currentUser} />
                    <Text fw="normal">
                      <Text fw="bolder">{currentUser.name}</Text>
                      <Text fz="sm">View profile & friends</Text>
                    </Text>
                  </Flex>
                }
                padding="xl"
                size="100%"
              >
                <Stack spacing={0}>
                  <Button
                    size="xl"
                    variant="subtle"
                    onClick={() => toggleColorScheme()}
                    leftIcon={
                      colorScheme === 'light' ? <IconMoonStars size={20} /> : <IconSun size={20} />
                    }
                    classNames={drawerButtonClasses}
                  >
                    Use{colorScheme === 'light' ? ' dark ' : ' light '}theme
                  </Button>
                  <Button
                    size="xl"
                    variant="subtle"
                    onClick={logout}
                    leftIcon={<IconLogout size={20} />}
                    classNames={drawerButtonClasses}
                  >
                    Logout
                  </Button>
                </Stack>
              </Drawer>
            </>
          )}
        </Header>
      }
      // footer={<Footer height={40}><Center><Text>Hello, World!</Text></Center></Footer>}
      classNames={shellClasses}
    >
      <Stack spacing={2} sx={{ flexGrow: 1, height: vhHeight ? '100%' : undefined }}>
        {children}
      </Stack>
    </AppShell>
  );
};
