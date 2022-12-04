import { FC } from 'react';
import { Box, createStyles, Paper, Stack, Text, Title } from '@mantine/core';
import { UserDecksSummary } from './UserDecksSummary';
import { RoomNotifications } from './RoomNotifications';
import { DashboardStats } from './DashboardStats';

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
  roomNotificationsPanel: {
    gridColumn: 'span 12',
  },
  statsPanel: {
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
        wrapper={({ children, key }) => (
          <Box className={classes.roomNotificationsPanel} key={key}>
            {children}
          </Box>
        )}
      />
      <Box className={classes.statsPanel}>
        <DashboardStats />
      </Box>
      <Box className={classes.decksPanel}>
        <UserDecksSummary />
      </Box>
    </Box>
  );
};

// <Stack p="md">
//   <UserRoomsSummary />
// </Stack>
