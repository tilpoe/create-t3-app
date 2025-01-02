import { integer, pgTableCreator, varchar } from "drizzle-orm/pg-core";

export const createTable = pgTableCreator((name) => `TB_${name}`);

export function primaryId() {
  return integer("id").primaryKey().generatedByDefaultAsIdentity();
}

export function ref(name: string) {
  return integer(name);
}

export function string(name: string, length = 255) {
  return varchar(name, { length });
}
