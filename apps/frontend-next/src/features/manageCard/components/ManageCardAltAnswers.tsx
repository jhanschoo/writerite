import { useState } from 'react';
import { Button, Flex, Stack, Text } from '@mantine/core';

import { ManageDeckProps } from '../../manageDeck/types/ManageDeckProps';
import { ManageCardAltAnswerInput } from './ManageCardAltAnswerInput';
import { ManageCardAltAnswer } from './ManageCardAltAnswer';
import { IconPlus } from '@tabler/icons-react';

interface Props {
  answers: ManageDeckProps['deck']['cardsDirect'][number]['answers'];
  onAnswersSave: (answers: string[]) => void;
}

export const ManageCardAltAnswers = ({ answers, onAnswersSave }: Props) => {
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
      <Flex gap="xs" py="xs" align="center" wrap="wrap">
        <Text size="xs" weight="bold">
          Accepted answers
        </Text>
        {answers.map((answer, index) => {
          if (index === currentlyEditing) {
            return (
              <ManageCardAltAnswerInput
                key={index}
                initialAnswer={answer}
                onCancel={handleCancel}
                onSave={handleSave(index)}
              />
            );
          }
          return (
            <ManageCardAltAnswer
              key={index}
              answer={answer}
              onRemove={() => {
                const latestAnswers = Array.from(answers);
                latestAnswers.splice(index, 1);
                onAnswersSave(latestAnswers);
              }}
              editable={!existsCurrentlyEditing}
              onStartEditing={() => setCurrentlyEditing(index)}
            />
          );
        })}
        {
          // Button to add a new answer
          currentlyEditing === null && (
            <Button compact onClick={() => setCurrentlyEditing(answers.length)} variant="default">
              <IconPlus size={18} />
            </Button>
          )
        }
        {
          // Component if editing a new answer
          currentlyEditing === answers.length ? (
            <ManageCardAltAnswerInput
              initialAnswer={''}
              onCancel={handleCancel}
              onSave={handleSave(answers.length)}
            />
          ) : undefined
        }
      </Flex>
      {currentlyEditing !== null ? (
        <Text size="xs" color="dimmed">
          Press 'Esc' to cancel edits, or 'Return' to confirm edits.
        </Text>
      ) : undefined}
    </Stack>
  );
};
