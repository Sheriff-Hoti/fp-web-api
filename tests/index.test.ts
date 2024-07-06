import { assertEquals } from "https://deno.land/std@0.224.0/testing/asserts.ts";
import { isBrowserOptional } from "../utils/isBrowserOptional.ts";
import * as z from "npm:zod@3.23.8";
import { option, either } from "npm:fp-ts";
import { getItem } from "../localStorage/localStoragef.ts";

Deno.test("isBrowserOptional", () => {
  assertEquals(isBrowserOptional(), option.some(window));
});

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
