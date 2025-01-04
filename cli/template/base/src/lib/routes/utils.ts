import { type UnknownKeysParam, type z, type ZodTypeAny } from "zod";

export function validateSearch<
  TObject extends Record<string, any>,
  T extends z.ZodRawShape,
  UnknownKeys extends UnknownKeysParam = UnknownKeysParam,
  Catchall extends ZodTypeAny = ZodTypeAny,
>(validator: z.ZodObject<T, UnknownKeys, Catchall, TObject, TObject>) {
  return async (searchParams: Promise<SearchParams>) => {
    return validator.parse(await searchParams);
  };
}

/**
 * Checks if a given string matches a next route. The special thing is that you can check against
 * dynamic routes.
 *
 * @example
 * const route = "/users/3/edit";
 * const matches = matchesRoute(route, "/users/[id]/edit");
 * console.log(matches); // true
 */
export function matchesRoute(path: string, template: string) {
  // Normalize paths to remove trailing slashes
  const normalize = (str: string) => str.replace(/\/+$/, "");
  const normalizedPath = normalize(path);
  const normalizedTemplate = normalize(template);

  // Escape slashes and replace dynamic segments (e.g., $tumorboardId) with a regex wildcard
  const regexPattern = normalizedTemplate
    .replace(/\$[a-zA-Z0-9_]+/g, "[^/]+") // Replace $dynamic segments with wildcard
    .replace(/\//g, "\\/"); // Escape slashes for regex

  // Create a RegExp to match the normalized path
  const regex = new RegExp(`^${regexPattern}$`);

  return regex.test(normalizedPath);
}