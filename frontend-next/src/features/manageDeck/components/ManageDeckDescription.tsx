import { DeckEditDocument } from '@generated/graphql';
import type Editor from 'react-quill';
import { FC, KeyboardEvent, useRef, useState } from 'react';
import { useMutation } from 'urql';
import { RichTextEditorProps } from '@mantine/rte';
import { Box, LoadingOverlay, Text } from '@mantine/core';
import { useHover } from '@mantine/hooks';
import { ManageDeckProps } from '../types/ManageDeckProps';
import RichTextEditor from '@/components/RichTextEditor';

export const ManageDeckDescription: FC<ManageDeckProps> = ({ deck: { id, description } }) => {
  const [{ fetching }, mutateDeck] = useMutation(DeckEditDocument);
  const [writableMode, setWritableMode] = useState(false);
  const [htmlValue, setHtmlValue] = useState<RichTextEditorProps['value']>(description);
  const editorRef = useRef<Editor>(null);
  const { hovered, ref } = useHover();
  const handleBlur = async () => {
    if (!writableMode || hovered) {
      return;
    }
    const reactQuill = editorRef.current;
    if (!reactQuill) {
      return;
    }
    const unprivilegedEditor = reactQuill.makeUnprivilegedEditor(reactQuill.getEditor());
    const delta = unprivilegedEditor.getContents();
    await mutateDeck({ id, description: delta });
    setWritableMode(false);
  };
  return (
    <Box
      sx={({ spacing: { md } }) => ({
        margin: `0 -${md}px`,
        width: `calc(100% + ${md * 2}px)`,
        position: 'relative',
      })}
      ref={ref}
    >
      <LoadingOverlay visible={fetching} />
      <RichTextEditor
        styles={writableMode
        ? {
          root: {
            width: '100%',
          },
        }
        : ({ fn }) => {
          const { background, hover, border, color } = fn.variant({ variant: 'subtle' });
          return {
            root: {
              backgroundColor: background,
              borderColor: border,
              width: '100%',
              color,
              ...fn.hover({
                backgroundColor: hover,
              }),
            },
          };
        }}
        value={htmlValue}
        forwardedRef={editorRef}
        onChange={setHtmlValue}
        onClick={() => setWritableMode(true)}
        readOnly={!writableMode}
        onBlur={handleBlur}
        onKeyDown={(e: KeyboardEvent<unknown>) =>
          (e.key === 'Escape') && setWritableMode(false)
        }
        placeholder="Enter a description for the deck..."
      />
      {writableMode && <Text color="dimmed" size="xs" sx={{ marginTop: '7px', padding: '0 8px' }}>Press &lsquo;esc&rsquo; to save changes and stop editing</Text>}
    </Box>
  );

  // const [{ fetching }, mutateDeck] = useMutation(DeckEditDocument);
  // // TODO: implement https://github.com/vercel/next.js/issues/2476#issuecomment-563190607 to prevent leaving if unsaved data present
  // const [editorState, setEditorState] = useState(notesEditorStateFromRaw(description));
  // const debouncedSaveEditorState = useDebouncedCallback((editorState) => {
  //   mutateDeck({ id, description: notesEditorStateToRaw(editorState) });
  // }, STANDARD_DEBOUNCE_MS, { maxWait: STANDARD_MAX_WAIT_DEBOUNCE_MS });
  // const setAndSaveEditorState = (newEditorState: EditorState) => {
  //   setEditorState(newEditorState);
  //   debouncedSaveEditorState(editorState);
  // };
  // return <NotesEditor
  //   editorState={editorState}
  //   setEditorState={setAndSaveEditorState}
  //   placeholder="Write a description..."
  //   spinner={debouncedSaveEditorState.isPending() || fetching}
  // />;
};
