import generate from "@babel/generator";
import { parse } from "@babel/parser";
import traverse from "@babel/traverse";
import chokidar from "chokidar";
import fs from "fs/promises";
import path from "path";
import { Project, VariableDeclarationKind, type SourceFile } from "ts-morph";

const ROUTES_DIR = "./src/app";
const ROUTE_GEN_FILE = "./src/router.gen.ts";

let initialScan = true;
let firstGen = true;

const watcher = chokidar.watch(ROUTES_DIR, {
  ignored: /(^|[\/\\])\../, // ignore dotfiles
  persistent: true,
});

function update() {
  if (!initialScan || firstGen) {
    void generateRouteFile();
    firstGen = false;
  }
}

watcher
  .on("add", update)
  .on("unlink", update)
  .on("change", update)
  .on("ready", () => {
    initialScan = false;
  });

async function generateRouteFile() {
  const project = new Project();
  const sourceFile = project.createSourceFile(ROUTE_GEN_FILE, "", {
    overwrite: true,
  });

  // Add file comment
  sourceFile.addStatements("// This file is auto-generated. DO NOT EDIT.");
  sourceFile.addStatements('import * as z from "zod"');

  const routes = await getRoutes(ROUTES_DIR);
  generateRouteTypeDefinitions(
    sourceFile,
    routes.map((route) => route.transformed),
  );
  await generateSearchParams(sourceFile, routes);

  sourceFile.saveSync();
  console.log("✅ Routes successfully generated.");
}

function transformPath(input: string) {
  let path =
    input
      .replace(/^src\//, "") // Remove the first 'src/'
      .replace(/\/page\.tsx$/, "") // Remove the trailing '/page.tsx'
      .replace(/^app\//, "") // Remove the first 'app/' if it exists
      .split("/") // Split the path into segments
      .filter(
        (segment) =>
          !segment.startsWith("_") && // Remove segments starting with '_'
          !(segment.startsWith("(") && segment.endsWith(")")), // Remove segments enclosed in parentheses
      )
      .map((segment) => {
        if (segment.startsWith("[") && segment.endsWith("]")) {
          return `$${segment.slice(1, -1)}`; // Replace brackets with a dollar sign
        }
        return segment;
      })
      .join("/") + "/"; // Rejoin the segments and add a trailing '/'

  path = path === "app/" ? "/" : "/" + path;

  return path.replace("layout.tsx/", "_layout/");
}

async function getRoutes(dir: string) {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  const routes: { full: string; transformed: string }[] = [];

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      routes.push(...(await getRoutes(fullPath)));
    } else if (
      entry.isFile() &&
      (entry.name === "page.tsx" || entry.name === "layout.tsx")
    ) {
      routes.push({
        full: fullPath,
        transformed: transformPath(fullPath),
      });
    }
  }

  return routes;
}

function extractDynamicPaths(input: string): string[] {
  return input
    .split("/") // Split the path into segments
    .filter((segment) => segment.startsWith("$")) // Keep only segments starting with '$'
    .map((segment) => segment.slice(1)); // Remove the '$' prefix
}

function generateRouteTypeDefinitions(
  sourceFile: SourceFile,
  routes: string[],
) {
  type RouteConfig = Record<
    string,
    { params: Record<string, string>; hasDynamicPathSegments: true | false }
  >;
  const routeConfig: RouteConfig = {};
  const layoutRouteConfig: RouteConfig = {};

  routes.forEach((route) => {
    const dynamicPaths = extractDynamicPaths(route);

    const params: Record<string, string> = {};
    for (const path of dynamicPaths) {
      params[path] = "";
    }

    if (route.includes("_layout")) {
      layoutRouteConfig[route] = {
        params,
        hasDynamicPathSegments: dynamicPaths.length !== 0,
      };
    } else {
      routeConfig[route] = {
        params,
        hasDynamicPathSegments: dynamicPaths.length !== 0,
      };
    }
  });

  sourceFile.addTypeAlias({
    name: "$Route",
    isExported: true,
    type: routes
      .filter((route) => !route.includes("_layout"))
      .map((route) => `"${route}"`)
      .join(" | "),
  });

  sourceFile.addTypeAlias({
    name: "$LayoutRoute",
    isExported: true,
    type: routes
      .filter((route) => route.includes("_layout"))
      .map((route) => `"${route}"`)
      .join(" | "),
  });

  sourceFile.addTypeAlias({
    name: "$FullRoute",
    isExported: true,
    type: "$Route | $LayoutRoute",
  });

  sourceFile.addVariableStatement({
    declarationKind: VariableDeclarationKind.Const,
    declarations: [
      {
        name: "routesConfig",
        initializer: (writer) => {
          writer.writeLine("{");
          for (const [route, config] of Object.entries(routeConfig)) {
            writer
              .quote(route)
              .write(":")
              .block(() => {
                writer.writeLine(`params: {`);
                for (const param of Object.keys(config.params)) {
                  writer.writeLine(`${param}: "",`);
                }
                writer.writeLine(`},`);

                if (config.hasDynamicPathSegments) {
                  writer.writeLine(`hasDynamicPathSegments: true as const`);
                } else {
                  writer.writeLine(`hasDynamicPathSegments: false as const`);
                }
              })
              .write(",");
          }
          writer.writeLine("} satisfies { [K in $Route]: any }");
        },
      },
    ],
  });

  sourceFile.addVariableStatement({
    declarationKind: VariableDeclarationKind.Const,
    declarations: [
      {
        name: "layoutRoutesConfig",
        initializer: (writer) => {
          writer.writeLine("{");
          for (const [route, config] of Object.entries(layoutRouteConfig)) {
            writer
              .quote(route)
              .write(":")
              .block(() => {
                writer.writeLine(`params: {`);
                for (const param of Object.keys(config.params)) {
                  writer.writeLine(`${param}: "",`);
                }
                writer.writeLine(`},`);

                if (config.hasDynamicPathSegments) {
                  writer.writeLine(`hasDynamicPathSegments: true as const`);
                } else {
                  writer.writeLine(`hasDynamicPathSegments: false as const`);
                }
              })
              .write(",");
          }
          writer.writeLine("} satisfies { [K in $LayoutRoute]: any }");
        },
      },
    ],
  });

  sourceFile.addVariableStatement({
    declarationKind: VariableDeclarationKind.Const,
    declarations: [
      {
        name: "fullRoutesConfig",
        initializer: (writer) => {
          writer.writeLine("{");
          writer.writeLine("...routesConfig,");
          writer.writeLine("...layoutRoutesConfig");
          writer.writeLine("}");
        },
      },
    ],
  });

  sourceFile.addTypeAlias({
    name: "$Router",
    type: "typeof routesConfig",
    isExported: true,
  });

  sourceFile.addTypeAlias({
    name: "$LayoutRouter",
    type: "typeof layoutRoutesConfig",
    isExported: true,
  });

  sourceFile.addTypeAlias({
    name: "$FullRouter",
    type: "typeof fullRoutesConfig",
    isExported: true,
  });
}

async function generateSearchParams(
  sourceFile: SourceFile,
  routes: { full: string; transformed: string }[],
) {
  const validators: Record<string, string | null> = {};

  for (const route of routes.filter(
    (route) => !route.transformed.includes("_layout"),
  )) {
    const fileContent = await fs.readFile(route.full, "utf-8");

    const ast = parse(fileContent, {
      sourceType: "module",
      plugins: ["jsx", "typescript"], // Enable JSX and TypeScript parsing
    });

    let code: string | null = null;

    // Traverse the AST to find the `z.object()` part
    traverse(ast, {
      CallExpression(path) {
        const callee = path.node.callee;
        if ("name" in callee && callee.name === "validateSearch") {
          const firstArg = path.node.arguments[0];
          if (firstArg) {
            code = generate(firstArg).code;
          }
          path.stop();
        }
      },
    });

    validators[route.transformed] = code;
  }

  sourceFile.addVariableStatement({
    isExported: true,
    declarationKind: VariableDeclarationKind.Const,
    declarations: [
      {
        name: "$routerSearchParams",
        initializer: (writer) => {
          writer.writeLine("{");
          for (const [route, validator] of Object.entries(validators)) {
            writer.writeLine(`"${route}": ${validator},`);
          }
          writer.writeLine("} satisfies { [K in $Route]: any }");
        },
      },
    ],
  });
}
