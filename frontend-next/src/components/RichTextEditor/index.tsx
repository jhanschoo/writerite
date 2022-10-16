import type { RichTextEditorProps } from '@mantine/rte';
import type { ToolbarControl } from '@mantine/rte/lib/components/Toolbar/controls';
import dynamic from 'next/dynamic';
import type { Ref } from 'react';

export const SUPPORTED_RTE_TOOLBAR: ToolbarControl[][] = [
  ['bold', 'italic', 'underline', 'strike', 'link', 'clean'],
  ['h1', 'h2', 'h3', 'h4'],
  ['unorderedList', 'orderedList'],
  ['alignLeft', 'alignCenter', 'alignRight'],
  ['sup', 'sub']
];

export default dynamic(async () => {
  const { default: Editor } = await import('@mantine/rte');
  return (
    { forwardedRef, ...props }:
      RichTextEditorProps
      & { forwardedRef?: Ref<any> }
  ) => <Editor ref={forwardedRef} controls={SUPPORTED_RTE_TOOLBAR} {...props} />;
}, {
  // Disable during server side rendering
  ssr: false,

  // Render anything as fallback on server, e.g. loader or html content without editor
  loading: () => null,
});
