import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const alt = 'Portal Services Digital — Operational OS for facility teams';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          background:
            'radial-gradient(at 20% 20%, rgba(34,211,238,0.18) 0px, transparent 50%), radial-gradient(at 80% 60%, rgba(37,99,235,0.20) 0px, transparent 50%), #0A0F1E',
          fontFamily: 'system-ui, -apple-system, sans-serif',
          padding: '60px 80px',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 24,
            marginBottom: 48,
          }}
        >
          <div
            style={{
              width: 80,
              height: 80,
              borderRadius: 20,
              background: 'linear-gradient(135deg, #22D3EE 0%, #2563EB 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#fff',
              fontSize: 56,
              fontWeight: 800,
              letterSpacing: -2,
            }}
          >
            P
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span
              style={{
                color: '#fff',
                fontSize: 32,
                fontWeight: 600,
                letterSpacing: 6,
                lineHeight: 1,
              }}
            >
              PORTAL SERVICES
            </span>
            <span
              style={{
                color: '#22D3EE',
                fontSize: 24,
                fontWeight: 600,
                letterSpacing: 12,
                marginTop: 6,
              }}
            >
              DIGITAL
            </span>
          </div>
        </div>

        <div
          style={{
            color: '#fff',
            fontSize: 64,
            fontWeight: 700,
            lineHeight: 1.1,
            textAlign: 'center',
            maxWidth: 1000,
            letterSpacing: -1,
          }}
        >
          Replace WhatsApp and Excel
        </div>
        <div
          style={{
            background: 'linear-gradient(90deg, #22D3EE 0%, #2563EB 100%)',
            backgroundClip: 'text',
            color: 'transparent',
            fontSize: 64,
            fontWeight: 700,
            lineHeight: 1.1,
            textAlign: 'center',
            maxWidth: 1000,
            letterSpacing: -1,
            marginTop: 8,
          }}
        >
          with one operational platform.
        </div>

        <div
          style={{
            display: 'flex',
            gap: 16,
            marginTop: 56,
            color: '#94a3b8',
            fontSize: 22,
            letterSpacing: 2,
            textTransform: 'uppercase',
          }}
        >
          <span>One platform.</span>
          <span style={{ color: '#22D3EE' }}>One place.</span>
          <span>Everyone connected.</span>
        </div>
      </div>
    ),
    size,
  );
}
