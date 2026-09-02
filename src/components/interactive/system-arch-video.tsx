'use client';

import { useEffect, useState } from 'react';

const VIDEO_SRC = '/media/Software_integration_system_arch%E2%80%A6_1080p_202608090252.mp4';
const REDUCED_MOTION = '(prefers-reduced-motion: reduce)';

export function SystemArchVideo() {
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia(REDUCED_MOTION);
    setReducedMotion(mediaQuery.matches);

    const handleChange = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  return (
    <div className="min-w-0 w-full overflow-hidden rounded-[var(--radius-xl)] border border-[var(--color-border)] bg-black shadow-[var(--shadow-e3)]">
      <video
        aria-label="Software integration system architecture flow chart animation"
        muted
        playsInline
        loop
        autoPlay={!reducedMotion}
        preload="auto"
        className="w-full h-auto block object-contain rounded-[var(--radius-xl)]"
      >
        <source src={VIDEO_SRC} type="video/mp4" />
        <p className="p-4 text-xs text-[var(--color-band-fg-muted)]">
          System integration architecture animation video.
        </p>
      </video>
    </div>
  );
}
