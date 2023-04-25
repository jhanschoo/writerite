import { JSONObject } from '@/utils';
import { Editor, useEditor } from '@tiptap/react';

import { useEffect } from 'react';
import { DEFAULT_EDITOR_PROPS } from './common';

export const useContentViewer = (
  content: JSONObject | null
): Editor | null => {
  const viewer = useEditor({
    ...DEFAULT_EDITOR_PROPS,
    editable: false,
    extensions: [...(DEFAULT_EDITOR_PROPS.extensions || [])],
    content,
  });
  useEffect(() => {
    viewer?.commands.setContent(content);
  }, [content, viewer]);
  return viewer;
};
