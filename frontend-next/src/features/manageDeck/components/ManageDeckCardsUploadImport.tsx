import Papa from 'papaparse';
import { FC, useState } from 'react';
import Delta from 'quill-delta';
import { Button, Divider, Text } from '@mantine/core';
import { Dropzone, IMAGE_MIME_TYPE, MIME_TYPES } from '@mantine/dropzone';

import { ManageDeckProps } from '../types/ManageDeckProps';
import { nextTick } from '@/utils';

const MAX_CARDS_PER_DECK = parseInt(process.env.NEXT_PUBLIC_MAX_CARDS_PER_DECK as string);

enum ImportState {
  EMPTY,
  IMPORTING,
  IMPORTED_NORMAL,
  IMPORTED_EXCEEDED,
  IMPORTED_ERRORS
}

interface ImportCard {
  prompt: Delta,
  fullAnswer: Delta,
  answers: string[],
}

const MAX_SIZE_MIB = 3;

export const ManageDeckCardsUploadImport: FC<ManageDeckProps> = ({ deck }) => {
  const [importState, setImportState] = useState<ImportState>(ImportState.EMPTY);
  const [cards, setCards] = useState<null | ImportCard[]>(null)
  const handleDrop = async (files: File[]) => {
    if (files.length !== 1) {
      return;
    }
    const [ csvFile ] = files;
    setImportState(ImportState.IMPORTING);
    await nextTick(async () => {
      try {
        const { newCards, exceeded } = await new Promise<{ newCards: ImportCard[], exceeded: boolean }>((resolve, reject) => {
          let newCards: ImportCard[] = [];
          let exceeded = false;
          Papa.parse<string[], File>(csvFile, {
            skipEmptyLines: "greedy",
            chunk: (results, parser) => {
              if (results.errors.length > 0) {
                reject(results.errors);
                parser.abort();
              }
              if (results.data.length + newCards.length > MAX_CARDS_PER_DECK) {
                results.data.length = MAX_CARDS_PER_DECK - newCards.length;
                exceeded = true;
              }
              newCards = newCards.concat(results.data.map(([prompt, fullAnswer, ...answers]) => ({
                prompt: new Delta().insert(prompt ?? ""),
                fullAnswer: new Delta().insert(fullAnswer ?? ""),
                answers: answers.filter((answer) => answer.trim())
              })));
              if (exceeded) {
                parser.abort();
              } else {
                parser.resume();
              }
            },
            complete: () => resolve({ newCards, exceeded }),
            error: (e) => reject(e),
          });
        });
        setCards(newCards);
        setImportState(exceeded ? ImportState.IMPORTED_EXCEEDED : ImportState.IMPORTED_NORMAL);
      } catch (e) {
        console.error(e);
        setImportState(ImportState.IMPORTED_ERRORS);
      }
    });
  };
  if (cards) {
    return null;
  } else {
    return (
      <Dropzone
        onDrop={handleDrop}
        onReject={(files) => console.log('rejected files', files)}
        maxSize={MAX_SIZE_MIB * 1024 ** 2}
        multiple={false}
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
          <Text size="lg">
            Drag a .csv file here
          </Text>
          <Divider label="or" labelPosition="center" />
          <Button variant="light">Select file</Button>
          <Text color="dimmed" size="xs" mt="md">
            Maximum file size limit: {MAX_SIZE_MIB}MB
          </Text>
          <Text mt="lg">
            <strong>Click here to learn how you should format your .csv file.</strong>
          </Text>
      </Dropzone>
    );
  }
};
