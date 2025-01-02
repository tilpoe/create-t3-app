"use client";

/* eslint-disable @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access */

import { type NavigateOptions } from "next/dist/shared/lib/app-router-context.shared-runtime";
import {
  useParams as useNextParams,
  useRouter as useNextRouter,
} from "next/navigation";
import {
  useQueryState as useNuqsQueryState,
  type UseQueryStateOptions as NuqsUseQueryStateOptions,
} from "nuqs";
import { useMemo } from "react";
import { useDebouncedCallback } from "use-debounce";
import { type z } from "zod";

import { type LinkRoute } from "~/lib/routes/link";
import { buildRoute } from "~/lib/routes/shared";
import { $routerSearchParams } from "~/router.gen";

/* -------------------------------------------------------------------------- */
/*                                      -                                     */
/* -------------------------------------------------------------------------- */

function useTypedNextParams<TRoute extends FullRoute>(_route: TRoute) {
  return useNextParams<FullRouter[TRoute]["params"]>();
}

export function useParams<TRoute extends Route>(_route: TRoute) {
  return useTypedNextParams(_route);
}

export function useLayoutParams<TRoute extends LayoutRoute>(_route: TRoute) {
  return useTypedNextParams(_route);
}

/* -------------------------------------------------------------------------- */
/*                                      -                                     */
/* -------------------------------------------------------------------------- */

type UseQueryStateOptions<TQuery> = Partial<
  NuqsUseQueryStateOptions<TQuery>
> & {
  debounceMs?: number;
};

export function useQueryState<
  TQuery,
  TRoute extends Route,
  TSearchParams extends NonNullable<(typeof $routerSearchParams)[TRoute]>,
  K extends keyof z.infer<TSearchParams>,
>(route: TRoute, key: K, options?: UseQueryStateOptions<TQuery>) {
  console.log({ options });

  const defaultShallow = options?.shallow ?? false;
  const [value, setValue] = useNuqsQueryState(key as string, {
    ...options,
    shallow: defaultShallow,
  });

  const parsedValue = useMemo(() => {
    const validator = $routerSearchParams[route]!;

    return (validator as any).pick({ [key]: true }).parse({ [key]: value })[
      key
    ] as z.infer<TSearchParams>[K];
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  const debouncedSetValue = useDebouncedCallback(
    (
      value: Parameters<typeof setValue>[0],
      options?: Parameters<typeof setValue>[1],
    ) => {
      void setValue(value, options);
    },
    options?.debounceMs ?? 0,
  );

  return [parsedValue, debouncedSetValue] as const;
}

/* -------------------------------------------------------------------------- */
/*                                      -                                     */
/* -------------------------------------------------------------------------- */

export function getRouteApi<
  TQuery,
  TRoute extends Route,
  TSearchParams extends NonNullable<(typeof $routerSearchParams)[TRoute]>,
  K extends keyof z.infer<TSearchParams>,
>(route: TRoute) {
  return {
    useParams: () => useParams(route),
    useQueryState: (key: K, options?: UseQueryStateOptions<TQuery>) =>
      useQueryState(route, key, options),
  };
}

/* -------------------------------------------------------------------------- */
/*                                      -                                     */
/* -------------------------------------------------------------------------- */

export function useRouter() {
  const router = useNextRouter();

  return {
    ...router,
    push: <TRoute extends Route>(
      route: LinkRoute<TRoute>,
      options?: NavigateOptions,
    ) => {
      router.push(buildRoute(route), options);
    },
  };
}
