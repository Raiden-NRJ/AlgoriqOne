'use client';

import { useEffect, useState } from 'react';

const VIDEO_SRC = '/media/TypeScript_code_typing_animation_1080p_202608090440_gwr_video_mvp.mp4';
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
