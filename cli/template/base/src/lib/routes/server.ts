import { redirect as nextRedirect, type RedirectType } from "next/navigation";
import { type UnknownKeysParam, type z, type ZodTypeAny } from "zod";

import { type LinkRoute } from "~/lib/routes/link";
import { buildRoute } from "~/lib/routes/shared";

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

export function redirect<TRoute extends Route>(
  route: LinkRoute<TRoute>,
  type?: RedirectType,
): never {
  nextRedirect(buildRoute(route), type);
}
