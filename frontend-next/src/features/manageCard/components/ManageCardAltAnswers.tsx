import { FC, useState } from 'react';
import { ActionIcon, Group, Paper, Stack, Text } from '@mantine/core';

import { ManageDeckProps } from '../../manageDeck/types/ManageDeckProps';
import { PlusIcon } from '@radix-ui/react-icons';
import { ManageCardAltAnswerInput } from './ManageCardAltAnswerInput';
import { ManageCardAltAnswer } from './ManageCardAltAnswer';

interface Props {
  answers: ManageDeckProps["deck"]["cardsDirect"][number]["answers"];
  onAnswersSave: (answers: string[]) => void;
}

export const ManageCardAltAnswers: FC<Props> = ({ answers, onAnswersSave }) => {

  const [currentlyEditing, setCurrentlyEditing] = useState<number | null>(null);
  const existsCurrentlyEditing = currentlyEditing !== null;
  const handleCancel = () => setCurrentlyEditing(null);
  const handleSave = (index: number) => (answer: string) => {
    const latestAnswers = Array.from(answers);
    setCurrentlyEditing(null);
    latestAnswers[index] = answer;
    onAnswersSave(latestAnswers);
  };
  return (
    <Stack spacing={0} sx={{ flexGrow: 1 }}>
      <Text size="xs" weight="bold">Accepted answers</Text>
      <Group spacing="xs" py="xs">
        {answers.map((answer, index) => {
          if (index === currentlyEditing) {
            return <ManageCardAltAnswerInput
              key={index} 
              initialAnswer={answer}
              onCancel={handleCancel}
              onSave={handleSave(index)}
            />;
          }
          return <ManageCardAltAnswer
            key={index}
            answer={answer}
            onRemove={() => {
              const latestAnswers = Array.from(answers)
              latestAnswers.splice(index, 1)
              onAnswersSave(latestAnswers)
            }}
            editable={!existsCurrentlyEditing}
            onStartEditing={() => setCurrentlyEditing(index)}
          />
        })}
        {
          // Button to add a new answer
          currentlyEditing === null && (
          <Paper
            withBorder px="8px" py="3px"
            onClick={() => setCurrentlyEditing(answers.length)}
          >
            <ActionIcon size="sm" variant="transparent"><PlusIcon /></ActionIcon>
          </Paper>
        )}
        {
          // Component if editing a new answer
          currentlyEditing === answers.length &&
          <ManageCardAltAnswerInput
            initialAnswer={""}
            onCancel={handleCancel}
            onSave={handleSave(answers.length)}
          />
        }
      </Group>
      {currentlyEditing && <Text size="xs" color="dimmed">Press 'Esc' to cancel edits, or 'Return' to confirm edits.</Text>}
    </Stack>
  );
};
