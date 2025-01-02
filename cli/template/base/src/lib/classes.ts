import { twMerge } from "tailwind-merge";
import { cnBase, type ClassValue } from "tailwind-variants";

export const cn = (...inputs: ClassValue[]): string =>
  twMerge(cnBase(...inputs));
