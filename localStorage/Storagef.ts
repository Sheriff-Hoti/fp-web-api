import { pipe } from "npm:fp-ts@2.16.7/lib/function.js";
import { either, option } from "npm:fp-ts@2.16.7";
import * as z from "npm:zod@3.23.8";
import {
  isDocumentBrowserOptional,
  isWindowBrowserOptional,
} from "../utils/isBrowserOptional.ts";
import { jsonParse, jsonStringify } from "../utils/jsonEither.ts";
import { schemaParseEither } from "../utils/schemaParseEither.ts";

const NotBrowserEnvironment = {
  type: "WINDOW_OBJ_NOT_PRESENT" as const,
  error: new Error("WINDOW_OBJ_NOT_PRESENT"),
};

const StorageItemNotFound = {
  type: "STORAGE_ITEM_NOT_FOUND" as const,
  error: new Error("STORAGE_ITEM_NOT_FOUND"),
};

const StorageSetItemError = (e: unknown) => ({
  type: "STORAGE_SET_ITEM_ERROR" as const,
  error: either.toError(e),
});

export default class Storagef {
  storage: either.Either<typeof NotBrowserEnvironment, Storage>;

  constructor(storage: Storage | undefined) {
    this.storage = pipe(
      isWindowBrowserOptional(),
      either.fromOption(() => NotBrowserEnvironment),
      either.map(() => (storage ? storage : new Storage()))
    );
  }

  _getItemEither(key: string) {
    return pipe(
      this.storage,
      either.map((val) => val.getItem(key)),
      either.map((val) => (val ? option.some(val) : option.none)),
      either.flatMap(either.fromOption(() => StorageItemNotFound))
    );
  }

  getItem<T extends z.ZodTypeAny>(key: string, schema: T) {
    const smth = pipe(
      this.storage,
      either.flatMap(() => this._getItemEither(key)),
      either.flatMap((val) => jsonParse(val)),
      either.flatMap((val) => schemaParseEither(val, schema))
    );
    return smth;
  }

  setItem<T extends z.ZodTypeAny>(
    key: string,
    value: z.infer<typeof schema>,
    schema: T
  ) {
    const smth = pipe(
      either.Do,
      either.bindW("storage", () => this.storage),
      either.bindW("stringVal", () => jsonStringify(value)),
      either.bindW("setItem", ({ storage, stringVal }) =>
        pipe(
          either.tryCatch(
            () => storage.setItem(key, stringVal),
            (e) => StorageSetItemError(e)
          ),
          either.map(() => {
            return {
              key,
              value,
            };
          })
        )
      ),
      either.map((val) => val.setItem)
    );
    return smth;
  }

  on(
    listener: (
      key: string | null | undefined,
      oldData: string | null | undefined,
      newData: string | null | undefined,
      storage: Storage | null | undefined
    ) => void
  ) {
    const smth = pipe(
      isDocumentBrowserOptional(),
      either.fromOption(() => NotBrowserEnvironment),
      either.map(() =>
        addEventListener("storage", (val) => {
          listener(val.key, val.oldValue, val.newValue, val.storageArea);
        })
      )
    );
    return smth;
  }
}
