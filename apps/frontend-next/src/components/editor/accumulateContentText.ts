import { JSONContent } from "@tiptap/react";

export function accumulateContentText(item?: JSONContent | null): string {
  if (!item) {
    return "";
  }
  const strs: string[] = [];
  const queue = [item];
  while (queue.length) {
    const { text, content } = queue.shift() as JSONContent;
    if (text) {
      strs.push(text);
    }
    for (const item of content ?? []) {
      queue.push(item);
    }
  }
  return strs.join("");
}
