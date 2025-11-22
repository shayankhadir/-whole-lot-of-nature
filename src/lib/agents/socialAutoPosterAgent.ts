/**
 * Social Media Auto-Poster Agent
 * Generates evergreen + launch-ready posts for Instagram/Facebook whenever
 * new products or blog posts are available.
 */

import { WooCommerceService, type WooCommerceProduct } from '@/lib/services/woocommerceService';
import { getPosts, type Post } from '@/lib/api/wordpress';

export type SocialPlatform = 'instagram' | 'facebook';

export interface SocialAssetHint {
  type: 'product-image' | 'lifestyle' | 'reel' | 'carousel';
  source?: string;
  notes?: string;
}

export interface SocialPostPlan {
  id: string;
  platform: SocialPlatform;
  caption: string;
  hashtags: string[];
  callToAction: string;
  referenceUrl: string;
  assetHints: SocialAssetHint[];
  scheduleSlot: string; // ISO timestamp or semantic slot (e.g., "Day 1 – 10:00" )
  contentType: 'product' | 'blog';
}

export interface SocialCalendarResponse {
  success: boolean;
  posts: SocialPostPlan[];
  summary: {
    productPosts: number;
    blogPosts: number;
    recommendedCadence: string;
  };
}

interface GenerateOptions {
  productLimit?: number;
  blogLimit?: number;
  startDate?: Date;
}

const DEFAULT_HASHTAGS = ['#WholeLotOfNature', '#StayLoyalToTheSoil', '#PlantCare', '#GreenHomes', '#BangaloreGarden'];

export class SocialMediaAutoPosterAgent {
  async generateCalendar(options: GenerateOptions = {}): Promise<SocialCalendarResponse> {
    const [products, blogPosts] = await Promise.all([
      WooCommerceService.getProducts(options.productLimit ?? 4),
      getPosts({ per_page: options.blogLimit ?? 2 }).catch(() => [] as Post[]),
    ]);

    const start = options.startDate ?? new Date();
    const plannedPosts: SocialPostPlan[] = [];

    products.slice(0, options.productLimit ?? 4).forEach((product, idx) => {
      plannedPosts.push(this.buildProductPost(product, this.addDays(start, idx)));
    });

    blogPosts.slice(0, options.blogLimit ?? 2).forEach((post, idx) => {
      const offset = (options.productLimit ?? 4) + idx;
      plannedPosts.push(this.buildBlogPost(post, this.addDays(start, offset)));
    });

    return {
      success: true,
      posts: plannedPosts,
      summary: {
        productPosts: Math.min(products.length, options.productLimit ?? 4),
        blogPosts: Math.min(blogPosts.length, options.blogLimit ?? 2),
        recommendedCadence: 'Post products on Mon/Wed/Fri sunset slots + blogs on weekend mornings.',
      },
    };
  }

  private addDays(date: Date, offset: number) {
    const clone = new Date(date);
    clone.setDate(clone.getDate() + offset);
    clone.setHours(10 + (offset % 2 === 0 ? 0 : 6), 0, 0, 0); // Morning or evening slot
    return clone.toISOString();
  }

  private buildProductPost(product: WooCommerceProduct, slot: string): SocialPostPlan {
    const heroImage = product.images?.[0]?.src;
    const baseHashtags = new Set(DEFAULT_HASHTAGS);
    product.categories?.forEach((cat) => baseHashtags.add(`#${cat.slug.replace(/-/g, '')}`));
    product.tags?.forEach((tag) => baseHashtags.add(`#${tag.slug.replace(/-/g, '')}`));

    const caption = [
      `Say hello to **${product.name}** 🌿`,
      product.short_description?.replace(/<[^>]+>/g, '').slice(0, 180) ?? 'Handpicked for Indian homes, rooted in organic soil mix.',
      `\nTap to add it to your cart → ${product.price ? `₹${product.price}` : 'DM for price'}`,
    ].join('\n\n');

    return {
      id: `product-${product.id}`,
      platform: 'instagram',
      caption,
      hashtags: Array.from(baseHashtags).slice(0, 10),
      callToAction: 'Shop now via link in bio or tap the product tag.',
      referenceUrl: `/shop/${product.slug}`,
      assetHints: [
        { type: 'carousel', source: heroImage, notes: 'Slide 1 hero, slide 2 care tip overlay, slide 3 combo suggestion.' },
        { type: 'reel', notes: 'Use stop-motion repotting clip + trending chillhop audio.' },
      ],
      scheduleSlot: slot,
      contentType: 'product',
    };
  }

  private buildBlogPost(post: Post, slot: string): SocialPostPlan {
    const cleanTitle = post.title.rendered.replace(/<[^>]+>/g, '');
    const cleanExcerpt = post.excerpt.rendered.replace(/<[^>]+>/g, '').trim();

    return {
      id: `blog-${post.id}`,
      platform: 'facebook',
      caption: `${cleanTitle}\n\n${cleanExcerpt.slice(0, 220)}…\n\nSwipe up to read the full guide and save it for weekend gardening!`,
      hashtags: ['#GardeningTips', '#UrbanJungle', '#WholeLotOfNature'],
      callToAction: 'Read the full blog post on WholeLotOfNature.com',
      referenceUrl: post.link,
      assetHints: [
        { type: 'lifestyle', notes: 'Use featured image or create a quote card from the article.' },
      ],
      scheduleSlot: slot,
      contentType: 'blog',
    };
  }
}

const socialAutoPosterAgent = new SocialMediaAutoPosterAgent();
export default socialAutoPosterAgent;
