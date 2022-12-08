import { JSONContent } from '@tiptap/core';

export interface NewCardData {
  prompt: JSONContent;
  fullAnswer: JSONContent;
  answers: string[];
}
