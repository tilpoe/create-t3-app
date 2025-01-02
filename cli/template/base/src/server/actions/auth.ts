"use server";

import { z } from "zod";

import { createAction } from "~/lib/actions/creators";
import { ActionError } from "~/lib/actions/errors";

export const signInWithPasswordAction = createAction
  .schema(
    z.object({
      email: z.string().min(1),
      password: z.string().min(1),
    })
  )
  .action(async ({ parsedInput, ctx }) => {
    const { data, error } = await (
      await ctx.supabase
    ).auth.signInWithPassword({
      email: parsedInput.email,
      password: parsedInput.password,
    });

    if (error) {
      throw new ActionError({
        code: "UNAUTHORIZED",
        message: "Falsche E-Mail-Adresse oder Passwort.",
      });
    }

    if (data.user) {
      return true;
    }

    throw new Error();
  });
