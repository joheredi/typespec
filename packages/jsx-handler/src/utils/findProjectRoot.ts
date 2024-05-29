import { fileURLToPath } from "url";
import { dirname, resolve } from "path";
import { existsSync } from "fs";

export function findProjectRoot() {
  let currentDir = dirname(fileURLToPath(import.meta.url));

  while (currentDir !== resolve(currentDir, "..")) {
    const packageJsonPath = resolve(currentDir, "package.json");
    if (existsSync(packageJsonPath)) {
      return currentDir;
    }
    currentDir = resolve(currentDir, "..");
  }

  throw new Error("Project root not found");
}