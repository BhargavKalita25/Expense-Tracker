import { spawn, execSync } from 'node:child_process';
import os from 'node:os';
import http from 'node:http';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..');
const serverDir = path.join(rootDir, 'server');
const clientDir = path.join(rootDir, 'client');

// ANSI formatting tokens
const c = {
  reset: '\x1b[0m',
  bold: '\x1b[1m',
  dim: '\x1b[2m',
  cyan: '\x1b[36m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  gray: '\x1b[90m',
  white: '\x1b[37m',
  magenta: '\x1b[35m',
};

const stripAnsi = (str) => str.replace(/\x1b\[[0-9;]*m/g, '');

// Detect LAN / Wi-Fi IPv4 address
function getNetworkIp() {
  const interfaces = os.networkInterfaces();
  const validIps = [];

  for (const name of Object.keys(interfaces)) {
    for (const iface of interfaces[name]) {
      if (iface.family === 'IPv4' && !iface.internal) {
        if (!iface.address.startsWith('169.254.')) {
          validIps.push(iface.address);
        }
      }
    }
  }

  // Prioritize common local subnet ranges
  const lan = validIps.find((ip) => ip.startsWith('192.168.') || ip.startsWith('10.') || ip.startsWith('172.'));
  return lan || validIps[0] || null;
}

// Render clean, beautifully aligned terminal card without emojis
function printBanner(networkIp, elapsedMs) {
  const width = 64;
  const topBorder = '  ' + c.cyan + '+' + '-'.repeat(width - 2) + '+' + c.reset;
  const midBorder = '  ' + c.cyan + '+' + '-'.repeat(width - 2) + '+' + c.reset;
  const botBorder = '  ' + c.cyan + '+' + '-'.repeat(width - 2) + '+' + c.reset;

  const row = (text = '') => {
    const visibleLen = stripAnsi(text).length;
    const padding = Math.max(0, width - 4 - visibleLen);
    return '  ' + c.cyan + '|' + c.reset + ' ' + text + ' '.repeat(padding) + ' ' + c.cyan + '|' + c.reset;
  };

  console.log();
  console.log(topBorder);
  console.log(row());
  console.log(row('  ' + c.bold + c.white + 'EXPENSE TRACKER' + c.reset));
  console.log(row('  ' + c.dim + 'Full-Stack Personal Finance & Analytics Platform' + c.reset));
  console.log(row());
  console.log(midBorder);
  console.log(row());
  console.log(row('  ' + c.green + '>' + c.reset + ' ' + c.bold + 'Local:   ' + c.reset + ' ' + c.cyan + 'http://localhost:5173/' + c.reset));
  if (networkIp) {
    console.log(row('  ' + c.green + '>' + c.reset + ' ' + c.bold + 'Network: ' + c.reset + ' ' + c.cyan + `http://${networkIp}:5173/` + c.reset));
  }
  console.log(row());
  console.log(row('  ' + c.dim + '- API:     ' + c.reset + c.white + 'http://localhost:5100' + c.reset));
  console.log(row('  ' + c.dim + '- Health:  ' + c.reset + c.white + 'http://localhost:5100/health' + c.reset));
  console.log(row('  ' + c.dim + '- Database:' + c.reset + ' ' + c.white + 'SQLite (Embedded / WAL mode)' + c.reset));
  console.log(row());
  console.log(midBorder);
  console.log(row());
  console.log(row('  ' + c.dim + `Ready in ${elapsedMs}ms. Press ` + c.reset + c.yellow + 'Ctrl+C' + c.reset + c.dim + ' to stop servers.' + c.reset));
  console.log(row());
  console.log(botBorder);
  console.log();
}

// Check HTTP connectivity
function checkUrl(url) {
  return new Promise((resolve) => {
    const req = http.get(url, (res) => {
      resolve(res.statusCode >= 200 && res.statusCode < 400);
    });
    req.on('error', () => resolve(false));
    req.setTimeout(800, () => {
      req.destroy();
      resolve(false);
    });
  });
}

const childProcesses = [];

function killProcesses() {
  for (const proc of childProcesses) {
    if (proc && proc.pid) {
      if (process.platform === 'win32') {
        try {
          execSync(`taskkill /pid ${proc.pid} /T /F`, { stdio: 'ignore' });
        } catch {}
      } else {
        try {
          process.kill(-proc.pid, 'SIGTERM');
        } catch {
          try {
            proc.kill('SIGTERM');
          } catch {}
        }
      }
    }
  }
}

process.on('SIGINT', () => {
  killProcesses();
  process.exit(0);
});

process.on('SIGTERM', () => {
  killProcesses();
  process.exit(0);
});

process.on('exit', () => {
  killProcesses();
});

async function main() {
  console.log();
  console.log('  ' + c.cyan + '>' + c.reset + ' ' + c.bold + 'Starting Expense Tracker...' + c.reset);
  console.log('  ' + c.dim + '  Initializing embedded SQLite database and starting Vite...' + c.reset);

  const startTime = Date.now();

  // Start backend
  const serverProc = spawn('npm run dev', {
    cwd: serverDir,
    stdio: ['ignore', 'pipe', 'pipe'],
    shell: true,
  });
  childProcesses.push(serverProc);

  // Start frontend
  const clientProc = spawn('npm run dev', {
    cwd: clientDir,
    stdio: ['ignore', 'pipe', 'pipe'],
    shell: true,
  });
  childProcesses.push(clientProc);

  let bannerPrinted = false;
  const maxWait = 12000;

  const interval = setInterval(async () => {
    const elapsed = Date.now() - startTime;
    const [serverOk, clientOk] = await Promise.all([
      checkUrl('http://localhost:5100/health'),
      checkUrl('http://localhost:5173/'),
    ]);

    if ((serverOk && clientOk && !bannerPrinted) || (elapsed >= maxWait && !bannerPrinted)) {
      bannerPrinted = true;
      clearInterval(interval);
      const networkIp = getNetworkIp();
      printBanner(networkIp, elapsed);
    }
  }, 400);

  // Surface server errors if any
  serverProc.stderr.on('data', (data) => {
    const str = data.toString();
    if (str.includes('Error') && !str.includes('ExperimentalWarning')) {
      process.stderr.write(c.yellow + '[server error] ' + c.reset + str);
    }
  });

  clientProc.stderr.on('data', (data) => {
    const str = data.toString();
    if (str.includes('Error') && !str.includes('ExperimentalWarning')) {
      process.stderr.write(c.cyan + '[client error] ' + c.reset + str);
    }
  });
}

main().catch((err) => {
  console.error('Failed to launch application:', err);
  killProcesses();
  process.exit(1);
});
