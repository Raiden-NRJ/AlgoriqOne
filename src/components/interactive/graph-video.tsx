'use client';

import { useEffect, useState } from 'react';
import { SampleDataNote } from '@/components/site/primitives';

const VIDEO_SRC = '/media/Workflow_lines_animating_on_dash%E2%80%A6_202608090330.mp4';
const REDUCED_MOTION = '(prefers-reduced-motion: reduce)';

export function GraphVideo() {
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia(REDUCED_MOTION);
    setReducedMotion(mediaQuery.matches);

    const handleChange = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  return (
    <figure className="flex flex-col gap-3">
      <div className="overflow-hidden rounded-[var(--radius-xl)] border border-[var(--color-border)] bg-black shadow-[var(--shadow-e2)]">
        <video
          aria-label="Workflow graph dashboard animation video"
          muted
          playsInline
          loop
          autoPlay={!reducedMotion}
          preload="auto"
          className="w-full h-auto block object-contain rounded-[var(--radius-xl)]"
        >
          <source src={VIDEO_SRC} type="video/mp4" />
        </video>
      </div>
      <figcaption>
        <SampleDataNote />
      </figcaption>
    </figure>
  );
}
