import { Prisma } from "database";

export const flattenJSONContent = (base: Prisma.JsonObject | null | undefined) => {
  const text: string[] = [];
  let queue = [base];
  while (queue.length) {
    const current = queue.pop();
    if (typeof current !== "object" || current === null) {
      continue;
    }
    if (current.type == "text") {
      text.push(current.text as string);
    }
    if (Array.isArray(current.content)) {
      queue = queue.concat(current.content as Prisma.JsonObject[]);
    }
  }
  return text;
}
