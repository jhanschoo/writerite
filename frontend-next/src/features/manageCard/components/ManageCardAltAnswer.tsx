import { FC } from 'react';
import { Button } from '@mantine/core';

import { IconX } from '@tabler/icons';

interface Props {
  answer: string;
  editable: boolean;
  onRemove: () => void;
  onStartEditing: () => void;
}

export const ManageCardAltAnswer: FC<Props> = ({ answer, editable, onRemove, onStartEditing }) => {
  if (editable) {
    return (
      <Button.Group>
        <Button variant="default" compact onClick={onStartEditing}>{answer}</Button>
        <Button variant="default" compact onClick={onRemove}>
          <IconX size={18} />
        </Button>
      </Button.Group>
    );
  }
  return (
    <Button variant="default" compact>{answer}</Button>
  );
};
