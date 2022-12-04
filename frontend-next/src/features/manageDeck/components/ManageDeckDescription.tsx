import { DeckEditDocument } from '@generated/graphql';
import { FC, useEffect, useState } from 'react';
import { useMutation } from 'urql';
import { Box, LoadingOverlay, Text } from '@mantine/core';
import { ManageDeckProps } from '../types/ManageDeckProps';
import { DEFAULT_EDITOR_PROPS, RichTextEditor } from '@/components/RichTextEditor';
import type { Editor } from '@tiptap/core';
import Placeholder from '@tiptap/extension-placeholder';
import { DebouncedState, useDebouncedCallback } from 'use-debounce';
import { STANDARD_DEBOUNCE_MS, STANDARD_MAX_WAIT_DEBOUNCE_MS } from '@/utils';
import stringify from 'fast-json-stable-stringify';

function debounceIfDeltaExists(
  debounced: DebouncedState<(nextSContent: Record<string, unknown>) => unknown>,
  initialState: Record<string, unknown>,
  latestState: Record<string, unknown>
) {
  if (stringify(initialState) !== stringify(latestState)) {
    debounced(latestState);
  } else {
    debounced.cancel();
  }
}

export const ManageDeckDescription: FC<ManageDeckProps> = ({ deck: { id, description } }) => {
  const [{ fetching }, mutateDeck] = useMutation(DeckEditDocument);
  const content = Object.keys(description).length ? description : undefined;
  const [jsonContent, setJsonContent] = useState(content);
  const updateStateToServer = (jsonContent: Record<string, unknown>) => {
    return mutateDeck({ id, description: jsonContent });
  };
  const debounced = useDebouncedCallback(updateStateToServer, STANDARD_DEBOUNCE_MS, {
    maxWait: STANDARD_MAX_WAIT_DEBOUNCE_MS,
  });
  useEffect(
    () => () => {
      debounced.flush();
    },
    [debounced]
  );
  const hasUnsavedChanges = fetching || debounced.isPending();
  return (
    <Box
      sx={({ spacing: { md } }) => ({
        width: `100%`,
        position: 'relative',
      })}
    >
      <RichTextEditor
        editorProps={{
          ...DEFAULT_EDITOR_PROPS,
          extensions: [
            ...(DEFAULT_EDITOR_PROPS.extensions || []),
            Placeholder.configure({ placeholder: 'Write a description...' }),
          ],
          content,
          onUpdate({ editor }) {
            const updatedJsonContent = editor.getJSON();
            setJsonContent(updatedJsonContent);
            debounceIfDeltaExists(debounced, description, updatedJsonContent);
          },
        }}
      />
    </Box>
  );
};
