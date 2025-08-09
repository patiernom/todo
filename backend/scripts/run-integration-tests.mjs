import { spawnSync } from 'node:child_process';
import { existsSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';
import dotenv from 'dotenv';
import net from 'node:net';

// Load integration env from .env.test if present
dotenv.config({ path: join(process.cwd(), '.env.test') });

// Resolve a bin from node_modules/.bin
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

function collectIntegrationTests(rootDir) {
  const out = [];
  const testDir = join(rootDir, 'test');

  function walk(dir) {
    if (!existsSync(dir)) return;
    for (const entry of readdirSync(dir)) {
      const full = join(dir, entry);
      const stat = statSync(full);
      if (stat.isDirectory()) {
        walk(full);
      } else if (/\.integration\.test\.ts$/.test(entry)) {
        out.push(full);
      }
    }
  }

  walk(testDir);
  return out;
}

function canConnect(host, port, timeoutMs = 700) {
  return new Promise((resolve) => {
    const socket = net.connect({ host, port });
    const timeout = setTimeout(() => {
      socket.destroy();
      resolve(false);
    }, timeoutMs);
    socket.on('connect', () => {
      clearTimeout(timeout);
      socket.end();
      resolve(true);
    });
    socket.on('error', () => {
      clearTimeout(timeout);
      resolve(false);
    });
  });
}

function buildDbUrlWithHost(baseUrl, newHost) {
  try {
    const u = new URL(baseUrl);
    u.hostname = newHost;
    if (!u.port) u.port = '5432';
    return u.toString();
  } catch {
    // Fallback if URL parsing fails
    return `postgresql://postgres:postgres@${newHost}:5432/todos?schema=test`;
  }
}

async function ensureDatabaseUrl() {
  const candidatesInOrder = ['db', 'localhost', '127.0.0.1', 'host.docker.internal'];

  // If DATABASE_URL is set, validate its host first
  if (process.env.DATABASE_URL && process.env.DATABASE_URL.trim() !== '') {
    let currentHost = 'db';
    try {
      currentHost = new URL(process.env.DATABASE_URL).hostname || currentHost;
    } catch {
      // ignore parse error, we'll fall back below
    }

    if (await canConnect(currentHost, 5432)) {
      return; // already reachable
    }

    for (const candidate of candidatesInOrder.filter((h) => h !== currentHost)) {
      if (await canConnect(candidate, 5432)) {
        const updated = buildDbUrlWithHost(process.env.DATABASE_URL, candidate);
        console.warn(
          `DATABASE_URL host '${currentHost}' unreachable; falling back to '${candidate}' for integration tests.`,
        );
        process.env.DATABASE_URL = updated;
        return;
      }
    }
    // None reachable; keep as-is and let Prisma error
    return;
  }

  // DATABASE_URL not set: pick the first reachable candidate
  for (const candidate of candidatesInOrder) {
    if (await canConnect(candidate, 5432)) {
      process.env.DATABASE_URL = `postgresql://postgres:postgres@${candidate}:5432/todos?schema=test`;
      return;
    }
  }
  // As a last resort, set localhost to surface a clear error
  process.env.DATABASE_URL = 'postgresql://postgres:postgres@localhost:5432/todos?schema=test';
}

async function main() {
  await ensureDatabaseUrl();

  // Run migrations (deploy to current DATABASE_URL)
  runBin('prisma', ['migrate', 'deploy']);

  // Discover integration tests
  const files = collectIntegrationTests(process.cwd());
  if (files.length === 0) {
    console.warn('No integration tests found matching *.integration.test.ts');
    process.exit(0);
  }

  // Ensure tsx loader is active for TS test files
  const nodeOptions = [process.env.NODE_OPTIONS, '--import=tsx'].filter(Boolean).join(' ');

  // Run lab with discovered files
  runBin('lab', ['-v', ...files], { NODE_OPTIONS: nodeOptions });
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
