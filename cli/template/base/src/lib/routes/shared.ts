import { type LinkRoute } from "~/lib/routes/link";

/**
 * Checks if a given string matches a next route. The special thing is that you can check against
 * dynamic routes.
 *
 * @example
 * const route = "/users/3/edit";
 * const matches = matchesRoute(route, "/users/[id]/edit");
 * console.log(matches); // true
 */
export function matchesRoute<RouteType>(path: string, template: Route) {
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

export function buildRoute<TRoute extends Route>({
  to,
  params,
}: LinkRoute<TRoute>) {
  if ("params" === undefined) {
    return to;
  }

  return to.replace(/\$([a-zA-Z0-9_]+)/g, (_, key) => {
    return (params as Record<string, string>)[key] as string;
  });
}
