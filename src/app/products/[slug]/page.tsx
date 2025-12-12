import { permanentRedirect } from 'next/navigation';

export default async function LegacyProductRedirect({
  params,
}: {
  params: { slug: string };
}) {
  permanentRedirect(`/shop/${params.slug}`);
}
