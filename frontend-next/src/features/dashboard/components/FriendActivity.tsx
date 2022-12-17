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

export const FriendActivity: FC<{}> = ({}) => {
  const { classes } = useStyles();
  return (
    <Paper radius="lg" p="lg">
      <Text ta="center" className={classes.emptyStatsText} color="dimmed">
        Here is where I'd show friend activity if I'd built this feature.
      </Text>
    </Paper>
  );
};
