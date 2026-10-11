import { access, stat } from "node:fs/promises";
import { constants } from "node:fs";
import { isAbsolute, normalize } from "node:path";

/** Validate every item before invoking Blip; a missing item never produces a partial batch. */
export async function validatePaths(paths: string[]): Promise<string[]> {
  const uniquePaths = [...new Set(paths.map((path) => normalize(path)))];
  if (!uniquePaths.length)
    throw new Error("Choose at least one file or folder.");
  if (uniquePaths.some((path) => !isAbsolute(path)))
    throw new Error("Choose files using the file picker.");
  await Promise.all(
    uniquePaths.map(async (path) => {
      try {
        await access(path, constants.R_OK);
        const item = await stat(path);
        if (!item.isFile() && !item.isDirectory())
          throw new Error("Unsupported item type.");
      } catch {
        throw new Error(
          `Cannot read ${path}. Check that it still exists and is accessible.`,
        );
      }
    }),
  );
  return uniquePaths;
}
