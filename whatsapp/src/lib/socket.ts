import { Boom } from '@hapi/boom';
import makeWASocket, {
  DisconnectReason,
  fetchLatestBaileysVersion,
  useMultiFileAuthState,
  type WASocket,
} from '@whiskeysockets/baileys';
import pino from 'pino';
import qrcode from 'qrcode-terminal';

import { config } from '../config.js';
import { logger } from './logger.js';

type Listener = (sock: WASocket) => void;

let currentSocket: WASocket | null = null;
let pairingCodeRequested = false;
const readyListeners: Listener[] = [];

const baileysLogger = pino({ level: 'silent' });

const notifyReady = (sock: WASocket) => {
  for (const fn of readyListeners) {
    try {
      fn(sock);
    } catch (err) {
      logger.error({ err }, 'ready listener threw');
    }
  }
};

export const onReady = (fn: Listener) => {
  readyListeners.push(fn);
  if (currentSocket) fn(currentSocket);
};

export const getSocket = (): WASocket => {
  if (!currentSocket) {
    throw new Error('WhatsApp socket not connected yet');
  }
  return currentSocket;
};

export const isReady = () => currentSocket !== null;

export const startSocket = async (): Promise<void> => {
  const { state, saveCreds } = await useMultiFileAuthState(config.authDir);
  const { version, isLatest } = await fetchLatestBaileysVersion();
  logger.info({ version, isLatest }, 'using WhatsApp Web version');

  const sock = makeWASocket({
    version,
    auth: state,
    logger: baileysLogger,
    printQRInTerminal: false,
    browser: ['Portal Services', 'Chrome', '1.0.0'],
    markOnlineOnConnect: false,
    syncFullHistory: false,
  });

  sock.ev.on('creds.update', saveCreds);

  sock.ev.on('connection.update', async (update) => {
    const { connection, lastDisconnect, qr } = update;

    if (qr && !config.pairingNumber) {
      logger.info('scan the QR below with WhatsApp > Linked devices');
      qrcode.generate(qr, { small: true });
    }

    if (
      config.pairingNumber &&
      !pairingCodeRequested &&
      !sock.authState.creds.registered
    ) {
      pairingCodeRequested = true;
      try {
        const code = await sock.requestPairingCode(config.pairingNumber);
        logger.info(
          { phone: config.pairingNumber, code },
          'pairing code generated — enter it in WhatsApp > Linked devices > Link with phone number',
        );
      } catch (err) {
        logger.error({ err }, 'failed to request pairing code');
      }
    }

    if (connection === 'open') {
      currentSocket = sock;
      logger.info(
        { jid: sock.user?.id, name: sock.user?.name },
        'WhatsApp connection open',
      );
      notifyReady(sock);
    }

    if (connection === 'close') {
      const statusCode = (lastDisconnect?.error as Boom | undefined)?.output
        ?.statusCode;
      const loggedOut = statusCode === DisconnectReason.loggedOut;
      currentSocket = null;
      logger.warn(
        { statusCode, loggedOut, reason: lastDisconnect?.error?.message },
        'WhatsApp connection closed',
      );

      if (loggedOut) {
        logger.error(
          'session logged out — delete the auth_info folder and restart to re-pair',
        );
        return;
      }

      const delay = 3000;
      setTimeout(() => {
        startSocket().catch((err) =>
          logger.error({ err }, 'reconnect attempt failed'),
        );
      }, delay);
    }
  });
};
