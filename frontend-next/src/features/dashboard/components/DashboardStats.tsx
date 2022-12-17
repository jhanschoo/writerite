import { createStyles, Paper, Text } from '@mantine/core';
import { FC } from 'react';

const useStyles = createStyles((theme) => ({
  emptyStatsText: {
    fontSize: theme.fontSizes.xl,
    [`@media (min-width: ${theme.breakpoints.sm}px)`]: {
      fontSize: theme.fontSizes.xl * 1.5,
    },
    [`@media (min-width: ${theme.breakpoints.md}px)`]: {
      fontSize: theme.fontSizes.xl * 2,
    },
  },
}));

export const DashboardStats: FC<{}> = ({}) => {
  const { classes } = useStyles();
  return (
    <Paper radius="lg" p="lg">
      <Text ta="center" className={classes.emptyStatsText} color="dimmed">
        There are no stats to show.
      </Text>
    </Paper>
  );
};
