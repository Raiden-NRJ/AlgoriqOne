import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { DetailPage } from '@/components/page/page-template';
import { INDUSTRY_PAGES, INDUSTRY_IDS, type IndustryId } from '@/content/pages-solutions';
import { INDUSTRY_SEO } from '@/content/seo';

type Params = { industry: string };

export function generateStaticParams() {
  return INDUSTRY_IDS.map((industry) => ({ industry }));
}

export const dynamicParams = false;

function resolve(industry: string) {
  return INDUSTRY_IDS.includes(industry as IndustryId)
    ? INDUSTRY_PAGES[industry as IndustryId]
    : null;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { industry } = await params;
  const seo = INDUSTRY_SEO[industry];
  if (!seo) return {};
  return {
    title: seo.title,
    description: seo.description,
    alternates: { canonical: `/solutions/${industry}` },
  };
}

export default async function IndustryPage({ params }: { params: Promise<Params> }) {
  const { industry } = await params;
  const content = resolve(industry);
  if (!content) notFound();
  return <DetailPage content={content} />;
}
