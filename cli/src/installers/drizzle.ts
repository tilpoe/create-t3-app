import path from "path";
import fs from "fs-extra";
import { type PackageJson } from "type-fest";

import { PKG_ROOT } from "~/consts.js";
import { type Installer } from "~/installers/index.js";
import { addPackageDependency } from "~/utils/addPackageDependency.js";
import { type AvailableDependencies } from "./dependencyVersionMap.js";

export const drizzleInstaller: Installer = ({
  projectDir,
  packages,
  scopedAppName,
  databaseProvider,
}) => {
  const devPackages: AvailableDependencies[] = [
    "drizzle-kit",
    "eslint-plugin-drizzle",
    "@supabase/ssr",
    "@supabase/supabase-js",
  ];

  addPackageDependency({
    projectDir,
    dependencies: devPackages,
    devMode: true,
  });
  addPackageDependency({
    projectDir,
    dependencies: [
      "drizzle-orm",
      (
        {
          planetscale: "@planetscale/database",
          mysql: "mysql2",
          postgres: "postgres",
          sqlite: "@libsql/client",
        } as const
      )[databaseProvider],
    ],
    devMode: false,
  });

  const extrasDir = path.join(PKG_ROOT, "template/extras");

  const configFile = path.join(
    extrasDir,
    `config/drizzle-config-${
      databaseProvider === "planetscale" ? "mysql" : databaseProvider
    }.ts`
  );
  const configDest = path.join(projectDir, "drizzle.config.ts");

  const schemaSrc = path.join(
    extrasDir,
    "src/server/db/schema-drizzle",
    packages?.nextAuth.inUse
      ? `with-auth-${databaseProvider}.ts`
      : `base-${databaseProvider}.ts`
  );
  const schemaDest = path.join(projectDir, "src/server/db/schema.ts");

  // Replace placeholder table prefix with project name
  let schemaContent = fs.readFileSync(schemaSrc, "utf-8");
  schemaContent = schemaContent.replace(
    "project1_${name}",
    `${scopedAppName}_\${name}`
  );

  let configContent = fs.readFileSync(configFile, "utf-8");

  configContent = configContent.replace("project1_*", `${scopedAppName}_*`);

  const clientSrc = path.join(
    extrasDir,
    `src/server/db/index-drizzle/with-${databaseProvider}.ts`
  );
  const clientDest = path.join(projectDir, "src/server/db/index.ts");

  // add db:* scripts to package.json
  const packageJsonPath = path.join(projectDir, "package.json");

  const packageJsonContent = fs.readJSONSync(packageJsonPath) as PackageJson;
  packageJsonContent.scripts = {
    ...packageJsonContent.scripts,
    "db:push": "drizzle-kit push",
    "db:studio": "drizzle-kit studio",
    "db:generate": "drizzle-kit generate",
    "db:migrate": "drizzle-kit migrate",
  };

  fs.copySync(configFile, configDest);
  fs.mkdirSync(path.dirname(schemaDest), { recursive: true });
  fs.writeFileSync(schemaDest, schemaContent);
  fs.writeFileSync(configDest, configContent);
  fs.copySync(clientSrc, clientDest);
  fs.writeJSONSync(packageJsonPath, packageJsonContent, {
    spaces: 2,
  });
};
