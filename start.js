import { spawn } from 'child_process';

const backend = spawn('node', ['backend/server.js'], {
  stdio: 'inherit',
  env: { ...process.env, BACKEND_PORT: '3000' }
});

const frontend = spawn('node', ['frontend-server.js'], {
  stdio: 'inherit'
});

process.on('SIGTERM', () => {
  backend.kill();
  frontend.kill();
  process.exit(0);
});

process.on('SIGINT', () => {
  backend.kill();
  frontend.kill();
  process.exit(0);
});
