export function detect(): "deno" | "node" | "browser" | null {
  if ("Deno" in globalThis) return "deno";
  if ("process" in globalThis) return "node";
  if ("document" in globalThis) return "browser";
  return null;
}

console.log(detect());
