import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import { cache } from "react";

import { db } from "~/server/db";
import { tUserAccount } from "~/server/db/schema";
import { createSupabaseClient } from "~/server/supabase/server";

export const currentUser = cache(async () => {
  const {
    data: { user },
  } = await (await createSupabaseClient()).auth.getUser();

  return user;
});

export const requireUser = cache(async () => {
  const user = await currentUser();

  if (!user) {
    redirect("/login");
  }

  return user;
});

export async function requireFullUser() {
  const authenticatedUser = await requireUser();
  if (authenticatedUser.is_anonymous) {
    return {
      type: "anonymous",
      ...authenticatedUser,
    };
  } else {
    const userAccount = await db.query.tUserAccount.findFirst({
      where: eq(tUserAccount.userId, authenticatedUser.id),
    });

    if (!userAccount) {
      redirect("/login");
    }

    return {
      type: "registered",
      account: userAccount,
      ...authenticatedUser,
    };
  }
}
export type FullUser = Awaited<ReturnType<typeof requireFullUser>>;
