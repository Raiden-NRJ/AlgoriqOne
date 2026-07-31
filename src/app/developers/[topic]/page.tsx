import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { DetailPage } from '@/components/page/page-template';
import {
  DEVELOPER_PAGES,
  DEVELOPER_PAGE_IDS,
  type DeveloperPageId,
} from '@/content/pages-developers';
import { DEVELOPER_SEO } from '@/content/seo';

type Params = { topic: string };

export function generateStaticParams() {
  return DEVELOPER_PAGE_IDS.map((topic) => ({ topic }));
}

export const dynamicParams = false;

function resolve(topic: string) {
  return DEVELOPER_PAGE_IDS.includes(topic as DeveloperPageId)
    ? DEVELOPER_PAGES[topic as DeveloperPageId]
    : null;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { topic } = await params;
  const seo = DEVELOPER_SEO[topic];
  if (!seo) return {};
  return {
    title: seo.title,
    description: seo.description,
    alternates: { canonical: `/developers/${topic}` },
  };
}

export default async function DeveloperTopicPage({ params }: { params: Promise<Params> }) {
  const { topic } = await params;
  const content = resolve(topic);
  if (!content) notFound();
  return <DetailPage content={content} />;
}
