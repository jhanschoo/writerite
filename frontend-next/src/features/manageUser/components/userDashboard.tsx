import { Box, createStyles, Stack, Title } from '@mantine/core';
import { FC } from 'react';
import { Profile } from './Profile';

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
  profilePanel: {
    gridColumn: 'span 12',
    [`@media (min-width: ${theme.breakpoints.lg}px)`]: {
      gridColumn: 'span 6',
    },
  },
  friendsPanel: {
    gridColumn: 'span 12',
    [`@media (min-width: ${theme.breakpoints.lg}px)`]: {
      gridColumn: 'span 6',
    },
  },
}));

export const UserDashboard: FC = () => {
  const { classes } = useStyles();
  return (
    <Box className={classes.gridBox} p="md">
      <Box className={classes.headerPanel}>
        <Title order={1} mx="md">
          Home
        </Title>
      </Box>
      <Stack className={classes.profilePanel}>
        <Box>
          <Profile />
        </Box>
      </Stack>
      <Box className={classes.friendsPanel}>Friends panel</Box>
    </Box>
  );
};
