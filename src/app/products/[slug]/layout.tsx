import { permanentRedirect } from 'next/navigation';

export default function Layout({
  params,
}: {
  params: { slug: string };
}) {
  permanentRedirect(`/shop/${params.slug}`);
}
