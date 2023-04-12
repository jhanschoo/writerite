import { JSONObject } from '@/utils';
import { RichTextEditorProps } from '@mantine/tiptap';
import Placeholder from '@tiptap/extension-placeholder';
import { useEditor } from '@tiptap/react';
import { DEFAULT_EDITOR_PROPS } from './common';

export interface UseEditorProps {
  editorComponent: (props: Pick<RichTextEditorProps, 'editor'>) => JSX.Element;
  content: JSONObject | null;
  setContent: (content: JSONObject) => void;
  placeholder?: string;
}

/**
 *
 * @param editorComponent the component to use for the editor
 * @param content a field describing the content of the editor and viewer. Field changes not through the editor will not update the editor; to update the editor, use `resetEditorContent`
 * @param setContent a function to set value of the content field passed in
 * @returns [editor, resetEditorContent] where `editor` is the editor component, and `resetEditorContent` is a function to reset the editor content to the value in the viewer, which should be the value of `content`
 */
export const useContentEditor = ({
  editorComponent: EditorComponent,
  content,
  setContent,
  placeholder,
}: UseEditorProps): [JSX.Element, (content: JSONObject | null) => void] => {
  const editor = useEditor({
    ...DEFAULT_EDITOR_PROPS,
    extensions: [
      ...(DEFAULT_EDITOR_PROPS.extensions || []),
      Placeholder.configure({ placeholder }),
    ],
    content,
    onUpdate({ editor }) {
      const updatedJsonContent = editor.getJSON();
      setContent(updatedJsonContent);
    },
  });
  return [
    <EditorComponent editor={editor} />,
    (content: JSONObject | null) => editor?.commands.setContent(content),
  ];
};
