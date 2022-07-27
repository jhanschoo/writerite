import type { RichTextEditorProps } from '@mantine/rte';
import dynamic from 'next/dynamic';
import type { Ref } from 'react';
import type ReactQuill from 'react-quill';

export default dynamic(async () => {
  const { default: Editor } = await import('@mantine/rte');
  return (
    { forwardedRef, ...props }:
      RichTextEditorProps
      & { forwardedRef: Ref<ReactQuill> }
  ) => <Editor ref={forwardedRef} {...props} />;
}, {
  // Disable during server side rendering
  ssr: false,

  // Render anything as fallback on server, e.g. loader or html content without editor
  loading: () => null,
});
