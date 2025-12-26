import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';
import { getCliVersion } from '../src/lib/version.js';

describe('getCliVersion', () => {
  it('matches package.json version when available', () => {
    const raw = readFileSync(fileURLToPath(new URL('../package.json', import.meta.url)), 'utf8');
    const pkg = JSON.parse(raw) as { version?: unknown };
    expect(getCliVersion()).toBe(pkg.version);
  });
});
