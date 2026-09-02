'use client';

import { useEffect, useState } from 'react';

const VIDEO_SRC = '/media/TypeScript_code_typing_animation_1080p_202608090440_gwr_video_mvp.mp4';

/*
  No window chrome is added here, and that is P6's "CHROME rise 320ms" already
  satisfied rather than skipped: the video has a framed terminal painted into
  it, complete with TypeScript SDK / cURL / Webhook tabs. A title bar was built
  on 2026-09-01 and reverted the same hour — the screenshot showed two nested
  windows, one inside the other. site/illustration.tsx carries a `chrome={false}`
  prop for exactly this case.

  Also not added: the deck's `invoice.created  ok 142ms` status line. That
  latency is invented and nothing measures it, so it stays in the spec document
  and off the page (rule 1 has no decorative exemption).
*/
const REDUCED_MOTION = '(prefers-reduced-motion: reduce)';

interface TerminalVideoProps {
  fallbackCode?: string;
}

export function TerminalVideo({ fallbackCode }: TerminalVideoProps) {
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia(REDUCED_MOTION);
    setReducedMotion(mediaQuery.matches);

    const handleChange = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  return (
    <div className="min-w-0 w-full overflow-hidden rounded-[var(--radius-xl)] border border-[var(--color-band-border)] bg-black shadow-[var(--shadow-e3)]">
      {reducedMotion && fallbackCode ? (
        <pre
          tabIndex={0}
          role="region"
          aria-label="Code sample, scrollable"
          className="overflow-x-auto p-5 font-mono text-[0.8125rem] leading-relaxed text-[var(--color-band-fg-muted)]"
        >
          <code>{fallbackCode}</code>
        </pre>
      ) : (
        <video
          aria-label="TypeScript code typing animation video"
          muted
          playsInline
          loop
          autoPlay={!reducedMotion}
          preload="auto"
          className="w-full h-auto block object-contain rounded-[var(--radius-xl)]"
        >
          <source src={VIDEO_SRC} type="video/mp4" />
          {fallbackCode && (
            <pre className="p-5 font-mono text-xs text-[var(--color-band-fg-muted)]">
              <code>{fallbackCode}</code>
            </pre>
          )}
        </video>
      )}
    </div>
  );
}
