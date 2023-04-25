import { JSONObject } from '@/utils';
import Placeholder from '@tiptap/extension-placeholder';
import { Editor, useEditor } from '@tiptap/react';

import { DEFAULT_EDITOR_PROPS } from './common';

export interface UseEditorProps {
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
  content,
  setContent,
  placeholder,
}: UseEditorProps): [Editor | null, (content: JSONObject | null) => void] => {
  const editor = useEditor({
    ...DEFAULT_EDITOR_PROPS,
    extensions: [
      ...(DEFAULT_EDITOR_PROPS.extensions || []),
      Placeholder.configure({ placeholder }),
    ],
    content,
    onUpdate({ editor: currentEditor }) {
      const updatedJsonContent = currentEditor.getJSON();
      setContent(updatedJsonContent);
    },
  });
  return [
    editor,
    (newContent: JSONObject | null) => editor?.commands.setContent(newContent),
  ];
};
