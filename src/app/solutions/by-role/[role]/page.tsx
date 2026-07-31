import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { DetailPage } from '@/components/page/page-template';
import { ROLE_PAGES, ROLE_IDS, type RoleId } from '@/content/pages-solutions';
import { ROLE_SEO } from '@/content/seo';

type Params = { role: string };

export function generateStaticParams() {
  return ROLE_IDS.map((role) => ({ role }));
}

export const dynamicParams = false;

function resolve(role: string) {
  return ROLE_IDS.includes(role as RoleId) ? ROLE_PAGES[role as RoleId] : null;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { role } = await params;
  const seo = ROLE_SEO[role];
  if (!seo) return {};
  return {
    title: seo.title,
    description: seo.description,
    alternates: { canonical: `/solutions/by-role/${role}` },
  };
}

export default async function RolePage({ params }: { params: Promise<Params> }) {
  const { role } = await params;
  const content = resolve(role);
  if (!content) notFound();
  return <DetailPage content={content} />;
}
