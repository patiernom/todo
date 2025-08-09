import { spawnSync } from 'node:child_process';
import { existsSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';

function resolveBin(name) {
  const isWin = process.platform === 'win32';
  return join(process.cwd(), 'node_modules', '.bin', isWin ? `${name}.cmd` : name);
}

function runBin(bin, args, extraEnv = {}) {
  const result = spawnSync(resolveBin(bin), args, {
    stdio: 'inherit',
    env: { ...process.env, ...extraEnv },
  });
  if (result.status !== 0) {
    process.exit(result.status ?? 1);
  }
}

function collectUnitTests(rootDir) {
  const out = [];
  const testDir = join(rootDir, 'test');

  function walk(dir) {
    if (!existsSync(dir)) return;
    for (const entry of readdirSync(dir)) {
      const full = join(dir, entry);
      const stat = statSync(full);
      if (stat.isDirectory()) {
        walk(full);
      } else {
        const isTest = /\.test\.ts$/.test(entry) || /\.spec\.ts$/.test(entry);
        const isIntegration = /\.integration\./.test(entry);
        if (isTest && !isIntegration) {
          out.push(full);
        }
      }
    }
  }

  walk(testDir);
  return out;
}

function main() {
  const files = collectUnitTests(process.cwd());
  if (files.length === 0) {
    console.warn('No unit tests found (excluding integration tests).');
    process.exit(0);
  }

  const nodeOptions = [process.env.NODE_OPTIONS, '--import=tsx'].filter(Boolean).join(' ');
  runBin('lab', ['-v', ...files], { NODE_OPTIONS: nodeOptions });
}

main();
