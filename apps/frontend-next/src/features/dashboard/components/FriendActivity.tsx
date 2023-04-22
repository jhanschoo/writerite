import { Box, Button, createStyles, Paper, Text, Title } from "@mantine/core";
import { IconHeartHandshake } from "@tabler/icons-react";

const useStyles = createStyles((theme) => ({
  header: {
    display: "flex",
    justifyContent: "space-between",
  },
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

export const FriendActivity = () => {
  const { classes } = useStyles();
  return (
    <Paper radius="lg" p="md">
      <Box className={classes.header}>
        <Title order={2} size="h3">
          Currently Active
        </Title>
        <Button
          variant="outline"
          radius="xl"
          leftIcon={<IconHeartHandshake size={21} />}
        >
          Friends
        </Button>
      </Box>
      <Text ta="center" className={classes.emptyStatsText} color="dimmed">
        Here is where I'd show friend activity if I'd built this feature.
      </Text>
    </Paper>
  );
};
