import { FC } from 'react';
import { Box, createStyles, Stack, Title } from '@mantine/core';
import { UserDecksSummary } from './UserDecksSummary';
import { RoomNotifications } from './RoomNotifications';
import { DashboardStats } from './DashboardStats';
import { FriendActivity } from './FriendActivity';

const useStyles = createStyles((theme, _params, getRef) => ({
  gridBox: {
    display: 'grid',
    gridTemplateColumns: 'repeat(12, 1fr)',
    maxWidth: `${theme.breakpoints.lg}px`,
    margin: 'auto',
    gap: `${theme.spacing.md}px`,
  },
  headerPanel: {
    gridColumn: 'span 12',
  },
  activityPanel: {
    gridColumn: 'span 12',
  },
  statsPanel: {
    gridColumn: 'span 8',
    [`@media (max-width: ${theme.breakpoints.lg}px)`]: {
      gridColumn: 'span 12',
    },
  },
  friendActivityPanel: {
    gridColumn: 'span 8',
    [`@media (max-width: ${theme.breakpoints.lg}px)`]: {
      gridColumn: 'span 12',
    },
  },
  decksPanel: {
    gridColumn: 'span 4',
    [`@media (max-width: ${theme.breakpoints.lg}px)`]: {
      gridColumn: 'span 12',
    },
  },
}));

export const Dashboard: FC = () => {
  const { classes } = useStyles();
  return (
    <Box className={classes.gridBox} p="md">
      <Box className={classes.headerPanel}>
        <Title order={1} mx="md">
          Home
        </Title>
      </Box>
      <RoomNotifications
        wrapper={({ children }) => <Box className={classes.activityPanel}>{children}</Box>}
      />
      <Stack className={classes.statsPanel}>
        <Box>
          <DashboardStats />
        </Box>
      </Stack>
      <Box className={classes.decksPanel}>
        <UserDecksSummary />
      </Box>
    </Box>
  );
};
