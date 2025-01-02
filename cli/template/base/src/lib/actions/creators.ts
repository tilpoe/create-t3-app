import { TRPCError } from "@trpc/server";
import { createSafeActionClient } from "next-safe-action";

import { ActionError } from "~/lib/actions/errors";
import { db } from "~/server/db";
import { createSupabaseClient } from "~/server/supabase/server";

export const createAction = createSafeActionClient({
  defaultValidationErrorsShape: "flattened",
  handleServerError(error) {
    if (error instanceof ActionError || error instanceof TRPCError) {
      return {
        code: error.code,
        message: error.message,
      };
    }

    return {
      code: "INTERNAL_SERVER_ERROR",
      message: error.message,
    };
  },
}).use(async ({ next }) => {
  return next({
    ctx: {
      supabase: createSupabaseClient(),
      db,
    },
  });
});

export const createProtectedAction = createAction.use(async ({ next, ctx }) => {
  const {
    data: { user },
  } = await (await ctx.supabase).auth.getUser();

  if (!user) {
    throw new ActionError({
      code: "UNAUTHORIZED",
    });
  }

  return next({
    ctx: {
      ...ctx,
      user,
    },
  });
});
