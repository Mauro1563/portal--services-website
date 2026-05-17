import express, {
  type NextFunction,
  type Request,
  type Response,
} from 'express';

import { config } from '../config.js';
import { toJid } from '../lib/jid.js';
import { logger } from '../lib/logger.js';
import { getSocket, isReady } from '../lib/socket.js';

type MediaType = 'image' | 'video' | 'document' | 'audio';

const MEDIA_TYPES: readonly MediaType[] = [
  'image',
  'video',
  'document',
  'audio',
] as const;

const requireApiKey = (req: Request, res: Response, next: NextFunction) => {
  const provided = req.header('x-api-key');
  if (provided !== config.apiKey) {
    res.status(401).json({ error: 'invalid or missing x-api-key' });
    return;
  }
  next();
};

const requireConnection = (_req: Request, res: Response, next: NextFunction) => {
  if (!isReady()) {
    res.status(503).json({ error: 'whatsapp socket not connected' });
    return;
  }
  next();
};

const resolveMediaSource = (
  body: { url?: unknown; base64?: unknown },
): { url: string } | { data: Buffer } => {
  if (typeof body.url === 'string' && body.url.length > 0) {
    return { url: body.url };
  }
  if (typeof body.base64 === 'string' && body.base64.length > 0) {
    return { data: Buffer.from(body.base64, 'base64') };
  }
  throw new Error('media requires either `url` or `base64`');
};

export const createServer = () => {
  const app = express();
  app.use(express.json({ limit: '25mb' }));

  app.get('/health', (_req, res) => {
    res.json({ ok: true, connected: isReady() });
  });

  app.use(requireApiKey);

  app.post('/send/text', requireConnection, async (req, res) => {
    try {
      const { to, text } = req.body ?? {};
      if (typeof to !== 'string' || typeof text !== 'string') {
        res.status(400).json({ error: '`to` and `text` are required strings' });
        return;
      }
      const jid = toJid(to);
      const result = await getSocket().sendMessage(jid, { text });
      res.json({ ok: true, id: result?.key.id, jid });
    } catch (err) {
      logger.error({ err }, 'send/text failed');
      res.status(500).json({ error: (err as Error).message });
    }
  });

  app.post('/send/media', requireConnection, async (req, res) => {
    try {
      const {
        to,
        type,
        caption,
        mimetype,
        fileName,
      } = req.body ?? {};

      if (typeof to !== 'string') {
        res.status(400).json({ error: '`to` is required' });
        return;
      }
      if (!MEDIA_TYPES.includes(type)) {
        res.status(400).json({
          error: `\`type\` must be one of ${MEDIA_TYPES.join(', ')}`,
        });
        return;
      }

      const source = resolveMediaSource(req.body ?? {});
      const jid = toJid(to);

      const content =
        type === 'image'
          ? { image: source, caption }
          : type === 'video'
            ? { video: source, caption }
            : type === 'audio'
              ? { audio: source, mimetype: mimetype ?? 'audio/mp4', ptt: false }
              : {
                  document: source,
                  mimetype: mimetype ?? 'application/octet-stream',
                  fileName: fileName ?? 'file',
                  caption,
                };

      const result = await getSocket().sendMessage(jid, content as never);
      res.json({ ok: true, id: result?.key.id, jid });
    } catch (err) {
      logger.error({ err }, 'send/media failed');
      res.status(500).json({ error: (err as Error).message });
    }
  });

  app.post('/check', requireConnection, async (req, res) => {
    try {
      const { phone } = req.body ?? {};
      if (typeof phone !== 'string') {
        res.status(400).json({ error: '`phone` is required' });
        return;
      }
      const results = await getSocket().onWhatsApp(phone);
      const result = results?.[0];
      res.json({
        exists: Boolean(result?.exists),
        jid: result?.jid ?? null,
      });
    } catch (err) {
      logger.error({ err }, 'check failed');
      res.status(500).json({ error: (err as Error).message });
    }
  });

  return app;
};
