import {
  useAction as useSafeAction,
  useOptimisticAction as useSafeOptimisticAction,
  type HookBaseUtils,
  type HookCallbacks,
  type HookSafeActionFn,
} from "next-safe-action/hooks";
import { useState } from "react";
import { type z } from "zod";

export const useAction = <
  ServerError,
  S extends z.ZodType<any, z.ZodTypeDef, any> | undefined,
  const BAS extends readonly z.ZodType<any, z.ZodTypeDef, any>[],
  CVE,
  CBAVE,
  Data,
>(
  safeActionFn: HookSafeActionFn<ServerError, S, BAS, CVE, CBAVE, Data>,
  utils?: HookCallbacks<ServerError, S, BAS, CVE, CBAVE, Data> & {
    debug?: boolean;
    onBeforeSuccess?: HookCallbacks<
      ServerError,
      S,
      BAS,
      CVE,
      CBAVE,
      Data
    >["onSuccess"];
  }
) => {
  const [isStillPending, setIsStillPending] = useState(false);

  const { isPending, ...safeAction } = useSafeAction(safeActionFn, {
    ...utils,
    onSuccess: async (args) => {
      if (utils?.onBeforeSuccess) {
        setIsStillPending(true);
        await utils.onBeforeSuccess(args);
        setIsStillPending(false);
      }

      if (utils?.onSuccess) {
        utils.onSuccess(args);
      }
    },
    onError: (args) => {
      if (utils?.debug) {
        console.log("ERROR IN SERVER ACTION\n", args.error);
      }

      if (utils?.onError) {
        utils.onError(args);
      }
    },
  });

  return {
    ...safeAction,
    isPending: isPending || isStillPending,
  };
};

export const useOptimisticAction = <
  ServerError,
  S extends z.ZodType<any, z.ZodTypeDef, any> | undefined,
  const BAS extends readonly z.ZodType<any, z.ZodTypeDef, any>[],
  CVE,
  CBAVE,
  Data,
  State,
>(
  safeActionFn: HookSafeActionFn<ServerError, S, BAS, CVE, CBAVE, Data>,
  utils: {
    currentState: State;
    updateFn: (
      state: State,
      input: S extends z.ZodType<any, z.ZodTypeDef, any>
        ? z.infer<S>
        : undefined
    ) => State;
  } & HookBaseUtils<S> &
    HookCallbacks<ServerError, S, BAS, CVE, CBAVE, Data> & {
      debug?: boolean;
    }
) => {
  return useSafeOptimisticAction(safeActionFn, {
    ...utils,
    onError: (args) => {
      if (utils?.debug) {
        console.log("ERROR IN SERVER ACTION\n", args.error);
      }

      if (utils?.onError) {
        utils.onError(args);
      }
    },
  });
};
