'use client';

import { useEffect } from 'react';

/**
 * Hard-locks the document so iOS cannot rubber-band, scroll, or pan while
 * mounted. Used only on screens that fit entirely in the viewport (login,
 * signup, forgot-password, reset-password, change-password) — never on
 * dashboards that need real scrolling.
 *
 * What it does:
 *   - body & html → position:fixed, overflow:hidden, width/height pinned
 *   - native `touchmove` listener with preventDefault to block any pan that
 *     slips past the CSS touch-action rule
 *   - restores everything when the component unmounts (route change)
 */
export function ScrollLock() {
  useEffect(() => {
    const html = document.documentElement;
    const body = document.body;
    const original = {
      htmlOverflow: html.style.overflow,
      bodyOverflow: body.style.overflow,
      bodyPosition: body.style.position,
      bodyTop: body.style.top,
      bodyLeft: body.style.left,
      bodyWidth: body.style.width,
      bodyHeight: body.style.height,
      scrollY: window.scrollY,
    };

    // Remember scroll position so the document doesn't jump to the top
    // when we re-enable scrolling after unmount.
    body.style.position = 'fixed';
    body.style.top = `-${original.scrollY}px`;
    body.style.left = '0';
    body.style.width = '100%';
    body.style.height = '100%';
    body.style.overflow = 'hidden';
    html.style.overflow = 'hidden';

    // Belt-and-braces: cancel any touchmove that survives the CSS rules.
    const blockTouchMove = (e: TouchEvent) => {
      const target = e.target as HTMLElement | null;
      // Allow text inputs, textareas and scrollable areas (data-scrollable).
      if (
        target &&
        (target.tagName === 'INPUT' ||
          target.tagName === 'TEXTAREA' ||
          target.closest('[data-scrollable="true"]'))
      ) {
        return;
      }
      e.preventDefault();
    };
    document.addEventListener('touchmove', blockTouchMove, { passive: false });

    return () => {
      body.style.overflow = original.bodyOverflow;
      body.style.position = original.bodyPosition;
      body.style.top = original.bodyTop;
      body.style.left = original.bodyLeft;
      body.style.width = original.bodyWidth;
      body.style.height = original.bodyHeight;
      html.style.overflow = original.htmlOverflow;
      window.scrollTo(0, original.scrollY);
      document.removeEventListener('touchmove', blockTouchMove);
    };
  }, []);

  return null;
}
