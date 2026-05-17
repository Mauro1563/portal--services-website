import 'dotenv/config';
import path from 'node:path';

const required = (name: string, value: string | undefined): string => {
  if (!value || value.trim() === '') {
    throw new Error(`Missing required env var: ${name}`);
  }
  return value;
};

export const config = {
  port: Number(process.env.PORT ?? 3030),
  apiKey: required('API_KEY', process.env.API_KEY),
  authDir: path.resolve(process.env.AUTH_DIR ?? './auth_info'),
  pairingNumber: process.env.PAIRING_NUMBER?.replace(/\D/g, '') || undefined,
  logLevel: (process.env.LOG_LEVEL ?? 'info') as
    | 'trace'
    | 'debug'
    | 'info'
    | 'warn'
    | 'error',
  botAllowlist: (process.env.BOT_ALLOWLIST ?? '')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean),
};
