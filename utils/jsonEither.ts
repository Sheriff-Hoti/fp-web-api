import { either } from "npm:fp-ts@2.16.7";

const JsonParseError = (e: unknown) => ({
  type: "JSON_PARSE_ERROR" as const,
  error: either.toError(e),
});

const JsonStringifyError = (e: unknown) => ({
  type: "JSON_STRINGIFY_ERROR" as const,
  error: either.toError(e),
});

export function jsonParse(
  input: string
): either.Either<ReturnType<typeof JsonParseError>, unknown> {
  return either.tryCatch(
    () => JSON.parse(input),
    (e) => JsonParseError(e)
  );
}

export function jsonStringify(
  input: unknown
): either.Either<ReturnType<typeof JsonStringifyError>, string> {
  return either.tryCatch(
    () => JSON.stringify(input),
    (e) => JsonStringifyError(e)
  );
}
