import { Link } from '@mantine/tiptap';
import { EditorOptions } from "@tiptap/core";
import Underline from "@tiptap/extension-underline";
import StarterKit from "@tiptap/starter-kit";


export const DEFAULT_EDITOR_PROPS: Partial<EditorOptions> = {
  extensions: [StarterKit, Underline, Link],
};
