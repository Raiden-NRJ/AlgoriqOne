import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { DetailPage } from '@/components/page/page-template';
import { SECURITY_PAGES, SECURITY_PAGE_IDS, type SecurityPageId } from '@/content/pages-security';
import { SECURITY_SEO } from '@/content/seo';

type Params = { topic: string };

export function generateStaticParams() {
  return SECURITY_PAGE_IDS.map((topic) => ({ topic }));
}

export const dynamicParams = false;

function resolve(topic: string) {
  return SECURITY_PAGE_IDS.includes(topic as SecurityPageId)
    ? SECURITY_PAGES[topic as SecurityPageId]
    : null;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { topic } = await params;
  const seo = SECURITY_SEO[topic];
  if (!seo) return {};
  return {
    title: seo.title,
    description: seo.description,
    alternates: { canonical: `/security/${topic}` },
  };
}

export default async function SecurityTopicPage({ params }: { params: Promise<Params> }) {
  const { topic } = await params;
  const content = resolve(topic);
  if (!content) notFound();
  return <DetailPage content={content} />;
}
