import Papa from 'papaparse';
import { nextTick, NEXT_PUBLIC_MAX_CARDS_PER_DECK } from '@/utils';
import type { NewCardData } from '../types';
import { JSONContent } from '@tiptap/core';

const textToJsonContent = (textContent: string): JSONContent => {
  const lines = textContent
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => Boolean(line));
  const content = lines.map((text) => ({
    type: 'paragraph',
    content: [{ text, type: 'text' }],
  }));
  return {
    type: 'doc',
    content: content.length ? content : undefined,
  };
};

// TODO: revise to output
export const useParseCsv = () => async (file: File) =>
  nextTick(
    async () =>
      new Promise<NewCardData[]>((resolve, reject) => {
        let newCards: NewCardData[] = [];
        Papa.parse<string[], File>(file, {
          skipEmptyLines: 'greedy',
          chunk: (results, parser) => {
            if (results.errors.length > 0) {
              reject(results.errors);
              parser.abort();
            }
            newCards = newCards.concat(
              results.data.map(([prompt, fullAnswer, ...answers]) => ({
                prompt: textToJsonContent(prompt),
                fullAnswer: textToJsonContent(fullAnswer),
                answers: answers.filter((answer) => answer.trim()),
              }))
            );
            if (newCards.length > NEXT_PUBLIC_MAX_CARDS_PER_DECK) {
              parser.abort();
            } else {
              parser.resume();
            }
          },
          complete: () => resolve(newCards),
          error: (e) => reject(e),
        });
      })
  );
