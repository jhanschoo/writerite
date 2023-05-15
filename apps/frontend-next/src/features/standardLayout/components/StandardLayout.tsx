import { PropsWithChildren, useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { ProfilePicture } from '@/features/profilePicture/components';
import { useCurrentUser } from '@/hooks';
import { FRIENDS_PATH, PROFILE_PATH } from '@/paths';
import { useLogout } from '@features/signin/hooks/useLogout';
import {
  AppShell,
  Button,
  Drawer,
  Flex,
  Header,
  Menu,
  Space,
  Stack,
  Text,
  UnstyledButton,
  createStyles,
  useMantineColorScheme,
  useMantineTheme,
} from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import {
  IconBell,
  IconHeartHandshake,
  IconLogout,
  IconMoonStars,
  IconSun,
} from '@tabler/icons-react';

import { ActionIcon } from '@/components/ActionIcon';
import BrandText from '@/components/typography/BrandText';
import { CurrentUser } from '@/lib/tokenManagement';

interface Props {
  vhHeight?: boolean;
}

const useShellStyles = createStyles(
  (theme, { vhHeight }: Pick<Props, 'vhHeight'>) => {
    const { background } = theme.fn.variant({
      variant: 'light',
      color: 'gray',
    });
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
  }
);

const useDrawerButtonStyles = createStyles(() => ({
  inner: {
    justifyContent: 'flex-start',
  },
}));

export const StandardLayout = ({
  children,
  vhHeight,
}: PropsWithChildren<Props>) => {
  const logout = useLogout();
  const currentUserDangerous = useCurrentUser();
  const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null);
  useEffect(() => {
    if (!currentUser && currentUserDangerous) {
      setCurrentUser(currentUserDangerous);
    }
  }, [currentUser, currentUserDangerous])
  const router = useRouter();
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();
  const theme = useMantineTheme();
  const useMenu = useMediaQuery(`(min-width: ${theme.breakpoints.sm})`);
  const { classes: shellClasses } = useShellStyles({ vhHeight });
  const { classes: drawerButtonClasses } = useDrawerButtonStyles();
  const [showProfileOptions, setShowProfileOptions] = useState(false);
  const handleGoToProfile = () => router.push(PROFILE_PATH);
  const handleGoToFriends = () => router.push(FRIENDS_PATH);
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
              <Menu
                opened={useMenu && showProfileOptions}
                onChange={setShowProfileOptions}
              >
                <Menu.Target>
                  <UnstyledButton
                    onClick={() => setShowProfileOptions(!showProfileOptions)}
                  >
                    <ProfilePicture user={currentUser} />
                  </UnstyledButton>
                </Menu.Target>
                <Menu.Dropdown>
                  <Menu.Item
                    icon={<ProfilePicture user={currentUser} />}
                    onClick={handleGoToProfile}
                  >
                    <Text fw="bolder">{currentUser.name}</Text>
                    <Text>View profile</Text>
                  </Menu.Item>
                  <Menu.Item
                    icon={<IconHeartHandshake />}
                    onClick={handleGoToFriends}
                  >
                    <Text>Friends</Text>
                  </Menu.Item>
                  <Menu.Item
                    icon={
                      colorScheme === 'light' ? <IconMoonStars /> : <IconSun />
                    }
                    onClick={() => toggleColorScheme()}
                  >
                    <Text>
                      Use{colorScheme === 'light' ? ' dark ' : ' light '}theme
                    </Text>
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
                      <Text fz="sm">View profile</Text>
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
                    onClick={handleGoToFriends}
                    leftIcon={<IconHeartHandshake size={20} />}
                    classNames={drawerButtonClasses}
                  >
                    Friends
                  </Button>
                  <Button
                    size="xl"
                    variant="subtle"
                    onClick={() => toggleColorScheme()}
                    leftIcon={
                      colorScheme === 'light' ? (
                        <IconMoonStars size={20} />
                      ) : (
                        <IconSun size={20} />
                      )
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
      <Stack
        spacing={2}
        sx={{ flexGrow: 1, height: vhHeight ? '100%' : undefined }}
      >
        {children}
      </Stack>
    </AppShell>
  );
};
