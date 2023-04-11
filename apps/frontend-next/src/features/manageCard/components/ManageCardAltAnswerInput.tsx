import { useState, KeyboardEvent } from 'react';
import { TextInput } from '@mantine/core';
import { IconCheck } from '@tabler/icons-react';
import { ActionIcon } from '@/components/ActionIcon';

interface Props {
  initialAnswer: string;
  onCancel: () => void;
  onSave: (answer: string) => void; // answer.trim() will be nonzero
}

export const ManageCardAltAnswerInput = ({ initialAnswer, onCancel, onSave }: Props) => {
  const [answerInput, setAnswerInput] = useState(initialAnswer);
  return (
    <TextInput
      value={answerInput}
      onChange={(e) => setAnswerInput(e.currentTarget.value)}
      onKeyDown={(e: KeyboardEvent<unknown>) => {
        switch (e.key) {
          case 'Escape':
            onCancel();
            break;
          case 'Enter': {
            const answerToSave = answerInput.trim();
            if (answerToSave) {
              onSave(answerToSave);
            } else {
              onCancel();
            }
            break;
          }
        }
      }}
      variant="filled"
      aria-label="input new alternate answer"
      rightSection={
        <ActionIcon onClick={() => onSave(answerInput)} title="Save">
          <IconCheck />
        </ActionIcon>
      }
    />
  );
};
