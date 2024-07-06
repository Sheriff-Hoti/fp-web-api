import { option } from "npm:fp-ts@2.16.7";
import { pipe } from "npm:fp-ts@2.16.7/lib/function.js";

export function isBrowserOptional() {
  return pipe(globalThis, (val) =>
    "window" in val ? option.some(window) : option.none
  );
}
