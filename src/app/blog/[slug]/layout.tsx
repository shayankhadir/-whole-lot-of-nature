import { Metadata } from 'next';
import { getPostBySlug } from '@/lib/api/wordpress';

interface Props {
  params: { slug: string };
  children: React.ReactNode;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://wholelotofnature.com';
  
  try {
    const post = await getPostBySlug(params.slug);
    
    if (!post) {
      return {
        title: 'Blog Post Not Found | Whole Lot of Nature',
        description: 'The blog post you are looking for could not be found.',
      };
    }

    // Clean title and excerpt
    const title = post.title.rendered.replace(/<[^>]+>/g, '');
    const description = post.excerpt.rendered
      .replace(/<[^>]+>/g, '')
      .slice(0, 160)
      .trim() || `Read ${title} on Whole Lot of Nature blog - plant care tips and gardening guides.`;
    
    const featuredImage = post._embedded?.['wp:featuredmedia']?.[0]?.source_url || `${baseUrl}/og-cover.jpg`;
    const postUrl = `${baseUrl}/blog/${params.slug}`;
    const authorName = post._embedded?.author?.[0]?.name || 'Whole Lot of Nature';
    const publishedTime = post.date;
    const modifiedTime = post.modified;

    return {
      title: `${title} | Whole Lot of Nature Blog`,
      description,
      authors: [{ name: authorName }],
      openGraph: {
        type: 'article',
        url: postUrl,
        title,
        description,
        siteName: 'Whole Lot of Nature',
        images: [
          {
            url: featuredImage,
            width: 1200,
            height: 630,
            alt: title,
          },
        ],
        locale: 'en_IN',
        publishedTime,
        modifiedTime,
        authors: [authorName],
        section: 'Gardening',
        tags: post.tags?.map((t: any) => t.name) || ['plants', 'gardening'],
      },
      twitter: {
        card: 'summary_large_image',
        site: '@wholelotofnature',
        creator: '@wholelotofnature',
        title,
        description,
        images: [featuredImage],
      },
      alternates: {
        canonical: postUrl,
      },
    };
  } catch (error) {
    console.error('Failed to fetch blog post for metadata:', error);
    return {
      title: 'Blog | Whole Lot of Nature',
      description: 'Plant care tips, gardening guides, and sustainable living advice.',
    };
  }
}

export default function BlogPostLayout({ children }: Props) {
  return <>{children}</>;
}
