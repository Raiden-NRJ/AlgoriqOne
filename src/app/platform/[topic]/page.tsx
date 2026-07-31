import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { DetailPage } from '@/components/page/page-template';
import { PLATFORM_PAGES, PLATFORM_PAGE_IDS, type PlatformPageId } from '@/content/pages-platform';
import { PLATFORM_SEO } from '@/content/seo';

type Params = { topic: string };

export function generateStaticParams() {
  return PLATFORM_PAGE_IDS.map((topic) => ({ topic }));
}

export const dynamicParams = false;

function resolve(topic: string) {
  return PLATFORM_PAGE_IDS.includes(topic as PlatformPageId)
    ? PLATFORM_PAGES[topic as PlatformPageId]
    : null;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { topic } = await params;
  const seo = PLATFORM_SEO[topic];
  if (!seo) return {};
  return {
    title: seo.title,
    description: seo.description,
    alternates: { canonical: `/platform/${topic}` },
  };
}

export default async function PlatformTopicPage({ params }: { params: Promise<Params> }) {
  const { topic } = await params;
  const content = resolve(topic);
  if (!content) notFound();
  return <DetailPage content={content} />;
}
