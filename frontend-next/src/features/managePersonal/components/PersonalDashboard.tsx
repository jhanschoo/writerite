import { Box, createStyles, Stack, Title } from '@mantine/core';
import { ManagePersonalProps } from '../types/ManagePersonalProps';
import { Profile } from './Profile';

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

export const PersonalDashboard = ({ user }: ManagePersonalProps) => {
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
          <Profile user={user} />
        </Box>
      </Stack>
      <Box className={classes.friendsPanel}>Friends panel</Box>
    </Box>
  );
};
