import { FC, MouseEvent } from 'react';
import { ActionIcon, Group, Paper, Text } from '@mantine/core';

import { Cross2Icon, Pencil1Icon } from '@radix-ui/react-icons';

interface Props {
  answer: string;
  editable: boolean;
  onRemove: () => void;
  onStartEditing: () => void;
}

export const ManageCardAltAnswer: FC<Props> = ({ answer, editable, onRemove, onStartEditing }) => {
  return (
    <Paper px="xs" py="6px" withBorder onClick={onStartEditing}>
      <Group spacing={1}>
        <Text size="sm">
          {answer}
        </Text>
        {
          editable && 
          <>
            <ActionIcon size="sm" variant="subtle">
              <Pencil1Icon />
            </ActionIcon>
            <ActionIcon size="sm" variant="subtle" onClick={(e: MouseEvent<HTMLButtonElement>) => { e.stopPropagation(); onRemove(); }}>
              <Cross2Icon />
            </ActionIcon>
          </>
        }
      </Group>
    </Paper>
  );
};
