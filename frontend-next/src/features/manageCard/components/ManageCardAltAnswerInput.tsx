import { FC, useState, KeyboardEvent } from 'react';
import { ActionIcon, TextInput, Group } from '@mantine/core';
import { Cross1Icon, PaperPlaneIcon } from '@radix-ui/react-icons';

interface Props {
  initialAnswer: string;
  onCancel: () => void;
  onSave: (answer: string) => void;
}

export const ManageCardAltAnswerInput: FC<Props> = ({ initialAnswer, onCancel, onSave }) => {
  const [answerInput, setAnswerInput] = useState(initialAnswer);
  return (
    <TextInput
      value={answerInput}
      onChange={(e) => setAnswerInput(e.currentTarget.value)}
      onKeyDown={(e: KeyboardEvent<unknown>) => {
        switch (e.key) {
          case 'Escape': onCancel(); break;
          case 'Enter': onSave(answerInput); break;
        }
      }}
      variant="filled"
      aria-label="input new alternate answer"
      rightSection={<ActionIcon onClick={() => onSave(answerInput)}><PaperPlaneIcon /></ActionIcon>}
    />
  );
};
