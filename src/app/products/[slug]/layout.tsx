import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { WooCommerceService } from "@/lib/services/woocommerceService";

// Generate metadata for dynamic product pages
export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  try {
    const product = await WooCommerceService.getProductBySlug(params.slug);
    
    if (!product) {
      return {
        title: "Product Not Found | Whole Lot of Nature",
      };
    }

    const description = product.short_description?.replace(/<[^>]*>/g, '').substring(0, 160) || 
                       product.description?.replace(/<[^>]*>/g, '').substring(0, 160) ||
                       `Buy premium ${product.name} online. Fast delivery across India.`;
    
    const imageUrl = product.images?.[0]?.src || "/og-cover.jpg";

    return {
      title: `${product.name} | Buy Online | Whole Lot of Nature`,
      description: description,
      keywords: `${product.name}, buy plants, gardening, ${product.categories?.[0]?.name || "products"}`,
      openGraph: {
        title: `${product.name} - Premium Quality`,
        description: description,
        type: "website" as const,
        url: `https://wholelotofnature.com/products/${params.slug}`,
        images: [
          {
            url: imageUrl,
            width: 800,
            height: 800,
            alt: product.name,
          },
        ],
      },
      twitter: {
        card: "summary_large_image",
        title: `${product.name}`,
        description: description,
        images: [imageUrl],
      },
      alternates: {
        canonical: `https://wholelotofnature.com/products/${params.slug}`,
      },
    };
  } catch (error) {
    console.error("Error generating product metadata:", error);
    return {
      title: "Product | Whole Lot of Nature",
    };
  }
}

// Generate static parameters for popular products
export async function generateStaticParams() {
  try {
    const products = await WooCommerceService.getProducts(10);
    return products.map((product) => ({
      slug: product.slug,
    }));
  } catch (error) {
    console.error("Error generating static params:", error);
    return [];
  }
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
