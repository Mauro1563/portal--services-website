/**
 * Client-side asset generators for the Owner → Marketing demo.
 *
 * Each exported function builds an SVG string, wraps it in a Blob, and returns
 * it. Callers are responsible for triggering the download (see the
 * `downloadAsset` helper in page.tsx).
 *
 * Why SVG instead of PNG/PDF?
 *  - Zero dependencies, no canvas plumbing, works in any browser.
 *  - Crisp at any resolution — users can print A5 at 300dpi or scale up for
 *    Instagram with no loss.
 *  - Self-contained: no external requests at download time.
 *
 * The brand assumes the public demo URL (alan-cleaners-demo). When this is
 * generalised for real owners, swap in the owner's brand/contact data.
 */

const BRAND_URL = 'portalservices.digital/c/alan-cleaners-demo';
const BRAND_NAME = 'Alan Cleaners';

function svgBlob(svg: string): Blob {
  return new Blob([svg], { type: 'image/svg+xml;charset=utf-8' });
}

/**
 * Build a deterministic QR-like grid pattern. Not a real QR (no encoding), but
 * visually convincing as a placeholder and entirely self-contained (no remote
 * request at download time). Includes the three position-detection squares.
 */
function qrPattern(size: number, modules = 25, seed = 1337): string {
  const cell = size / modules;
  const rects: string[] = [];

  // Pseudo-random fill based on a simple LCG seeded with `seed`.
  let s = seed;
  const rand = () => {
    s = (s * 1664525 + 1013904223) % 0x100000000;
    return s / 0x100000000;
  };

  const inFinder = (x: number, y: number) => {
    const inBox = (x0: number, y0: number) =>
      x >= x0 && x < x0 + 7 && y >= y0 && y < y0 + 7;
    return inBox(0, 0) || inBox(modules - 7, 0) || inBox(0, modules - 7);
  };

  for (let y = 0; y < modules; y += 1) {
    for (let x = 0; x < modules; x += 1) {
      if (inFinder(x, y)) continue;
      if (rand() > 0.5) {
        rects.push(
          `<rect x="${(x * cell).toFixed(2)}" y="${(y * cell).toFixed(2)}" width="${cell.toFixed(2)}" height="${cell.toFixed(2)}"/>`,
        );
      }
    }
  }

  // Position detection patterns (top-left, top-right, bottom-left).
  const finder = (x0: number, y0: number) => {
    const outer = cell * 7;
    const inner = cell * 5;
    const dot = cell * 3;
    return `
      <rect x="${(x0 * cell).toFixed(2)}" y="${(y0 * cell).toFixed(2)}" width="${outer.toFixed(2)}" height="${outer.toFixed(2)}" fill="#0f172a"/>
      <rect x="${((x0 + 1) * cell).toFixed(2)}" y="${((y0 + 1) * cell).toFixed(2)}" width="${inner.toFixed(2)}" height="${inner.toFixed(2)}" fill="#ffffff"/>
      <rect x="${((x0 + 2) * cell).toFixed(2)}" y="${((y0 + 2) * cell).toFixed(2)}" width="${dot.toFixed(2)}" height="${dot.toFixed(2)}" fill="#0f172a"/>
    `;
  };

  return `
    <g fill="#0f172a">${rects.join('')}</g>
    ${finder(0, 0)}
    ${finder(modules - 7, 0)}
    ${finder(0, modules - 7)}
  `;
}

/** A5 flyer (148×210mm). viewBox uses A5 ratio so renderers/printers scale cleanly. */
export function generateFlyerA5Svg(): string {
  const W = 595;
  const H = 842;
  const qrSize = 180;
  const qrX = (W - qrSize) / 2;
  const qrY = 560;

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}">
  <defs>
    <linearGradient id="hero" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#1e3a8a"/>
      <stop offset="100%" stop-color="#06b6d4"/>
    </linearGradient>
    <linearGradient id="cardGrad" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#ffffff"/>
      <stop offset="100%" stop-color="#f8fafc"/>
    </linearGradient>
  </defs>

  <!-- Background -->
  <rect width="${W}" height="${H}" fill="#f8fafc"/>

  <!-- Hero band -->
  <rect width="${W}" height="360" fill="url(#hero)"/>

  <!-- Eyebrow -->
  <text x="40" y="70" font-family="Helvetica, Arial, sans-serif" font-size="13" font-weight="700" fill="#bae6fd" letter-spacing="3">CLEANING SERVICE · LONDON</text>

  <!-- Title -->
  <text x="40" y="130" font-family="Helvetica, Arial, sans-serif" font-size="32" font-weight="800" fill="#ffffff">${BRAND_NAME}</text>
  <text x="40" y="170" font-family="Helvetica, Arial, sans-serif" font-size="22" font-weight="700" fill="#ffffff">Limpiezas profesionales</text>
  <text x="40" y="198" font-family="Helvetica, Arial, sans-serif" font-size="22" font-weight="700" fill="#ffffff">en Londres</text>

  <!-- Tagline -->
  <text x="40" y="250" font-family="Helvetica, Arial, sans-serif" font-size="14" fill="#e0f2fe">Reserva online en 30 segundos · Pago seguro</text>

  <!-- Decorative dots -->
  <circle cx="510" cy="80" r="48" fill="#ffffff" fill-opacity="0.08"/>
  <circle cx="540" cy="180" r="22" fill="#ffffff" fill-opacity="0.12"/>

  <!-- Services row -->
  <g font-family="Helvetica, Arial, sans-serif" text-anchor="middle">
    <!-- Card 1 -->
    <rect x="30" y="395" width="170" height="130" rx="14" fill="url(#cardGrad)" stroke="#e2e8f0"/>
    <text x="115" y="430" font-size="12" font-weight="700" fill="#64748b" letter-spacing="2">ESTÁNDAR</text>
    <text x="115" y="475" font-size="34" font-weight="800" fill="#0f172a">£45</text>
    <text x="115" y="500" font-size="11" fill="#64748b">Limpieza regular</text>

    <!-- Card 2 -->
    <rect x="212" y="395" width="170" height="130" rx="14" fill="url(#cardGrad)" stroke="#e2e8f0"/>
    <text x="297" y="430" font-size="12" font-weight="700" fill="#1d4ed8" letter-spacing="2">PROFUNDA</text>
    <text x="297" y="475" font-size="34" font-weight="800" fill="#0f172a">£95</text>
    <text x="297" y="500" font-size="11" fill="#64748b">A fondo, fin de tenencia</text>

    <!-- Card 3 -->
    <rect x="394" y="395" width="170" height="130" rx="14" fill="url(#cardGrad)" stroke="#e2e8f0"/>
    <text x="479" y="430" font-size="12" font-weight="700" fill="#0e7490" letter-spacing="2">CRISTALES</text>
    <text x="479" y="475" font-size="34" font-weight="800" fill="#0f172a">£65</text>
    <text x="479" y="500" font-size="11" fill="#64748b">Ventanas interior/exterior</text>
  </g>

  <!-- QR section -->
  <rect x="${qrX - 14}" y="${qrY - 14}" width="${qrSize + 28}" height="${qrSize + 28}" rx="14" fill="#ffffff" stroke="#e2e8f0"/>
  <svg x="${qrX}" y="${qrY}" width="${qrSize}" height="${qrSize}" viewBox="0 0 ${qrSize} ${qrSize}">
    ${qrPattern(qrSize)}
  </svg>

  <text x="${W / 2}" y="${qrY + qrSize + 50}" text-anchor="middle" font-family="Helvetica, Arial, sans-serif" font-size="13" font-weight="700" fill="#0f172a">Escanea para reservar</text>

  <!-- Footer URL -->
  <rect x="0" y="${H - 60}" width="${W}" height="60" fill="#0f172a"/>
  <text x="${W / 2}" y="${H - 24}" text-anchor="middle" font-family="Helvetica, Arial, sans-serif" font-size="14" font-weight="700" fill="#ffffff">${BRAND_URL}</text>
</svg>`;
}

/** Business card front (85×55mm landscape). */
export function generateBusinessCardSvg(): string {
  const W = 502;
  const H = 325;
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}">
  <defs>
    <linearGradient id="logoBg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#06b6d4"/>
      <stop offset="100%" stop-color="#1e3a8a"/>
    </linearGradient>
  </defs>

  <!-- Card background -->
  <rect width="${W}" height="${H}" fill="#ffffff"/>
  <rect x="0" y="0" width="${W}" height="6" fill="url(#logoBg)"/>

  <!-- Logo monogram -->
  <circle cx="56" cy="58" r="32" fill="url(#logoBg)"/>
  <text x="56" y="68" text-anchor="middle" font-family="Helvetica, Arial, sans-serif" font-size="22" font-weight="800" fill="#ffffff">AC</text>

  <!-- Brand name -->
  <text x="100" y="56" font-family="Helvetica, Arial, sans-serif" font-size="24" font-weight="800" fill="#0f172a">${BRAND_NAME}</text>
  <text x="100" y="78" font-family="Helvetica, Arial, sans-serif" font-size="12" fill="#64748b">Servicios de limpieza · Londres</text>

  <!-- Divider -->
  <line x1="32" y1="130" x2="${W - 32}" y2="130" stroke="#e2e8f0"/>

  <!-- Contact block -->
  <text x="32" y="170" font-family="Helvetica, Arial, sans-serif" font-size="11" font-weight="700" fill="#64748b" letter-spacing="2">CONTACTO</text>
  <text x="32" y="198" font-family="Helvetica, Arial, sans-serif" font-size="14" font-weight="600" fill="#0f172a">+44 7700 900 000</text>
  <text x="32" y="220" font-family="Helvetica, Arial, sans-serif" font-size="14" font-weight="600" fill="#0f172a">hola@alancleaners.co.uk</text>

  <!-- Footer URL -->
  <rect x="0" y="${H - 44}" width="${W}" height="44" fill="#0f172a"/>
  <text x="${W / 2}" y="${H - 17}" text-anchor="middle" font-family="Helvetica, Arial, sans-serif" font-size="12" font-weight="700" fill="#ffffff">${BRAND_URL}</text>
</svg>`;
}

/** Instagram square (1080×1080). */
export function generateInstagramSquareSvg(): string {
  const S = 1080;

  // Subtle dot-pattern overlay.
  const dots: string[] = [];
  for (let y = 30; y < S; y += 60) {
    for (let x = 30; x < S; x += 60) {
      dots.push(`<circle cx="${x}" cy="${y}" r="2" fill="#ffffff" fill-opacity="0.08"/>`);
    }
  }

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${S} ${S}" width="${S}" height="${S}">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#1e3a8a"/>
      <stop offset="100%" stop-color="#06b6d4"/>
    </linearGradient>
  </defs>

  <!-- Full-bleed gradient -->
  <rect width="${S}" height="${S}" fill="url(#bg)"/>

  <!-- Decorative dot pattern -->
  ${dots.join('')}

  <!-- Decorative blobs -->
  <circle cx="${S - 80}" cy="120" r="120" fill="#ffffff" fill-opacity="0.08"/>
  <circle cx="120" cy="${S - 140}" r="180" fill="#ffffff" fill-opacity="0.06"/>

  <!-- Eyebrow -->
  <text x="80" y="230" font-family="Helvetica, Arial, sans-serif" font-size="28" font-weight="700" fill="#bae6fd" letter-spacing="6">OFERTA DE BIENVENIDA</text>

  <!-- Headline -->
  <text x="80" y="380" font-family="Helvetica, Arial, sans-serif" font-size="120" font-weight="900" fill="#ffffff">30% OFF</text>
  <text x="80" y="480" font-family="Helvetica, Arial, sans-serif" font-size="56" font-weight="700" fill="#ffffff">tu primera limpieza</text>

  <!-- Code chip -->
  <rect x="80" y="560" width="430" height="100" rx="50" fill="#ffffff"/>
  <text x="295" y="605" text-anchor="middle" font-family="Helvetica, Arial, sans-serif" font-size="18" font-weight="700" fill="#64748b" letter-spacing="3">CÓDIGO</text>
  <text x="295" y="640" text-anchor="middle" font-family="Helvetica, Arial, sans-serif" font-size="32" font-weight="800" fill="#0f172a">WELCOME30</text>

  <!-- Brand block -->
  <text x="80" y="${S - 200}" font-family="Helvetica, Arial, sans-serif" font-size="44" font-weight="800" fill="#ffffff">${BRAND_NAME}</text>
  <text x="80" y="${S - 150}" font-family="Helvetica, Arial, sans-serif" font-size="28" fill="#e0f2fe">Limpieza profesional · Londres</text>

  <!-- Footer URL bar -->
  <rect x="0" y="${S - 90}" width="${S}" height="90" fill="#0f172a"/>
  <text x="${S / 2}" y="${S - 35}" text-anchor="middle" font-family="Helvetica, Arial, sans-serif" font-size="32" font-weight="700" fill="#ffffff">alancleaners.co.uk</text>
</svg>`;
}

export async function exportFlyerA5(): Promise<Blob> {
  return svgBlob(generateFlyerA5Svg());
}

export async function exportBusinessCard(): Promise<Blob> {
  return svgBlob(generateBusinessCardSvg());
}

export async function exportInstagramSquare(): Promise<Blob> {
  return svgBlob(generateInstagramSquareSvg());
}

export const ASSET_FILENAMES = {
  flyer: 'alan-cleaners-flyer-A5.svg',
  card: 'alan-cleaners-card.svg',
  instagram: 'alan-cleaners-instagram.svg',
} as const;
