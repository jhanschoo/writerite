import { Button, Flex, Stack, Title } from '@mantine/core';
import { DeckName } from '@/components/deck';
import { ManageDeckProps } from '../types/ManageDeckProps';

export interface ManageDeckFrontMatterContentProps {
  name: ManageDeckProps['deck']['name'];
  handleEdit?: () => void;
  descriptionElement: JSX.Element;
}

export const ManageDeckFrontMatterContent = ({
  name,
  descriptionElement,
  handleEdit,
}: ManageDeckFrontMatterContentProps) => {
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
