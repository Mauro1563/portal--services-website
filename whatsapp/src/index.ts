import { createServer } from './api/server.js';
import { config } from './config.js';
import { registerMessageHandler } from './handlers/messages.js';
import { logger } from './lib/logger.js';
import { onReady, startSocket } from './lib/socket.js';

const main = async () => {
  onReady((sock) => {
    registerMessageHandler(sock);
  });

  await startSocket();

  const app = createServer();
  app.listen(config.port, () => {
    logger.info({ port: config.port }, 'HTTP API listening');
  });
};

main().catch((err) => {
  logger.error({ err }, 'fatal error during startup');
  process.exit(1);
});

const shutdown = (signal: string) => {
  logger.info({ signal }, 'shutting down');
  process.exit(0);
};

process.on('SIGINT', () => shutdown('SIGINT'));
process.on('SIGTERM', () => shutdown('SIGTERM'));
