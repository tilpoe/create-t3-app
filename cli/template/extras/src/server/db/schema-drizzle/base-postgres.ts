import { relations } from "drizzle-orm";
import { pgPolicy, pgRole, pgSchema, pgTableCreator, uuid } from "drizzle-orm/pg-core";

import { primaryId, string } from "~/server/db/utils";
import { SUPABASE_TABLE_NAMES } from "~/server/supabase/enums";

/**
 * This is an example of how to use the multi-project schema feature of Drizzle ORM. Use the same
 * database instance for multiple projects.
 *
 * @see https://orm.drizzle.team/docs/goodies#multi-project-schema
 */
export const createTable = pgTableCreator((name) => `project1_${name}`);

/* ----------------------------------- RLS ---------------------------------- */

const authenticatedRole = pgRole("authenticated");

const basePolicy = pgPolicy("all", { as: "restrictive", to: authenticatedRole, for: "all" });

/* -------------------------------------------------------------------------- */
/*                                    AUTH                                    */
/* -------------------------------------------------------------------------- */

const authSchema = pgSchema("auth");

export const tUser = authSchema.table("users", {
  id: uuid("id").primaryKey(),
});

export const tUserRelations = relations(tUser, ({ one }) => ({
  account: one(tUserAccount, {
    fields: [tUser.id],
    references: [tUserAccount.userId],
  }),
}));

export const tUserAccount = createTable(SUPABASE_TABLE_NAMES.USER_ACCOUNT, {
  id: primaryId(),
  userId: uuid("userId")
    .references(() => tUser.id)
    .notNull(),
  name: string("name").notNull(),
});

export type TUserAccount = typeof tUserAccount.$inferSelect;
