import { integer, varchar } from "drizzle-orm/pg-core";

export function primaryId() {
  return integer("id").primaryKey().generatedByDefaultAsIdentity();
}

export function ref(name: string) {
  return integer(name);
}

export function string(name: string, length = 255) {
  return varchar(name, { length });
}
