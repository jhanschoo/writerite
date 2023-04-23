import { RichTextEditor, RichTextEditorProps } from '@mantine/tiptap';

export const BareRichTextEditor = ({
  editor,
}: Pick<RichTextEditorProps, 'editor'>) => {
  return (
    <RichTextEditor editor={editor}>
      <RichTextEditor.Content />
    </RichTextEditor>
  );
};
