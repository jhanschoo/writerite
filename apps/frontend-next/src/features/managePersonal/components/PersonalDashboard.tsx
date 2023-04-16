import { Box, Button, createStyles, Stack, Title } from '@mantine/core';
import { IconPencil } from '@tabler/icons-react';
import { PersonalFriends } from './PersonalFriends';
import { PersonalProfile, PersonalProfileFragment } from './PersonalProfile';
import { FragmentType } from '@generated/gql';

const useStyles = createStyles((theme) => ({
  gridBox: {
    display: 'grid',
    gridTemplateColumns: 'repeat(12, 1fr)',
    maxWidth: theme.breakpoints.lg,
    margin: 'auto',
    gap: theme.spacing.md,
  },
  headerPanel: {
    gridColumn: 'span 12',
  },
  profilePanel: {
    gridColumn: 'span 12',
    [`@media (min-width: ${theme.breakpoints.lg})`]: {
      gridColumn: 'span 6',
    },
  },
  friendsPanel: {
    gridColumn: 'span 12',
    [`@media (min-width: ${theme.breakpoints.lg})`]: {
      gridColumn: 'span 6',
    },
  },
}));

export const PersonalDashboard = ({ user }: {
  // TODO: change once PersonalFriends is implemented
  user: FragmentType<typeof PersonalProfileFragment>;
}) => {
  const { classes } = useStyles();
  return (
    <Box className={classes.gridBox} p="md">
      <Box className={classes.headerPanel}>
        <Title order={1} mx="md">
          Home
        </Title>
      </Box>
      <Stack className={classes.profilePanel}>
        <PersonalProfile user={user} />
      </Stack>
      <Box className={classes.friendsPanel}>
        <PersonalFriends user={user} />
      </Box>
    </Box>
  );
};
