import { z } from "zod";

export const createValidationIssue = (
  ctx: z.RefinementCtx,
  issue: string,
  params?: Record<string, any>,
) => {
  ctx.addIssue({
    code: z.ZodIssueCode.custom,
    message: issue,
    params,
    fatal: true,
  });

  return z.NEVER;
};

export const dbIdentifierSchema = z.string().transform((val, ctx) => {
  const parsed = parseFloat(val);
  if (isNaN(parsed)) {
    return createValidationIssue(ctx, "Invalid number for db identifier");
  }
  return parsed;
});
