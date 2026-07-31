import type { Metadata } from 'next';
import { DetailPage } from '@/components/page/page-template';
import { DEVELOPER_OVERVIEW } from '@/content/pages-developers';

export const metadata: Metadata = {
  title: 'Developers — the same gateway our own apps use',
  description:
    'A REST API for every module, a typed SDK, HMAC-signed webhooks, and API keys you rotate yourself. No private API, no waiting on a vendor to expose an endpoint.',
  alternates: { canonical: '/developers' },
};

export default function DevelopersPage() {
  return <DetailPage content={DEVELOPER_OVERVIEW} />;
}
