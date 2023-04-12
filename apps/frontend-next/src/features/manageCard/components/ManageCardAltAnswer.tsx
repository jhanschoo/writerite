import { Button } from '@mantine/core';

import { IconX } from '@tabler/icons-react';

interface Props {
  answer: string;
  editable: boolean;
  onRemove: () => void;
  onStartEditing: () => void;
}

export const ManageCardAltAnswer = ({ answer, editable, onRemove, onStartEditing }: Props) => {
  if (editable) {
    return (
      <Button.Group>
        <Button variant="default" compact onClick={onStartEditing}>
          {answer}
        </Button>
        <Button variant="default" compact onClick={onRemove}>
          <IconX size={18} />
        </Button>
      </Button.Group>
    );
  }
  return (
    <Button variant="default" compact>
      {answer}
    </Button>
  );
};
