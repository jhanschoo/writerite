import { FC, MouseEvent } from 'react';
import { ActionIcon, Divider, Group, Paper, Text } from '@mantine/core';

import { Cross2Icon, Pencil1Icon } from '@radix-ui/react-icons';

interface Props {
  answer: string;
  editable: boolean;
  onRemove: () => void;
  onStartEditing: () => void;
}

export const ManageCardAltAnswer: FC<Props> = ({ answer, editable, onRemove, onStartEditing }) => {
  return (
    <Paper px="8px" py="3px" withBorder onClick={onStartEditing}>
      <Group spacing={2}>
        <Text size="sm">{answer}</Text>
        {editable && (
          <>
            <ActionIcon size="sm" title="Edit Answer" variant="subtle">
              <Pencil1Icon />
            </ActionIcon>
            <Divider orientation="vertical" />
            <ActionIcon
              size="sm"
              title="Remove Answer"
              variant="subtle"
              onClick={(e: MouseEvent<HTMLButtonElement>) => {
                e.stopPropagation();
                onRemove();
              }}
            >
              <Cross2Icon />
            </ActionIcon>
          </>
        )}
      </Group>
    </Paper>
  );
};
