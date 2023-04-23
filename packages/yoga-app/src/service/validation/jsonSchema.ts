import { z } from 'zod';

export const jsonLiteralSchema = z.union([
  z.string(),
  z.number(),
  z.boolean(),
  z.null(),
]);
export type JsonLiteral = z.infer<typeof jsonLiteralSchema>;
export type Json = JsonLiteral | JsonObject | Json[];
export const jsonSchema: z.ZodType<Json> = z.lazy(() =>
  z.union([jsonLiteralSchema, z.array(jsonSchema), z.record(jsonSchema)])
);
export type JsonObject = { [key: string]: Json };
export const jsonObjectSchema: z.ZodType<JsonObject> = z.record(jsonSchema);
