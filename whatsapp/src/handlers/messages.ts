import type { WAMessage, WASocket } from '@whiskeysockets/baileys';

import { config } from '../config.js';
import { logger } from '../lib/logger.js';

const extractText = (msg: WAMessage): string | null => {
  const m = msg.message;
  if (!m) return null;
  return (
    m.conversation ??
    m.extendedTextMessage?.text ??
    m.imageMessage?.caption ??
    m.videoMessage?.caption ??
    m.documentMessage?.caption ??
    null
  );
};

const isAllowed = (jid: string | null | undefined): boolean => {
  if (!jid) return false;
  if (config.botAllowlist.length === 0) return true;
  return config.botAllowlist.includes(jid);
};

/**
 * Minimal bot router. Replace the body of `handleCommand` with real intent
 * matching once the conversational flow is defined.
 */
const handleCommand = async (
  sock: WASocket,
  from: string,
  text: string,
): Promise<void> => {
  const normalized = text.trim().toLowerCase();

  if (normalized === 'ping') {
    await sock.sendMessage(from, { text: 'pong' });
    return;
  }

  if (normalized === 'help' || normalized === '/help') {
    await sock.sendMessage(from, {
      text: [
        'Available commands:',
        '  • ping — health check',
        '  • help — this message',
      ].join('\n'),
    });
    return;
  }
};

export const registerMessageHandler = (sock: WASocket): void => {
  sock.ev.on('messages.upsert', async ({ messages, type }) => {
    if (type !== 'notify') return;

    for (const msg of messages) {
      if (msg.key.fromMe) continue;

      const from = msg.key.remoteJid ?? null;
      const text = extractText(msg);

      logger.info(
        { from, pushName: msg.pushName, text },
        'incoming message',
      );

      if (!from || !text) continue;
      if (!isAllowed(from)) continue;

      try {
        await handleCommand(sock, from, text);
      } catch (err) {
        logger.error({ err, from }, 'failed to handle command');
      }
    }
  });
};
