import { JSONContent } from '@tiptap/react';

export interface NewCardData {
  prompt: JSONContent;
  fullAnswer: JSONContent;
  answers: string[];
}
