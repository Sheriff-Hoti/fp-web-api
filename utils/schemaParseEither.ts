import * as z from "npm:zod@3.23.8";
import { pipe } from "npm:fp-ts@2.16.7/lib/function.js";
import { either } from "npm:fp-ts@2.16.7";

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
  return pipe(inferSchema(schema).safeParse(val), (val) =>
    val.success
      ? either.right(val.data as z.infer<typeof schema>)
      : either.left(SchemaNotValid(val.error))
  );
}
