import { rm } from 'node:fs/promises';

import { config } from '../config.js';
import { logger } from '../lib/logger.js';

const main = async () => {
  await rm(config.authDir, { recursive: true, force: true });
  logger.info({ authDir: config.authDir }, 'auth folder removed — next start will require re-pairing');
};

main().catch((err) => {
  logger.error({ err }, 'logout failed');
  process.exit(1);
});
