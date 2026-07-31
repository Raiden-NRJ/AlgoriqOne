'use client';

/**
 * Entrance wrapper — the "Rise" motion pattern (docs/09 §2).
 *
 * Rules encoded here:
 *  - Content is visible by default; the "before" state is only applied once JS
 *    confirms it can run, so a failed observer never leaves a blank section.
 *  - Fires once, then unobserves. Re-animating on scroll-back is the classic
 *    cheap-site tell.
 *  - Elements already past centre on first observation skip straight to the end
 *    state, so fast scrollers never see a late animation.
 *  - Reduced motion: the class does nothing (handled in globals.css).
 */

import { useEffect, useRef, useState, type ReactNode } from 'react';
import { cn } from './primitives';

export function Reveal({
  children,
  delay = 0,
  className,
  as: Tag = 'div',
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
  as?: 'div' | 'li' | 'section';
}) {
  const ref = useRef<HTMLElement>(null);
  const [armed, setArmed] = useState(false);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) {
      setShown(true);
      return;
    }

    // Already above the fold or scrolled past — no animation, just show it.
    const rect = node.getBoundingClientRect();
    if (rect.top < window.innerHeight * 0.6) {
      setShown(true);
      return;
    }

    setArmed(true);
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          setShown(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.2, rootMargin: '0px 0px -8% 0px' },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <Tag
      ref={ref as never}
      style={delay ? { transitionDelay: `${delay}ms` } : undefined}
      className={cn(armed && 'reveal', armed && shown && 'reveal-in', className)}
    >
      {children}
    </Tag>
  );
}
