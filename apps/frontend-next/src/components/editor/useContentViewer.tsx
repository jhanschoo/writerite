import { JSONObject } from '@/utils';
import { Editor } from '@tiptap/core';
import { EditorContent, useEditor } from '@tiptap/react';
import { DEFAULT_EDITOR_PROPS } from './common';

export const useContentViewer = (content: JSONObject | null): [JSX.Element, Editor | null] => {
  const viewer = useEditor({
    ...DEFAULT_EDITOR_PROPS,
    editable: false,
    extensions: [...(DEFAULT_EDITOR_PROPS.extensions || [])],
    content,
  });
  viewer?.commands.setContent(content);
  return [<EditorContent editor={viewer} />, viewer];
};
