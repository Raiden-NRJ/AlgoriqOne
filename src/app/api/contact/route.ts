/**
 * Contact / lead capture.
 *
 * Forwards to the CRM service when one is configured. When it is not, this
 * returns 503 with a usable fallback rather than a cheerful "thanks!" that
 * silently drops the message — a form that pretends to work is worse than no
 * form (docs/08 §3.2).
 */

import { NextResponse } from 'next/server';
import { CONTACT } from '@/content/site';

const CRM_URL = process.env.CRM_SERVICE_URL;
const LEAD_TENANT_ID = process.env.LEAD_TENANT_ID;
const INTERNAL_AUTH = process.env.INTERNAL_AUTH_SECRET;
const FALLBACK_EMAIL = CONTACT.general;

interface Payload {
  name?: string;
  email?: string;
  company?: string;
  message?: string;
  consent?: boolean;
  /** Honeypot — must be empty. */
  website?: string;
}

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export async function POST(request: Request) {
  let body: Payload;
  try {
    body = (await request.json()) as Payload;
  } catch {
    return NextResponse.json({ success: false, message: 'Malformed request.' }, { status: 400 });
  }

  // Honeypot: a real person never fills this field.
  if (body.website) {
    return NextResponse.json({ success: true, message: 'Thanks.' });
  }

  const errors: Record<string, string> = {};
  if (!body.name?.trim()) errors.name = 'Tell us your name.';
  if (!body.email?.trim()) errors.email = 'We need an email to reply to.';
  else if (!EMAIL.test(body.email.trim())) errors.email = 'That email address looks incomplete.';
  if (!body.message?.trim()) errors.message = 'Tell us what you are trying to do.';
  if (!body.consent) errors.consent = 'We need your permission to reply.';

  if (Object.keys(errors).length > 0) {
    return NextResponse.json({ success: false, errors }, { status: 422 });
  }

  if (!CRM_URL || !LEAD_TENANT_ID) {
    return NextResponse.json(
      {
        success: false,
        message: `We can’t deliver this form right now. Email ${FALLBACK_EMAIL} and we’ll pick it up from there.`,
        fallbackEmail: FALLBACK_EMAIL,
      },
      { status: 503 },
    );
  }

  try {
    const res = await fetch(`${CRM_URL}/api/v1/crm/leads`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-tenant-id': LEAD_TENANT_ID,
        ...(INTERNAL_AUTH ? { 'x-internal-auth': INTERNAL_AUTH } : {}),
      },
      body: JSON.stringify({
        name: body.name?.trim(),
        email: body.email?.trim(),
        company: body.company?.trim() || undefined,
        notes: body.message?.trim(),
        source: 'web',
        status: 'new',
      }),
      signal: AbortSignal.timeout(5000),
    });

    if (!res.ok) throw new Error(`crm responded ${res.status}`);

    return NextResponse.json({
      success: true,
      message: 'Got it. We reply to everything within one business day.',
    });
  } catch {
    return NextResponse.json(
      {
        success: false,
        message: `Something failed on our side. Email ${FALLBACK_EMAIL} and we’ll make sure it lands.`,
        fallbackEmail: FALLBACK_EMAIL,
      },
      { status: 502 },
    );
  }
}
