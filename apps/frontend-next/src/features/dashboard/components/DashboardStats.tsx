import { createStyles, Paper, Text } from '@mantine/core';

const useStyles = createStyles((theme) => ({
  emptyStatsText: {
    fontSize: theme.fontSizes.xl,
    [`@media (min-width: ${theme.breakpoints.sm})`]: {
      fontSize: `calc(${theme.fontSizes.xl} * 1.5)`,
    },
    [`@media (min-width: ${theme.breakpoints.md})`]: {
      fontSize: `calc(${theme.fontSizes.xl} * 2)`,
    },
  },
}));

export const DashboardStats = () => {
  const { classes } = useStyles();
  return (
    <Paper radius="lg" p="lg">
      <Text ta="center" className={classes.emptyStatsText} color="dimmed">
        There are no stats to show.
      </Text>
    </Paper>
  );
};
