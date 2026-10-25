import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

import { CARD_FONTS } from "../src/ts/card/_headlineCard";

const projectRoot = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "..",
);

/** The version bun installed, so the workbench loads the same satori and fonts the post script uses. */
function installedVersion(pkg: string): string {
  const manifest = path.resolve(
    projectRoot,
    "node_modules",
    pkg,
    "package.json",
  );
  return JSON.parse(fs.readFileSync(manifest, "utf8")).version;
}

/** The workbench's import map: satori and the card fonts from jsDelivr, pinned to the installed versions. */
export function cardImportMap(): string {
  const imports: Record<string, string> = {
    satori: `https://cdn.jsdelivr.net/npm/satori@${installedVersion("satori")}/+esm`,
  };
  for (const { name } of Object.values(CARD_FONTS)) {
    const pkg = `@fontsource/${name.toLowerCase()}`;
    imports[`${pkg}/`] =
      `https://cdn.jsdelivr.net/npm/${pkg}@${installedVersion(pkg)}/`;
  }
  return JSON.stringify({ imports }, null, 2);
}

/** Locals every Pug page gets, from both the build and the watcher. */
export function pugLocals(): Record<string, unknown> {
  return { importMap: cardImportMap() };
}
