/*
 * This maps the necessary packages to a version.
 * This improves performance significantly over fetching it from the npm registry.
 */
export const dependencyVersionMap = {
  // NextAuth.js
  "next-auth": "5.0.0-beta.25",
  "@auth/prisma-adapter": "^2.7.2",
  "@auth/drizzle-adapter": "^1.7.2",

  // Prisma
  prisma: "^5.14.0",
  "@prisma/client": "^5.14.0",
  "@prisma/adapter-planetscale": "^5.14.0",

  // Drizzle
  "drizzle-kit": "^0.30.1",
  "drizzle-orm": "^0.38.3",
  "eslint-plugin-drizzle": "^0.2.3",
  mysql2: "^3.11.0",
  "@planetscale/database": "^1.19.0",
  postgres: "^3.4.4",
  "@libsql/client": "^0.9.0",
  "@supabase/ssr": "^0.5.2",
  "@supabase/supabase-js": "^2.47.2",

  // TailwindCSS
  tailwindcss: "^4.0.0-beta.8",
  "@tailwindcss/postcss": "^4.0.0-beta.8",
  "tailwindcss-animate": "^1.0.7",
  "tailwind-merge": "^2.5.5",
  "tailwind-variants": "^0.3.0",
  postcss: "^8.4.39",
  prettier: "^3.3.2",
  "prettier-plugin-tailwindcss": "^0.6.5",

  // tRPC
  "@trpc/client": "^11.0.0-rc.446",
  "@trpc/server": "^11.0.0-rc.446",
  "@trpc/react-query": "^11.0.0-rc.446",
  "@trpc/next": "^11.0.0-rc.446",
  "@tanstack/react-query": "^5.50.0",
  superjson: "^2.2.1",
  "server-only": "^0.0.1",
} as const;
export type AvailableDependencies = keyof typeof dependencyVersionMap;
