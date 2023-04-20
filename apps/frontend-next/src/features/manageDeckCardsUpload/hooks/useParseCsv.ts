import Papa from "papaparse";
import { nextTick, NEXT_PUBLIC_MAX_CARDS_PER_DECK } from "@/utils";
import { JSONContent } from "@tiptap/react";
import { CardCreateMutationInput } from "@generated/gql/graphql";

const textToJsonContent = (textContent: string): JSONContent => {
  const lines = textContent
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => Boolean(line));
  const content = lines.map((text) => ({
    type: "paragraph",
    content: [{ text, type: "text" }],
  }));
  return {
    type: "doc",
    content: content.length ? content : undefined,
  };
};

// TODO: revise to output
export const useParseCsv = () => async (file: File) =>
  nextTick(
    async () =>
      new Promise<CardCreateMutationInput[]>((resolve, reject) => {
        let newCards: CardCreateMutationInput[] = [];
        Papa.parse<string[], File>(file, {
          skipEmptyLines: "greedy",
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
                isTemplate: false,
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
