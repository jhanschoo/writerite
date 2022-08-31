import { FC } from 'react';
import { ActionIcon, Badge, Group } from '@mantine/core';

import { Cross2Icon, Pencil1Icon } from '@radix-ui/react-icons';

interface Props {
  answer: string;
  editable: boolean;
  onRemove: () => void;
  onStartEditing: () => void;
}

export const ManageCardAltAnswer: FC<Props> = ({ answer, editable, onRemove, onStartEditing }) => {
  return (
    <Badge variant="light" sx={{ textTransform: "none" }} rightSection={
      <Group spacing={0}>
        {
          editable && 
          <ActionIcon size="xs" variant="transparent" onClick={onStartEditing}>
            <Pencil1Icon />
          </ActionIcon>
        }
        <ActionIcon size="xs" variant="transparent" onClick={onRemove}>
          <Cross2Icon />
        </ActionIcon>
      </Group>}>{answer}
    </Badge>
  );
};
