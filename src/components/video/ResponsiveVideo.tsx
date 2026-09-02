'use client';

/**
 * A responsive, token-styled video box with three entry points.
 *
 * The problem it solves: a bare <video> with no width cap fills whatever box it
 * is dropped into, so a 1080p asset in a full-width section becomes a wall.
 * Every variant here is capped by a Tailwind `max-w-*` step and centred, so the
 * asset scales down with the viewport and never past its ceiling.
 *
 *  - `ResponsiveVideo` — the full-featured one: play/pause + mute, keyboard
 *    reachable, no browser chrome.
 *  - `SimpleVideo`     — a decorative muted loop, no controls, no state.
 *  - `VideoWithRatio`  — `ResponsiveVideo` with a caller-supplied aspect ratio.
 *
 * Conventions this file is bound by (CLAUDE.md):
 *  - Rule 8 — every colour, radius and shadow is a token; no hex, no literals.
 *  - Rule 5 — `prefers-reduced-motion` suppresses autoplay, and the controls
 *    are real <button>s so there is always a keyboard path. The global
 *    `:focus-visible` rule in globals.css supplies the ring.
 *  - Rule 6 — the markup is complete without JavaScript. With JS off the
 *    poster paints and the overlay simply never mounts; the native `controls`
 *    bar is never added, so a JS-less visitor gets a poster rather than a
 *    half-working player.
 *  - The `min-w-0` note — the wrapper carries it, because a video in a grid or
 *    flex column otherwise drags the track to its intrinsic width.
 */

import { useCallback, useEffect, useRef, useState } from 'react';
import { Pause, Play, Volume2, VolumeX } from 'lucide-react';

const REDUCED_MOTION = '(prefers-reduced-motion: reduce)';

/**
 * Width ceilings. Written as complete class strings and never interpolated —
 * Tailwind scans source text, so a built-up `max-w-${x}` would not be emitted.
 */
const WIDTHS = {
  /** 28rem / 448px — sidebars and cards. */
  sm: 'max-w-md',
  /** 56rem / 896px — feature sections. The default. */
  md: 'max-w-4xl',
  /** 72rem / 1152px — featured, near-full-width video. */
  lg: 'max-w-6xl',
  /** No ceiling — full-bleed and hero use. */
  full: 'max-w-full',
} as const;

const RADII = {
  lg: 'rounded-[var(--radius-lg)]',
  xl: 'rounded-[var(--radius-xl)]',
  none: 'rounded-none',
} as const;

const FITS = {
  /** Letterbox: the whole frame is visible, bars fill the remainder. */
  contain: 'object-contain',
  /** Fill: the box is covered and the frame is cropped. */
  cover: 'object-cover',
} as const;

export type VideoWidth = keyof typeof WIDTHS;
export type VideoRadius = keyof typeof RADII;
export type VideoFit = keyof typeof FITS;

/**
 * The reserved box. A ratio is set on the wrapper rather than left to the
 * asset's intrinsic size so that poster, first frame and final frame all
 * occupy the same rectangle — playback cannot shift the layout.
 */
const DEFAULT_RATIO = '16 / 9';

export interface ResponsiveVideoProps {
  /** Source URL, e.g. `/videos/demo.mp4`. */
  src: string;
  /** Optional source tried before `src` — list the smaller file here. */
  webmSrc?: string;
  /** Poster frame. Strongly recommended: it is what paints before playback. */
  poster?: string;
  /** Width ceiling. `md` (896px) is the feature-section size. */
  width?: VideoWidth;
  /** Render the play/pause and mute overlay. */
  showControls?: boolean;
  /** Begin playback on mount. Suppressed under `prefers-reduced-motion`. */
  autoPlay?: boolean;
  /** How the frame fills the reserved box. */
  objectFit?: VideoFit;
  /** Corner radius token. */
  roundedSize?: VideoRadius;
  /** Apply the e3 elevation token. */
  shadow?: boolean;
  /** Loop playback. */
  loop?: boolean;
  /** Start muted. Autoplay only survives a browser policy when muted. */
  muted?: boolean;
  /**
   * Accessible name. Omit *only* when the video is decorative and its meaning
   * is carried by adjacent text — it is then marked `aria-hidden` (rule 5: a
   * <video> is not a text alternative).
   */
  label?: string;
  /** CSS aspect ratio for the reserved box, e.g. `"4 / 3"`. Defaults to 16:9. */
  aspectRatio?: string;
  /** Extra classes on the outer wrapper. */
  className?: string;
}

export function ResponsiveVideo({
  src,
  webmSrc,
  poster,
  width = 'md',
  showControls = true,
  autoPlay = false,
  objectFit = 'contain',
  roundedSize = 'xl',
  shadow = true,
  loop = false,
  muted,
  label,
  aspectRatio = DEFAULT_RATIO,
  className = '',
}: ResponsiveVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null);

  /*
    An autoplaying video must start muted or the browser will refuse to play
    it. An explicit `muted` prop always wins; otherwise it follows `autoPlay`.
  */
  const initiallyMuted = muted ?? autoPlay;

  const [playing, setPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(initiallyMuted);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const query = window.matchMedia(REDUCED_MOTION);
    const sync = () => setReducedMotion(query.matches);
    sync();
    query.addEventListener('change', sync);
    return () => query.removeEventListener('change', sync);
  }, []);

  /*
    The button labels track the element, not the last click: a video can also
    be paused by reaching its end, by the media keys, or by a platform that
    forces its own controls. Mirroring the events is the only way the icon
    cannot go out of sync with what is actually happening.
  */
  useEffect(() => {
    const node = videoRef.current;
    if (!node) return;

    const onPlay = () => setPlaying(true);
    const onPause = () => setPlaying(false);
    const onVolume = () => setIsMuted(node.muted);

    node.addEventListener('play', onPlay);
    node.addEventListener('pause', onPause);
    node.addEventListener('ended', onPause);
    node.addEventListener('volumechange', onVolume);

    // The element may already be playing by the time this attaches.
    setPlaying(!node.paused);
    setIsMuted(node.muted);

    return () => {
      node.removeEventListener('play', onPlay);
      node.removeEventListener('pause', onPause);
      node.removeEventListener('ended', onPause);
      node.removeEventListener('volumechange', onVolume);
    };
  }, []);

  /*
    Reduced motion is a *downgrade*, applied after mount: if the preference is
    set and the server rendered an autoplaying element, pause it and return to
    the poster. Rule 5 — no CSS query can stop a <video autoplay>.
  */
  useEffect(() => {
    const node = videoRef.current;
    if (!node || !reducedMotion) return;
    node.pause();
    node.currentTime = 0;
  }, [reducedMotion]);

  const togglePlay = useCallback(() => {
    const node = videoRef.current;
    if (!node) return;
    if (node.paused) {
      // play() rejects when the browser blocks it; the poster is already the
      // correct picture, so there is nothing to recover.
      void node.play().catch(() => {});
    } else {
      node.pause();
    }
  }, []);

  const toggleMute = useCallback(() => {
    const node = videoRef.current;
    if (!node) return;
    node.muted = !node.muted;
    setIsMuted(node.muted);
  }, []);

  const frame = [
    'relative w-full min-w-0 overflow-hidden',
    RADII[roundedSize],
    'border border-[var(--color-border)] bg-[var(--color-band)]',
    shadow ? 'shadow-[var(--shadow-e3)]' : '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={`mx-auto w-full min-w-0 ${WIDTHS[width]} ${className}`.trim()}>
      <div className={frame} style={{ aspectRatio }}>
        <video
          ref={videoRef}
          {...(label ? { 'aria-label': label } : { 'aria-hidden': true })}
          poster={poster}
          loop={loop}
          muted={initiallyMuted}
          playsInline
          autoPlay={autoPlay}
          preload={poster ? 'metadata' : 'auto'}
          className={`h-full w-full ${FITS[objectFit]}`}
        >
          {webmSrc ? <source src={webmSrc} type="video/webm" /> : null}
          <source src={src} type="video/mp4" />
        </video>

        {showControls ? (
          /*
            An overlay rather than the native `controls` bar: the native bar is
            unstyleable, differs per browser, and squares off a rounded corner.
            Both buttons are real <button>s, so they are in the tab order and
            the global :focus-visible ring applies.

            `pointer-events-none` on the strip with `pointer-events-auto` on the
            buttons keeps the rest of the frame clickable-through.
          */
          <div className="pointer-events-none absolute inset-x-0 bottom-0 flex items-center gap-2 p-3">
            <ControlButton
              onClick={togglePlay}
              label={playing ? 'Pause video' : 'Play video'}
              pressed={playing}
            >
              {playing ? (
                <Pause className="size-4" aria-hidden />
              ) : (
                <Play className="size-4" aria-hidden />
              )}
            </ControlButton>

            <ControlButton
              onClick={toggleMute}
              label={isMuted ? 'Unmute video' : 'Mute video'}
              pressed={!isMuted}
            >
              {isMuted ? (
                <VolumeX className="size-4" aria-hidden />
              ) : (
                <Volume2 className="size-4" aria-hidden />
              )}
            </ControlButton>
          </div>
        ) : null}
      </div>
    </div>
  );
}

interface ControlButtonProps {
  onClick: () => void;
  label: string;
  pressed: boolean;
  children: React.ReactNode;
}

/**
 * Band tokens, not surface tokens: these sit on footage, and the light surface
 * ramp does not survive that. `--color-band-fg` is the 7.9:1 pairing against
 * `--color-band` (globals.css §2.11).
 */
function ControlButton({ onClick, label, pressed, children }: ControlButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      aria-pressed={pressed}
      className="pointer-events-auto inline-flex size-9 items-center justify-center rounded-full border border-[var(--color-band-border)] bg-[color-mix(in_srgb,var(--color-band)_70%,transparent)] text-[var(--color-band-fg)] backdrop-blur-sm transition-colors duration-[var(--duration-lift)] ease-[var(--ease-out-quint)] hover:bg-[var(--color-band-surface)]"
    >
      {children}
    </button>
  );
}

/**
 * A decorative loop: muted, looping, no controls, no state. Use where the
 * video carries no information the surrounding copy does not already carry.
 */
export function SimpleVideo({
  objectFit = 'cover',
  ...props
}: Omit<ResponsiveVideoProps, 'showControls' | 'autoPlay' | 'loop' | 'muted'>) {
  return (
    <ResponsiveVideo
      {...props}
      objectFit={objectFit}
      showControls={false}
      autoPlay
      loop
      muted
    />
  );
}

/**
 * `ResponsiveVideo` with a caller-supplied ratio, for assets that are not 16:9.
 * Pass the CSS form: `"4 / 3"`, `"960 / 820"`, `"1 / 1"`.
 */
export function VideoWithRatio({
  aspectRatio,
  ...props
}: ResponsiveVideoProps & { aspectRatio: string }) {
  return <ResponsiveVideo {...props} aspectRatio={aspectRatio} />;
}
