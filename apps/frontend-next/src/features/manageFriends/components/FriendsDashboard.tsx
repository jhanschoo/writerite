import { Card, Center, createStyles, Stack, Title } from "@mantine/core";
import { Befriend } from "./Befriend";
import { FriendsList } from "./FriendsList";

const useStyles = createStyles(({ breakpoints }) => ({
  root: {
    width: "100%",
    maxWidth: breakpoints.lg,
  },
}));

export const FriendsDashboard = () => {
  const { classes } = useStyles();
  return (
    <Center>
      <Stack p="md" className={classes.root}>
        <Title order={2}>
          Friends
        </Title>
        <Card shadow="md" radius="lg" p="md">
          <Befriend />
        </Card>
        <FriendsList />
      </Stack>
    </Center>
  );
};
