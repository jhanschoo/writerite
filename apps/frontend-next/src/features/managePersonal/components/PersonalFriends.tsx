import { Box, Card, Title } from '@mantine/core';

export const PersonalFriends = ({ user }: { user: object }) => {
  return (
    <Card shadow="xl" radius="lg" p="md">
      <Title order={2} mb="md">
        Friends
      </Title>
      <Card.Section inheritPadding>Hello</Card.Section>
    </Card>
  );
};
