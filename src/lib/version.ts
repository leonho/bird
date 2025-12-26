import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

function readPackageVersionFromJsonFile(path: string): string | undefined {
  try {
    const raw = readFileSync(path, 'utf8');
    const parsed = JSON.parse(raw) as { version?: unknown };
    return typeof parsed.version === 'string' ? parsed.version : undefined;
  } catch {
    return undefined;
  }
}

function readVersionFromTextFile(path: string): string | undefined {
  try {
    const raw = readFileSync(path, 'utf8').trim();
    return raw.length > 0 ? raw : undefined;
  } catch {
    return undefined;
  }
}

function tryReadVersionFromImportMeta(): string | undefined {
  try {
    const thisFile = fileURLToPath(import.meta.url);
    const baseDir = join(dirname(thisFile), '..', '..');
    return (
      readPackageVersionFromJsonFile(join(baseDir, 'package.json')) ?? readVersionFromTextFile(join(baseDir, 'VERSION'))
    );
  } catch {
    return undefined;
  }
}

function tryReadVersionNextToExecutable(): string | undefined {
  const execDir = dirname(process.argv[0] ?? process.execPath);
  return (
    readPackageVersionFromJsonFile(join(execDir, 'package.json')) ?? readVersionFromTextFile(join(execDir, 'VERSION'))
  );
}

export function getCliVersion(): string {
  return tryReadVersionFromImportMeta() ?? tryReadVersionNextToExecutable() ?? 'unknown';
}
