import { DeckEditDocument } from '@generated/graphql';
import { FC, useEffect } from 'react';
import { useMutation } from 'urql';
import { Box } from '@mantine/core';
import { ManageDeckProps } from '../types/ManageDeckProps';
import { DEFAULT_EDITOR_PROPS, ToolbaredRichTextEditor } from '@/components/RichTextEditor';
import { JSONContent, useEditor } from '@tiptap/react';
import Placeholder from '@tiptap/extension-placeholder';
import { DebouncedState, useDebouncedCallback } from 'use-debounce';
import { STANDARD_DEBOUNCE_MS, STANDARD_MAX_WAIT_DEBOUNCE_MS } from '@/utils';
import stringify from 'fast-json-stable-stringify';

function debounceIfDeltaExists(
  debounced: DebouncedState<(nextSContent: JSONContent) => unknown>,
  initialState: JSONContent | null,
  latestState: JSONContent
) {
  if (stringify(initialState) !== stringify(latestState)) {
    debounced(latestState);
  } else {
    debounced.cancel();
  }
}

export const ManageDeckDescription: FC<ManageDeckProps> = ({ deck: { id, description } }) => {
  const [{ fetching }, mutateDeck] = useMutation(DeckEditDocument);
  const content = description ?? null;
  const updateStateToServer = (jsonContent: JSONContent) => {
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
  const editor = useEditor({
    ...DEFAULT_EDITOR_PROPS,
    extensions: [
      ...(DEFAULT_EDITOR_PROPS.extensions || []),
      Placeholder.configure({ placeholder: 'Write a description...' }),
    ],
    content,
    onUpdate({ editor }) {
      const updatedJsonContent = editor.getJSON();
      debounceIfDeltaExists(debounced, content, updatedJsonContent);
    },
  });
  return (
    <Box
      sx={({ spacing: { md } }) => ({
        width: `100%`,
        position: 'relative',
      })}
    >
      <ToolbaredRichTextEditor editor={editor} />
    </Box>
  );
};
