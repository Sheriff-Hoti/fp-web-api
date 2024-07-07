import * as z from "npm:zod@3.23.8";
import { pipe } from "npm:fp-ts@2.16.7/lib/function.js";
import { either, option } from "npm:fp-ts@2.16.7";
import { isWindowBrowserOptional } from "../utils/isBrowserOptional.ts";
import { schemaParseEither } from "../utils/schemaParseEither.ts";
import { jsonParse } from "../utils/jsonEither.ts";

const NotBrowserEnvironment = {
  type: "WINDOW_OBJ_NOT_PRESENT" as const,
  error: new Error("WINDOW_OBJ_NOT_PRESENT"),
};

const StorageItemNotFound = {
  type: "STORAGE_ITEM_NOT_FOUND" as const,
  error: new Error("STORAGE_ITEM_NOT_FOUND"),
};

function getItemOptional(storage: Storage, key: string) {
  return pipe(
    storage,
    (val) => val.getItem(key),
    (val) => (val ? option.some(val) : option.none)
  );
}

export function getItem<T extends z.ZodTypeAny>(
  key: string,
  schema: T,
  storage: "local" | "session" = "local"
) {
  const smth = pipe(
    isWindowBrowserOptional(),
    either.fromOption(() => NotBrowserEnvironment),
    either.map((val) =>
      storage === "local" ? val.localStorage : val.sessionStorage
    ),
    either.map((val) => getItemOptional(val, key)),
    either.flatMap(either.fromOption(() => StorageItemNotFound)),
    either.flatMap(jsonParse),
    either.flatMap((val) => schemaParseEither(val, schema))
  );
  return smth;
}

export function setItem<T extends z.ZodTypeAny>(
  key: string,
  schema: T,
  storage: "local" | "session" = "local"
) {
  const smth = pipe(
    isWindowBrowserOptional(),
    either.fromOption(() => NotBrowserEnvironment),
    either.map((val) =>
      storage === "local" ? val.localStorage : val.sessionStorage
    ),
    either.map((val) => getItemOptional(val, key)),
    either.flatMap(either.fromOption(() => StorageItemNotFound)),
    either.flatMap(jsonParse),
    either.flatMap((val) => schemaParseEither(val, schema))
  );
  return smth;
}
