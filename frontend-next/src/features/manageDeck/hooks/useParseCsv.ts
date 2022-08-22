import Papa from "papaparse";
import Delta from 'quill-delta';
import { Delta as DeltaType } from 'quill';
import { nextTick, NEXT_PUBLIC_MAX_CARDS_PER_DECK } from "@/utils";
import { NewCardData } from "../types";

export const useParseCsv = () => async (file: File) => nextTick(
  async () => new Promise<NewCardData[]>(
    (resolve, reject) => {
      let newCards: NewCardData[] = [];
      Papa.parse<string[], File>(file, {
        skipEmptyLines: "greedy",
        chunk: (results, parser) => {
          if (results.errors.length > 0) {
            reject(results.errors);
            parser.abort();
          }
          newCards = newCards.concat(results.data.map(([prompt, fullAnswer, ...answers]) => ({
            prompt: new Delta().insert(prompt ?? "") as unknown as DeltaType,
            fullAnswer: new Delta().insert(fullAnswer ?? "") as unknown as DeltaType,
            answers: answers.filter((answer) => answer.trim())
          })));
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