import { Button, Flex, Stack, Title } from '@mantine/core';

import { DeckName } from '@/components/deck';

export interface Props {
  name?: string;
  handleEdit?: () => void;
  descriptionElement: JSX.Element;
}

export const ManageDeckFrontMatterContent = ({
  name,
  descriptionElement,
  handleEdit,
}: Props) => {
  return (
    <Stack>
      <Flex justify="space-between">
        <Title order={1}>
          <DeckName name={name} />
        </Title>
        {handleEdit && (
          <Button variant="outline" radius="xl" onClick={handleEdit}>
            Edit Deck Info
          </Button>
        )}
      </Flex>
      {descriptionElement}
    </Stack>
  );
};
