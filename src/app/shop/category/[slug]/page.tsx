import { permanentRedirect } from 'next/navigation';

export default function ShopCategoryRedirect({ params }: { params: { slug: string } }) {
  permanentRedirect(`/shop?category=${encodeURIComponent(params.slug)}`);
}
