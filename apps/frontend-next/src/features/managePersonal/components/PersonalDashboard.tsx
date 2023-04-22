import { Box, Button, Center, createStyles, Stack, Title } from "@mantine/core";
import { PersonalFriends } from "./PersonalFriends";
import { PersonalProfile, PersonalProfileFragment } from "./PersonalProfile";
import { FragmentType } from "@generated/gql";

const useStyles = createStyles(({ breakpoints }) => ({
  root: {
    maxWidth: breakpoints.lg,
  },
}));

export const PersonalDashboard = ({
  user,
}: {
  // TODO: change once PersonalFriends is implemented
  user: FragmentType<typeof PersonalProfileFragment>;
}) => {
  const { classes } = useStyles();
  return (
    <Center>
      <Stack p="md" className={classes.root}>
        <Title order={1} mx="md">
          Profile
        </Title>
        <PersonalProfile user={user} />
      </Stack>
    </Center>
  );
};
