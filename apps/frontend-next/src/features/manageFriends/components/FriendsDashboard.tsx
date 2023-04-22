import { Card, Center, createStyles, Stack, Title } from "@mantine/core";

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
        <Card shadow="xl" radius="lg" p="md">
          <Title order={2} mb="md">
            Friends
          </Title>
          <Card.Section inheritPadding>Hello</Card.Section>
        </Card>
      </Stack>
    </Center>
  );
};
