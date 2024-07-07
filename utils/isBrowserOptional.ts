import { option } from "npm:fp-ts@2.16.7";
import { pipe } from "npm:fp-ts@2.16.7/lib/function.js";

export function isWindowBrowserOptional() {
  return pipe(globalThis, (val) =>
    "window" in val ? option.some(window) : option.none
  );
}

export function isDocumentBrowserOptional() {
  return pipe(globalThis, (val) =>
    "document" in val ? option.some(document) : option.none
  );
}
