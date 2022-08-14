import Papa from 'papaparse';
import { FC, useState } from 'react';
import Delta from 'quill-delta';
import { Delta as DeltaType } from 'quill';
import { Button, Divider, Stack, Text } from '@mantine/core';
import { Dropzone, MIME_TYPES } from '@mantine/dropzone';

import { ManageDeckProps, NewCardData } from '../types';
import { nextTick, NEXT_PUBLIC_MAX_CARDS_PER_DECK } from '@/utils';
import { ArrowLeftIcon } from '@radix-ui/react-icons';

const MAX_SIZE_MIB = 3;

interface Props {
  onPreviousStep: () => unknown;
  onSuccessfulImport: (cards: NewCardData[]) => unknown;
}

export const ManageDeckCardsUploadImport: FC<Props> = ({ onPreviousStep, onSuccessfulImport }) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [cards, setCards] = useState<null | NewCardData[]>(null)
  const [hasErrors, setHasErrors] = useState<boolean>(false);
  const handleDrop = async (files: File[]) => {
    if (files.length !== 1) {
      return;
    }
    const [ csvFile ] = files;
    setLoading(true);
    await nextTick(async () => {
      try {
        const newCards = await new Promise<NewCardData[]>((resolve, reject) => {
          let newCards: NewCardData[] = [];
          Papa.parse<string[], File>(csvFile, {
            skipEmptyLines: "greedy",
            chunk: (results, parser) => {
              if (results.errors.length > 0) {
                reject(results.errors);
                parser.abort();
              }
              newCards = newCards.concat(results.data.map(([prompt, fullAnswer, ...answers]) => ({
                prompt: new Delta().insert(prompt ?? "") as unknown as DeltaType,
                fullAnswer: new Delta().insert(fullAnswer ?? "") as unknown as DeltaType,
                answers: answers.filter((answer) => answer.trim())
              })));
              if (newCards.length > NEXT_PUBLIC_MAX_CARDS_PER_DECK) {
                parser.abort();
              } else {
                parser.resume();
              }
            },
            complete: () => resolve(newCards),
            error: (e) => reject(e),
          });
        });
        // invariant: NEXT_PUBLIC_MAX_CARDS_PER_DECK < newCards.length exactly when csv has more cards to import than NEXT_PUBLIC_MAX_CARDS_PER_DECK
        onSuccessfulImport(newCards);
        setHasErrors(false);
        setLoading(false);
      } catch (e) {
        setHasErrors(true);
        setLoading(false);
      }
    });
  };
  if (cards) {
    return null;
  } else {
    return (
      <Stack>
        <Dropzone
          onDrop={handleDrop}
          onReject={(files) => console.log('rejected files', files)}
          maxSize={MAX_SIZE_MIB * 1024 ** 2}
          multiple={false}
          loading={loading}
          /*
          * Note that there is a file chooser error (automatically cancels and exits)
          * when accept is defined, for Chrome on GTK 4 (?).
          * 
          * In more detail,
          * the showOpenFilePicker method in the File System Access API available
          * on Blink-based browsers allows for an optional `description` field
          * when restricting accepted types, and the GTK file picker errors out
          * when this field is undefined or an empty string (at least).
          * Next, the underlying library `react-dropzone` on browsers supporting
          * the File System Access API uses it unless a flag is set, and uses
          * it in such a way that does not expose a way to set the `description`
          * property. Finally, `@mantine/dropzone` does not expose a way to
          * set the flag (it is the `useFsAccessApi` flag). As such, there is
          * no workaround for this bug as long as we use `@mantine/dropzone`,
          * and not the underlying library `react-dropzone` directly nor
          * using `<input type="file" />` or the File System Access API directly.
          */
          // A bug report has been submitted to the Chromium project:
          // https://bugs.chromium.org/p/chromium/issues/detail?id=1350487
          accept={{[MIME_TYPES.csv]: ['.csv']}}
          sx={{
            minHeight: '50vh',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            textAlign: 'center',
          }}
        >
          <Stack spacing="md" align="center">
            <Text size="lg">
              Drag a .csv file here
            </Text>
            <Divider label="or" sx={{ alignSelf: "stretch" }} labelPosition="center" />
            <Button>Select file</Button>
            <Text color="dimmed" size="xs">
              Maximum file size limit: {MAX_SIZE_MIB}MB
            </Text>
            {hasErrors && (
              <Text color="red" size="xs">
                There were errors importing the previous file. Please check and try again.
              </Text>
            )}
          </Stack>
        </Dropzone>
        <Button sx={{ alignSelf: "flex-start" }} variant="subtle" onClick={onPreviousStep} leftIcon={<ArrowLeftIcon />}>
          Review instructions
        </Button>
      </Stack>
    );
  }
};
