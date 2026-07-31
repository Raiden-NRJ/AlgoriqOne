import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { DetailPage } from '@/components/page/page-template';
import { PRODUCT_PAGES, PRODUCT_PAGE_IDS } from '@/content/pages-product';
import { PRODUCT_SEO } from '@/content/seo';

type Params = { cluster: string };

export function generateStaticParams() {
  return PRODUCT_PAGE_IDS.map((cluster) => ({ cluster }));
}

export const dynamicParams = false;

function resolve(cluster: string) {
  return PRODUCT_PAGE_IDS.includes(cluster as never)
    ? PRODUCT_PAGES[cluster as keyof typeof PRODUCT_PAGES]
    : null;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { cluster } = await params;
  const seo = PRODUCT_SEO[cluster];
  if (!seo) return {};
  return {
    title: seo.title,
    description: seo.description,
    alternates: { canonical: `/product/${cluster}` },
  };
}

export default async function ProductClusterPage({ params }: { params: Promise<Params> }) {
  const { cluster } = await params;
  const content = resolve(cluster);
  if (!content) notFound();
  return <DetailPage content={content} />;
}
