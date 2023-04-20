import { Box, Card, Title } from "@mantine/core";

export const PersonalFriends = ({ user }: { user: object }) => {
  return (
    <Card shadow="xl" radius="lg" p="md">
      <Box>
        <Title order={2} mb="md">
          Friends
        </Title>
      </Box>
    </Card>
  );
};
