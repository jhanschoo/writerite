import type { RichTextEditorProps } from '@mantine/rte';
import dynamic from 'next/dynamic';
import type { Ref } from 'react';

export default dynamic(async () => {
  const { default: Editor } = await import('@mantine/rte');
  return (
    { forwardedRef, ...props }:
      RichTextEditorProps
      & { forwardedRef?: Ref<any> }
  ) => <Editor ref={forwardedRef} {...props} />;
}, {
  // Disable during server side rendering
  ssr: false,

  // Render anything as fallback on server, e.g. loader or html content without editor
  loading: () => null,
});
