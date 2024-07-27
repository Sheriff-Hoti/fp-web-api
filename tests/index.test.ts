import { assertEquals } from "https://deno.land/std@0.224.0/testing/asserts.ts";
import { isWindowBrowserOptional } from "../utils/isBrowserOptional.ts";
import * as z from "npm:zod@3.23.8";
import { option, either } from "npm:fp-ts";
import { getItem, setItem } from "../localStorage/storagef.ts";

Deno.test("isWindowBrowserOptional", () => {
  assertEquals(isWindowBrowserOptional(), option.some(window));
});

// Deno.test("isDocumentBrowserOptional", () => {
//   assertEquals(isDocumentBrowserOptional(), option.some(document));
// });

Deno.test("localStorage", () => {
  assertEquals(localStorage.getItem(""), null);
});

Deno.test("getItemLocalStorageSucess", () => {
  const localStorage = window.localStorage;
  const key = "testing";
  const value = { test: "hello" };
  localStorage.setItem(key, JSON.stringify(value));
  const schema = z.object({
    test: z.string(),
  });
  // const schema = z.string();
  assertEquals(getItem(key, schema), either.right(value));
});

Deno.test("getItemLocalStorageFail", () => {
  const localStorage = window.localStorage;
  const key = "testing";
  const value = '{ test: "hello" }';
  localStorage.setItem(key, JSON.stringify(value));
  const schema = z.object({
    test: z.string(),
  });
  // const schema = z.string();
  const result = getItem(key, schema);
  if (result._tag === "Left") {
    assertEquals(result.left.type, "SCHEMA_NOT_VALID");
  }
});

Deno.test("getItemLocalStorageStringSuccess", () => {
  const localStorage = window.localStorage;
  const key = "testing";
  const value = '{ test: "hello" }';
  localStorage.setItem(key, JSON.stringify(value));
  // const schema = z.object({
  //   test: z.string(),
  // });
  const schema = z.string();
  assertEquals(getItem(key, schema), either.right(value));
});

Deno.test("setItemLocalStorageSucess", () => {
  const schema = z.object({
    test: z.string(),
  });

  const key = "set_item_testing";
  const value = {
    test: "test_value",
  };

  setItem(key, value, schema);

  const localStorage = window.localStorage;

  assertEquals(localStorage.getItem(key), JSON.stringify(value));
});

// Deno.test("Storagef class get Item not found", () => {
//   const localStorage = window.localStorage;
//   const storage = new Storagef(localStorage);
//   assertEquals(
//     storage.getItem("key1", z.string()),
//     either.left({
//       type: "STORAGE_ITEM_NOT_FOUND" as const,
//       error: new Error("STORAGE_ITEM_NOT_FOUND"),
//     })
//   );
// });

// Deno.test("Storagef class get Item found and its an object", () => {
//   const localStorage = window.localStorage;
//   localStorage.setItem("key", '{ "test":"value" }');
//   const storage = new Storagef(localStorage);
//   assertEquals(
//     storage.getItem(
//       "key",
//       z.object({
//         test: z.string(),
//       })
//     ),
//     either.right({ test: "value" })
//   );
// });

// Deno.test("Storagef class set Item", () => {
//   const localStorage = window.localStorage;
//   const storage = new Storagef(localStorage);

//   assertEquals(
//     storage.setItem("key", '{ "test":"value" }', z.string()),
//     either.right({ key: "key", value: '{ "test":"value" }' })
//   );
// });
