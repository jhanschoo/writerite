import { FC, useState } from 'react';
import { Button, Divider, Stack, Text } from '@mantine/core';
import { Dropzone, MIME_TYPES } from '@mantine/dropzone';

import type { NewCardData } from '../types';
import { ArrowLeftIcon } from '@radix-ui/react-icons';
import { useParseCsv } from '../hooks/useParseCsv';

const MAX_SIZE_MIB = 3;

interface Props {
  onPreviousStep: () => unknown;
  onSuccessfulImport: (cards: NewCardData[]) => unknown;
}

export const ManageDeckCardsUploadImport: FC<Props> = ({ onPreviousStep, onSuccessfulImport }) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [hasErrors, setHasErrors] = useState<boolean>(false);
  const parseCsv = useParseCsv();
  const handleDrop = async (files: File[]) => {
    if (files.length !== 1) {
      return;
    }
    const [ csvFile ] = files;
    setLoading(true);
    try {
      const newCards = await parseCsv(csvFile);
      onSuccessfulImport(newCards);
      setHasErrors(false);
      setLoading(false);
    } catch (e) {
      setHasErrors(true);
      setLoading(false);
    }
  };
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
        * when accept is defined, for Chrome on GTK 4 (?), when useFsAccessApi={true}.
        * 
        * In more detail,
        * the showOpenFilePicker method in the File System Access API available
        * on Blink-based browsers allows for an optional `description` field
        * when restricting accepted types, and the GTK file picker errors out
        * when this field is undefined or an empty string (at least).
        * Next, the underlying library `react-dropzone` on browsers supporting
        * the File System Access API uses it unless a flag is set, and uses
        * it in such a way that does not expose a way to set the `description`
        * property. That is unless we have set `useFsAccessApi` to false to use
        * another method of uploading files.
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
        useFsAccessApi={false}
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
              There were errors importing the file. Please check and try again.
            </Text>
          )}
        </Stack>
      </Dropzone>
      <Button sx={{ alignSelf: "flex-start" }} variant="subtle" onClick={onPreviousStep} leftIcon={<ArrowLeftIcon />}>
        Back to instructions
      </Button>
    </Stack>
  );
};
