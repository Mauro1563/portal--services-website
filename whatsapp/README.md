# WhatsApp Connector

Standalone Node service that bridges Portal Services to WhatsApp via
[`@whiskeysockets/baileys`](https://github.com/WhiskeySockets/Baileys) — the most
actively maintained open-source WhatsApp library (WebSocket-based, no Chromium
required).

It lives in this folder so it can be deployed alongside the Next.js site
*without* polluting the Next.js build. Run it as its own process (PM2, systemd,
Docker, Railway, Fly.io, etc.) and call it over HTTP from the main app or any
other service.

## Architecture

```
┌──────────────┐   HTTP (x-api-key)   ┌────────────────────┐   WebSocket   ┌──────────────┐
│  Next.js /   │ ───────────────────► │ whatsapp service   │ ────────────► │  WhatsApp    │
│  any client  │                      │  (this folder)     │ ◄──────────── │   servers    │
└──────────────┘ ◄─────── JSON ─────── └────────────────────┘   events      └──────────────┘
                                              │
                                              ▼
                                       auth_info/  (persistent session)
```

## Setup

```bash
cd whatsapp
npm install
cp .env.example .env
# edit .env — at minimum set a strong API_KEY (openssl rand -hex 32)
npm start
```

On first run you'll see one of two things in the terminal:

- **QR mode** (default): an ASCII QR code. Open WhatsApp on your phone →
  Settings → Linked devices → Link a device → scan it.
- **Pairing-code mode**: set `PAIRING_NUMBER` in `.env` to your phone number
  (digits only, with country code). On startup the service prints an 8-character
  code; enter it in WhatsApp → Linked devices → Link with phone number.

Credentials are saved to `auth_info/` and reused on subsequent runs, so you only
pair once. To force a new pairing run `npm run logout`.

## HTTP API

All endpoints except `/health` require `x-api-key: <API_KEY>`.

### `GET /health`

```bash
curl http://localhost:3030/health
# → {"ok":true,"connected":true}
```

### `POST /send/text`

```bash
curl -X POST http://localhost:3030/send/text \
  -H "x-api-key: $API_KEY" \
  -H "content-type: application/json" \
  -d '{"to":"5491122334455","text":"hola desde el portal"}'
```

`to` accepts either a phone number (with country code, any separators) or a
full JID (`...@s.whatsapp.net` or `...@g.us` for groups).

### `POST /send/media`

Send image, video, document, or audio — by public URL or base64.

```bash
# from URL
curl -X POST http://localhost:3030/send/media \
  -H "x-api-key: $API_KEY" -H "content-type: application/json" \
  -d '{
    "to":"5491122334455",
    "type":"image",
    "url":"https://example.com/photo.jpg",
    "caption":"check this out"
  }'

# from base64
curl -X POST http://localhost:3030/send/media \
  -H "x-api-key: $API_KEY" -H "content-type: application/json" \
  -d '{
    "to":"5491122334455",
    "type":"document",
    "base64":"JVBERi0xLjQK...",
    "mimetype":"application/pdf",
    "fileName":"invoice.pdf"
  }'
```

`type` must be one of `image`, `video`, `document`, `audio`.

### `POST /check`

Check whether a phone number has a WhatsApp account.

```bash
curl -X POST http://localhost:3030/check \
  -H "x-api-key: $API_KEY" -H "content-type: application/json" \
  -d '{"phone":"5491122334455"}'
# → {"exists":true,"jid":"5491122334455@s.whatsapp.net"}
```

## Receiving messages / bot

Inbound messages are handled in `src/handlers/messages.ts`. A minimal command
router is included (`ping`, `help`) — extend `handleCommand` with real intents.

To restrict who can trigger commands, set `BOT_ALLOWLIST` in `.env` to a
comma-separated list of JIDs.

## Environment variables

| Variable         | Default          | Description                                                      |
| ---------------- | ---------------- | ---------------------------------------------------------------- |
| `PORT`           | `3030`           | HTTP API port                                                    |
| `API_KEY`        | *(required)*     | Shared secret required on every HTTP request                     |
| `AUTH_DIR`       | `./auth_info`    | Where Baileys persists credentials                               |
| `PAIRING_NUMBER` | *(empty → QR)*   | Phone number for pairing-code login                              |
| `LOG_LEVEL`      | `info`           | `trace` / `debug` / `info` / `warn` / `error`                    |
| `BOT_ALLOWLIST`  | *(empty → all)*  | Comma-separated JIDs allowed to trigger bot commands             |

## Operational notes

- **Use a dedicated number.** Unofficial WhatsApp clients carry a non-zero ban
  risk; never connect a number you can't afford to lose. For production
  outbound at scale, migrate to the WhatsApp Cloud API.
- **Avoid serverless.** The socket is a long-lived WebSocket that needs to stay
  open. Deploy as a regular Node process (VPS / container), not on Vercel /
  Lambda / Edge.
- **Back up `auth_info/`.** Losing the folder means re-pairing the device.
- **Rate-limit your own sends.** WhatsApp will ban aggressive senders; cap
  outbound throughput in the calling code.
