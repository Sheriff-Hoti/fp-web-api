import * as z from "npm:zod@3.23.8";
import { pipe } from "npm:fp-ts@2.16.7/lib/function.js";
import { either, json } from "npm:fp-ts@2.16.7";

export const SchemaNotValid = (
  error: z.ZodError<{
    [x: string]: any;
  }>
) => ({
  type: "SCHEMA_NOT_VALID" as const,
  error,
});

function inferSchema<T extends z.ZodTypeAny>(schema: T) {
  return schema;
}

export function schemaParseEither<T extends z.ZodTypeAny>(
  val: unknown,
  schema: T
) {
  return pipe(val, inferSchema(schema).safeParse, (val) =>
    val.success
      ? either.right(val.data)
      : either.left(SchemaNotValid(val.error))
  );
}
