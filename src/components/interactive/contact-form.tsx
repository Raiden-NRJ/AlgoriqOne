'use client';

/**
 * Contact form (docs/08 §3.2).
 *
 *  - Progressive disclosure: work email first; the rest appears once it validates.
 *  - Real <label> on every field, correct autocomplete, errors linked with
 *    aria-describedby and announced through a live region.
 *  - Honeypot instead of a CAPTCHA — a CAPTCHA costs conversion and is an
 *    accessibility burden, and we have no observed abuse to justify one.
 *  - Failure states are honest and preserve what you typed.
 */

import { useId, useState } from 'react';
import { ArrowRight, Check, Loader2 } from 'lucide-react';

type Status = 'idle' | 'submitting' | 'success' | 'error';

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export function ContactForm() {
  const ids = {
    email: useId(),
    name: useId(),
    company: useId(),
    message: useId(),
    consent: useId(),
  };

  const [values, setValues] = useState({
    email: '',
    name: '',
    company: '',
    message: '',
    consent: false,
    website: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<Status>('idle');
  const [notice, setNotice] = useState('');

  const emailValid = EMAIL.test(values.email.trim());
  const expanded = emailValid;

  const set = (key: keyof typeof values, value: string | boolean) => {
    setValues((v) => ({ ...v, [key]: value }));
    setErrors(({ [key]: _removed, ...rest }) => rest);
  };

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();

    const next: Record<string, string> = {};
    if (!values.name.trim()) next.name = 'Tell us your name.';
    if (!emailValid) next.email = 'That email address looks incomplete.';
    if (!values.message.trim()) next.message = 'Tell us what you are trying to do.';
    if (!values.consent) next.consent = 'We need your permission to reply.';

    if (Object.keys(next).length > 0) {
      setErrors(next);
      setStatus('error');
      setNotice('Some fields need attention.');
      return;
    }

    setStatus('submitting');
    setNotice('');

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      });
      const body = (await res.json()) as {
        success: boolean;
        message?: string;
        errors?: Record<string, string>;
      };

      if (body.success) {
        setStatus('success');
        setNotice(body.message ?? 'Got it.');
        return;
      }

      setErrors(body.errors ?? {});
      setStatus('error');
      setNotice(body.message ?? 'Some fields need attention.');
    } catch {
      setStatus('error');
      setNotice('The network dropped that. Your message is still here — try again.');
    }
  }

  if (status === 'success') {
    return (
      <div className="flex flex-col gap-3 rounded-[var(--radius-xl)] border border-[var(--color-success)]/30 bg-[var(--color-success)]/8 p-8">
        <span className="flex items-center gap-2 text-sm font-semibold text-[var(--color-success)]">
          <Check className="size-4" aria-hidden />
          Message sent
        </span>
        <p aria-live="polite" className="text-sm leading-relaxed text-[var(--color-fg-muted)]">
          {notice}
        </p>
        <p className="text-sm leading-relaxed text-[var(--color-fg-muted)]">
          While you wait, the{' '}
          <a
            href="/platform/architecture"
            className="font-medium text-[var(--color-link)] underline decoration-[var(--color-link)]/50 underline-offset-4"
          >
            architecture page
          </a>{' '}
          is the one most people find useful next.
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={onSubmit}
      noValidate
      className="flex flex-col gap-5 rounded-[var(--radius-xl)] border border-[var(--color-border)] bg-[var(--color-surface)] p-6 shadow-[var(--shadow-e1)] sm:p-8"
    >
      <Field
        id={ids.email}
        label="Work email"
        type="email"
        autoComplete="email"
        value={values.email}
        error={errors.email}
        onChange={(v) => set('email', v)}
      />

      {expanded ? (
        <>
          <Field
            id={ids.name}
            label="Your name"
            autoComplete="name"
            value={values.name}
            error={errors.name}
            onChange={(v) => set('name', v)}
          />
          <Field
            id={ids.company}
            label="Company"
            optional
            autoComplete="organization"
            value={values.company}
            onChange={(v) => set('company', v)}
          />
          <Field
            id={ids.message}
            label="What are you trying to do?"
            textarea
            value={values.message}
            error={errors.message}
            onChange={(v) => set('message', v)}
          />

          <div className="flex flex-col gap-1.5">
            <label htmlFor={ids.consent} className="flex items-start gap-2.5 text-sm">
              <input
                id={ids.consent}
                type="checkbox"
                checked={values.consent}
                onChange={(e) => set('consent', e.target.checked)}
                aria-describedby={errors.consent ? `${ids.consent}-error` : undefined}
                className="mt-0.5 size-4 accent-[var(--color-brand-600)]"
              />
              <span className="text-[var(--color-fg-muted)]">
                You may use these details to reply to me. Nothing else, and no marketing list unless
                I ask.
              </span>
            </label>
            {errors.consent ? (
              <p id={`${ids.consent}-error`} className="text-xs text-[var(--color-danger)]">
                {errors.consent}
              </p>
            ) : null}
          </div>
        </>
      ) : (
        <p className="text-sm text-[var(--color-fg-subtle)]">
          Enter a work email and the rest of the form appears. Four fields, not eleven.
        </p>
      )}

      {/* Honeypot — visually hidden, never announced, never focusable. */}
      <div aria-hidden className="hidden">
        <label htmlFor="website">Website</label>
        <input
          id="website"
          name="website"
          tabIndex={-1}
          autoComplete="off"
          value={values.website}
          onChange={(e) => set('website', e.target.value)}
        />
      </div>

      <div className="flex flex-wrap items-center gap-4">
        <button
          type="submit"
          disabled={status === 'submitting'}
          className="inline-flex items-center justify-center gap-2 rounded-full bg-[var(--color-action)] px-6 py-3 text-sm font-medium text-white shadow-[var(--shadow-e2)] transition-colors hover:bg-[var(--color-action-hover)] disabled:opacity-60"
        >
          {status === 'submitting' ? (
            <>
              <Loader2 className="size-4 animate-spin" aria-hidden />
              Sending
            </>
          ) : (
            <>
              Send message
              <ArrowRight className="size-4" aria-hidden />
            </>
          )}
        </button>

        <p
          aria-live="polite"
          className={`text-sm ${status === 'error' ? 'text-[var(--color-danger)]' : 'text-[var(--color-fg-subtle)]'}`}
        >
          {notice}
        </p>
      </div>
    </form>
  );
}

function Field({
  id,
  label,
  value,
  onChange,
  error,
  type = 'text',
  autoComplete,
  textarea,
  optional,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  type?: string;
  autoComplete?: string;
  textarea?: boolean;
  optional?: boolean;
}) {
  const describedBy = error ? `${id}-error` : undefined;
  const classes =
    'w-full rounded-[var(--radius-md)] border bg-[var(--color-bg)] px-3.5 py-2.5 text-sm transition-colors focus-visible:border-[var(--color-action)]';
  const border = error ? 'border-[var(--color-danger)]' : 'border-[var(--color-border-strong)]';

  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-sm font-medium">
        {label}
        {optional ? (
          <span className="ml-1.5 font-normal text-[var(--color-fg-subtle)]">optional</span>
        ) : null}
      </label>
      {textarea ? (
        <textarea
          id={id}
          rows={4}
          value={value}
          aria-describedby={describedBy}
          aria-invalid={Boolean(error)}
          onChange={(e) => onChange(e.target.value)}
          className={`${classes} ${border} resize-y`}
        />
      ) : (
        <input
          id={id}
          type={type}
          value={value}
          autoComplete={autoComplete}
          aria-describedby={describedBy}
          aria-invalid={Boolean(error)}
          onChange={(e) => onChange(e.target.value)}
          className={`${classes} ${border}`}
        />
      )}
      {error ? (
        <p id={describedBy} className="text-xs text-[var(--color-danger)]">
          {error}
        </p>
      ) : null}
    </div>
  );
}
