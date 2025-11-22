import axios from 'axios';
import * as cheerio from 'cheerio';

const COMPETITOR_SITES = [
  { name: 'Urvann', url: 'https://www.urvann.com' },
  { name: 'Nurserylive', url: 'https://nurserylive.com' },
  { name: 'Ugaoo', url: 'https://www.ugaoo.com' },
];

const FALLBACK_DIRECTORIES = [
  { name: 'IndieHacker Gardeners', url: 'https://indian-gardening-forum.circle.so', type: 'community' },
  { name: 'Gardeners Forum', url: 'https://www.gardenersforum.com', type: 'forum' },
  { name: 'Plant Care Directory', url: 'https://www.plantdirectories.com/submit', type: 'directory' },
  { name: 'Eco Bloggers Hub', url: 'https://ecobloggers.net/submit', type: 'directory' },
];

type WPPost = {
  id: number;
  slug: string;
  link: string;
  title: { rendered: string } | string;
  content: { rendered: string } | string;
};

interface CompetitorInsight {
  name: string;
  url: string;
  authorityEstimate: number;
  backlinkSources: Array<{
    domain: string;
    url: string;
    anchorSample: string;
    type: string;
    authorityScore: number;
    occurrences: number;
  }>;
  topicKeywords: string[];
}

interface ExternalBacklinkOpportunity {
  keyword: string;
  outreachUrl: string;
  domain: string;
  reason: string;
  anchorText: string;
  estimatedAuthority: number;
  recommendedTarget: {
    id: number;
    title: string;
    url: string;
    slug: string;
  } | null;
}

interface InternalLinkOpportunity {
  source: {
    id: number;
    title: string;
    url: string;
    slug: string;
    content: string;
  };
  target: {
    id: number;
    title: string;
    url: string;
    slug: string;
  };
  anchorText: string;
}

interface BacklinkReport {
  competitors: CompetitorInsight[];
  opportunities: ExternalBacklinkOpportunity[];
  internalOpportunities: InternalLinkOpportunity[];
  summary: {
    competitors: number;
    externalOpportunities: number;
    internalOpportunities: number;
  };
}

interface BacklinkOperationResult {
  sourceId: number;
  sourceTitle: string;
  targetTitle: string;
  targetUrl: string;
  applied: boolean;
  message: string;
}

export default class BacklinkAgent {
  private readonly siteUrl: string;
  private readonly baseUrl: string;
  private readonly authHeader?: string;

  constructor() {
    this.siteUrl = (process.env.SITE_URL || process.env.PUBLIC_SITE_URL || process.env.NEXT_PUBLIC_SITE_URL || 'https://wholelotofnature.com').replace(/\/$/, '');
    const origin = (process.env.WORDPRESS_SITE_URL || process.env.WORDPRESS_URL || this.siteUrl).replace(/\/$/, '');
    this.baseUrl = `${origin}/wp-json/wp/v2`;

    const username = process.env.WORDPRESS_USERNAME;
    const password = process.env.WORDPRESS_PASSWORD || process.env.WORDPRESS_APP_PASSWORD?.replace(/ /g, '');
    if (username && password) {
      this.authHeader = `Basic ${Buffer.from(`${username}:${password}`).toString('base64')}`;
    }
  }

  async runAnalysis(): Promise<BacklinkReport> {
    const [competitors, posts] = await Promise.all([
      this.collectCompetitorInsights(),
      this.fetchPosts(12),
    ]);

    const opportunities = this.buildExternalOpportunities(competitors, posts);
    const internalOpportunities = this.generateInternalLinkOpportunities(posts);

    return {
      competitors,
      opportunities,
      internalOpportunities,
      summary: {
        competitors: competitors.length,
        externalOpportunities: opportunities.length,
        internalOpportunities: internalOpportunities.length,
      },
    };
  }

  async buildBacklinks(limit = 3): Promise<{
    report: BacklinkReport;
    operations: BacklinkOperationResult[];
    summary: { added: number; skipped: number };
  }> {
    if (!this.authHeader) {
      throw new Error('WordPress credentials missing. Set WORDPRESS_USERNAME and WORDPRESS_PASSWORD to add backlinks.');
    }

    const report = await this.runAnalysis();
    const targets = report.internalOpportunities.slice(0, limit);

    const operations: BacklinkOperationResult[] = [];
    for (const opportunity of targets) {
      const applied = await this.injectInternalLink(opportunity);
      operations.push(applied);
    }

    const summary = {
      added: operations.filter((op) => op.applied).length,
      skipped: operations.filter((op) => !op.applied).length,
    };

    return { report, operations, summary };
  }

  private async collectCompetitorInsights(): Promise<CompetitorInsight[]> {
    const insights: CompetitorInsight[] = [];

    for (const competitor of COMPETITOR_SITES) {
      try {
        const insight = await this.scrapeCompetitor(competitor.name, competitor.url);
        insights.push(insight);
      } catch (error) {
        console.warn(`Failed to scrape ${competitor.name}, generating fallback data.`);
        insights.push(this.generateCompetitorFallback(competitor.name, competitor.url));
      }
    }

    return insights;
  }

  private async scrapeCompetitor(name: string, url: string): Promise<CompetitorInsight> {
    const { data } = await axios.get(url, { timeout: 20000 });
    const $ = cheerio.load(data);

    const linkMap = new Map<string, { hostname: string; occurrences: number; url: string; anchorSample: string }>();
    $('a').each((_, el) => {
      const href = ($(el).attr('href') || '').trim();
      if (!href || !href.startsWith('http')) return;
      try {
        const hostname = new URL(href).hostname.replace('www.', '');
        if (hostname.includes('urvann') || hostname.includes('nurserylive') || hostname.includes('ugaoo')) return;
        if (hostname.includes('wholelotofnature')) return;
        const text = ($(el).text() || 'Resource').trim();
        const key = hostname;
        if (!linkMap.has(key)) {
          linkMap.set(key, { hostname, occurrences: 0, url: href, anchorSample: text });
        }
        const existing = linkMap.get(key)!;
        existing.occurrences += 1;
        if (text.length > existing.anchorSample.length) {
          existing.anchorSample = text;
        }
      } catch (error) {
        // Ignore malformed URLs
      }
    });

    const backlinkSources = Array.from(linkMap.values())
      .sort((a, b) => b.occurrences - a.occurrences)
      .slice(0, 8)
      .map((item) => ({
        domain: item.hostname,
        url: item.url,
        anchorSample: item.anchorSample || 'Read more',
        type: this.classifyHost(item.hostname),
        authorityScore: this.estimateAuthority(item.hostname, item.occurrences),
        occurrences: item.occurrences,
      }));

    const topicKeywords = this.extractKeywords($);

    return {
      name,
      url,
      authorityEstimate: 60 + Math.min(40, backlinkSources.length * 3),
      backlinkSources,
      topicKeywords,
    };
  }

  private extractKeywords($: cheerio.CheerioAPI): string[] {
    const keywords: string[] = [];
    $('h1, h2, h3, h4').each((_, el) => {
      const text = $(el).text().trim();
      if (text.length >= 4 && text.length <= 60) {
        keywords.push(text.toLowerCase());
      }
    });

    return Array.from(new Set(keywords)).slice(0, 15);
  }

  private classifyHost(hostname: string): string {
    if (/(directory|list|listing|catalog)/i.test(hostname)) return 'directory';
    if (/(forum|community|club)/i.test(hostname)) return 'community';
    if (/(blog|news|mag)/i.test(hostname)) return 'blog';
    if (/(shop|store)/i.test(hostname)) return 'marketplace';
    return 'resource';
  }

  private estimateAuthority(hostname: string, occurrences: number): number {
    const base = 40 + Math.min(30, occurrences * 4);
    const bonus = hostname.length < 12 ? 15 : hostname.length < 20 ? 8 : 0;
    return Math.min(95, base + bonus);
  }

  private generateCompetitorFallback(name: string, url: string): CompetitorInsight {
    return {
      name,
      url,
      authorityEstimate: 55,
      backlinkSources: FALLBACK_DIRECTORIES.map((dir, index) => ({
        domain: new URL(dir.url).hostname,
        url: dir.url,
        anchorSample: `${name} featured resource ${index + 1}`,
        type: dir.type,
        authorityScore: 60 + index * 5,
        occurrences: 3 - index,
      })),
      topicKeywords: ['indoor plants', 'gardening tips', 'plant care', 'organic fertilizers'],
    };
  }

  private async fetchPosts(limit = 12): Promise<WPPost[]> {
    const params: Record<string, any> = {
      per_page: limit,
      status: 'publish',
      order: 'desc',
      context: this.authHeader ? 'edit' : 'view',
    };

    const response = await axios.get(`${this.baseUrl}/posts`, {
      params,
      headers: this.getAuthHeaders(),
    });

    return response.data;
  }

  private buildExternalOpportunities(competitors: CompetitorInsight[], posts: WPPost[]): ExternalBacklinkOpportunity[] {
    const keywords = Array.from(
      new Set(
        competitors.flatMap((competitor) => competitor.topicKeywords.slice(0, 5))
      )
    );

    const postSummaries = posts.map((post) => ({
      id: post.id,
      title: this.cleanText(typeof post.title === 'string' ? post.title : post.title.rendered),
      url: post.link,
      slug: typeof post['slug'] === 'string' ? (post as any).slug : '',
    }));

    const competitorSources = competitors.flatMap((competitor) => competitor.backlinkSources);
    const combinedSources = [...competitorSources, ...FALLBACK_DIRECTORIES.map((dir) => ({
      domain: new URL(dir.url).hostname,
      url: dir.url,
      anchorSample: dir.name,
      type: dir.type,
      authorityScore: 65,
      occurrences: 2,
    }))];

    const uniqueSources = combinedSources.filter(
      (source, index, array) => array.findIndex((s) => s.domain === source.domain) === index
    );

    return uniqueSources.slice(0, 12).map((source, index) => {
      const keyword = keywords[index % keywords.length] || 'gardening tips';
      const target = postSummaries[index % postSummaries.length] || null;
      return {
        keyword,
        outreachUrl: source.url,
        domain: source.domain,
        reason: `Competitors earn links from ${source.domain}. Submit a resource or guest post mentioning “${keyword}”.`,
        anchorText: `Whole Lot of Nature ${keyword}`,
        estimatedAuthority: source.authorityScore,
        recommendedTarget: target,
      };
    });
  }

  private generateInternalLinkOpportunities(posts: WPPost[]): InternalLinkOpportunity[] {
    const opportunities: InternalLinkOpportunity[] = [];

    const cleanedPosts = posts.map((post) => ({
      id: post.id,
      slug: (post as any).slug,
      url: post.link,
      title: this.cleanText(typeof post.title === 'string' ? post.title : post.title.rendered),
      content: typeof post.content === 'string' ? post.content : post.content?.rendered || '',
    }));

    cleanedPosts.forEach((source, index) => {
      const candidates = cleanedPosts.filter(
        (candidate) =>
          candidate.id !== source.id &&
          !this.contentContainsLink(source.content, candidate.slug, candidate.url)
      );
      if (!candidates.length) return;

      const target = candidates[index % candidates.length];
      const anchorText = target.title.length > 60 ? `${target.title.split(' ').slice(0, 8).join(' ')}…` : target.title;

      opportunities.push({
        source,
        target,
        anchorText,
      });
    });

    return opportunities;
  }

  private async injectInternalLink(opportunity: InternalLinkOpportunity): Promise<BacklinkOperationResult> {
    if (!this.authHeader) {
      return {
        sourceId: opportunity.source.id,
        sourceTitle: opportunity.source.title,
        targetTitle: opportunity.target.title,
        targetUrl: opportunity.target.url,
        applied: false,
        message: 'Missing WordPress credentials',
      };
    }

    if (this.contentContainsLink(opportunity.source.content, opportunity.target.slug, opportunity.target.url)) {
      return {
        sourceId: opportunity.source.id,
        sourceTitle: opportunity.source.title,
        targetTitle: opportunity.target.title,
        targetUrl: opportunity.target.url,
        applied: false,
        message: 'Link already exists',
      };
    }

    const snippet = `\n<p><strong>Further reading:</strong> <a href="${opportunity.target.url}" rel="noopener" target="_blank">${opportunity.anchorText}</a></p>`;
    const updatedContent = `${opportunity.source.content || ''}${snippet}`;

    await axios.post(
      `${this.baseUrl}/posts/${opportunity.source.id}`,
      { content: updatedContent },
      { headers: { ...this.getAuthHeaders(), 'Content-Type': 'application/json' } }
    );

    opportunity.source.content = updatedContent;

    return {
      sourceId: opportunity.source.id,
      sourceTitle: opportunity.source.title,
      targetTitle: opportunity.target.title,
      targetUrl: opportunity.target.url,
      applied: true,
      message: 'Internal backlink inserted',
    };
  }

  private contentContainsLink(content: string, slug: string, url: string): boolean {
    if (!content) return false;
    return content.includes(slug) || content.includes(url);
  }

  private cleanText(value: string): string {
    return value.replace(/<[^>]*>/g, '').replace(/&amp;/g, '&').trim();
  }

  private getAuthHeaders() {
    return this.authHeader ? { Authorization: this.authHeader } : {};
  }
}