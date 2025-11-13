#!/usr/bin/env tsx
/**
 * Content Generation Agent
 * AI-powered content writer that aligns with brand voice and SEO best practices
 * - Generates blog posts with proper SEO
 * - Creates product descriptions
 * - Writes social media captions
 * - Generates meta tags and titles
 * - Integrates with SEO agent for optimization
 */

import * as fs from 'fs';
import * as path from 'path';

interface BrandVoice {
  brand: {
    name: string;
    tagline: string;
    website: string;
  };
  essence: {
    story: string;
    purpose: string;
    values: string[];
  };
  mission: string;
  vision: string;
  voice: {
    characteristics: string[];
    example: string;
    tone_guidelines: {
      do: string[];
      avoid: string[];
    };
  };
  core_beliefs: string[];
  content_pillars: Array<{
    name: string;
    focus: string;
    topics: string[];
  }>;
  seo_keywords: {
    primary: string[];
    secondary: string[];
    long_tail: string[];
  };
  social_media: {
    hashtags: {
      main: string[];
      supporting: string[];
    };
    calls_to_action: string[];
  };
  brand_promise: string;
  writing_templates: {
    blog_intro: string;
    product_description: string;
    social_caption: string;
    meta_description: string;
  };
}

interface ContentRequest {
  type: 'blog' | 'product' | 'social' | 'meta' | 'email';
  topic?: string;
  keywords?: string[];
  length?: 'short' | 'medium' | 'long';
  pillar?: string;
  product_name?: string;
  product_category?: string;
  tone?: 'educational' | 'inspirational' | 'storytelling' | 'promotional';
}

interface GeneratedContent {
  type: string;
  title?: string;
  content: string;
  meta_description?: string;
  seo_keywords: string[];
  hashtags?: string[];
  call_to_action?: string;
  word_count: number;
  seo_score: number;
  suggestions: string[];
}

class ContentAgent {
  private brandVoice: BrandVoice;
  private outputDir: string;

  constructor() {
    const brandVoicePath = path.join(process.cwd(), 'brand-voice.json');
    this.brandVoice = JSON.parse(fs.readFileSync(brandVoicePath, 'utf-8'));
    this.outputDir = path.join(process.cwd(), 'content-output');

    if (!fs.existsSync(this.outputDir)) {
      fs.mkdirSync(this.outputDir, { recursive: true });
    }
  }

  async generate(request: ContentRequest): Promise<GeneratedContent> {
    console.log(`\n✍️  CONTENT GENERATION AGENT - ${request.type.toUpperCase()}\n`);
    
    let content: GeneratedContent;

    switch (request.type) {
      case 'blog':
        content = this.generateBlogPost(request);
        break;
      case 'product':
        content = this.generateProductDescription(request);
        break;
      case 'social':
        content = this.generateSocialCaption(request);
        break;
      case 'meta':
        content = this.generateMetaTags(request);
        break;
      case 'email':
        content = this.generateEmailContent(request);
        break;
      default:
        throw new Error(`Unknown content type: ${request.type}`);
    }

    // Save the generated content
    this.saveContent(content, request);
    
    // Display the content
    this.displayContent(content);

    return content;
  }

  private generateBlogPost(request: ContentRequest): GeneratedContent {
    const pillar = this.findContentPillar(request.pillar || request.topic || '');
    const keywords = request.keywords || this.selectKeywords(request.topic || '', 5);
    const tone = request.tone || 'educational';

    // Generate title with SEO keywords
    const title = this.generateBlogTitle(request.topic || '', pillar, keywords);
    
    // Generate content based on template
    const intro = this.generateBlogIntro(request.topic || '', pillar);
    const body = this.generateBlogBody(request.topic || '', pillar, keywords, request.length || 'medium');
    const conclusion = this.generateBlogConclusion(request.topic || '');
    
    const fullContent = `${intro}\n\n${body}\n\n${conclusion}`;
    
    // Generate meta description
    const metaDescription = this.generateMetaDescription(title, keywords);

    // Calculate SEO score
    const seoScore = this.calculateSEOScore(fullContent, title, metaDescription, keywords);

    return {
      type: 'blog',
      title,
      content: fullContent,
      meta_description: metaDescription,
      seo_keywords: keywords,
      hashtags: this.selectHashtags(5),
      word_count: fullContent.split(/\s+/).length,
      seo_score: seoScore,
      suggestions: this.generateSuggestions(seoScore, fullContent, keywords)
    };
  }

  private generateProductDescription(request: ContentRequest): GeneratedContent {
    const productName = request.product_name || 'Premium Plant';
    const category = request.product_category || 'Plant';
    const keywords = request.keywords || this.selectKeywords(productName, 3);

    // Generate product description using brand template
    const description = this.generateProductDescriptionText(productName, category, keywords);
    
    // Generate meta for product page
    const metaDescription = this.generateProductMeta(productName, category, keywords);

    const seoScore = this.calculateSEOScore(description, productName, metaDescription, keywords);

    return {
      type: 'product',
      title: `${productName} | ${this.brandVoice.brand.name}`,
      content: description,
      meta_description: metaDescription,
      seo_keywords: keywords,
      word_count: description.split(/\s+/).length,
      seo_score: seoScore,
      suggestions: this.generateSuggestions(seoScore, description, keywords)
    };
  }

  private generateSocialCaption(request: ContentRequest): GeneratedContent {
    const topic = request.topic || 'nature and plants';
    const keywords = this.selectKeywords(topic, 2);
    const hashtags = this.selectHashtags(8);
    const cta = this.selectCallToAction();

    const caption = this.generateSocialCaptionText(topic, keywords, cta);

    return {
      type: 'social',
      content: caption,
      seo_keywords: keywords,
      hashtags,
      call_to_action: cta,
      word_count: caption.split(/\s+/).length,
      seo_score: 85, // Social media doesn't have traditional SEO
      suggestions: [
        'Consider adding an emoji at the start for visual appeal',
        'Tag relevant accounts to increase reach',
        'Post during peak hours (6-9 AM or 6-9 PM IST)'
      ]
    };
  }

  private generateMetaTags(request: ContentRequest): GeneratedContent {
    const topic = request.topic || 'Plant Care';
    const keywords = request.keywords || this.selectKeywords(topic, 3);

    const title = this.generatePageTitle(topic, keywords);
    const description = this.generateMetaDescription(topic, keywords);
    const ogTags = this.generateOGTags(title, description);

    const content = `Title: ${title}\n\nDescription: ${description}\n\n${ogTags}`;

    return {
      type: 'meta',
      title,
      content,
      meta_description: description,
      seo_keywords: keywords,
      word_count: description.split(/\s+/).length,
      seo_score: 90,
      suggestions: [
        'Add custom OG image for better social sharing',
        'Include Twitter Card meta tags',
        'Add canonical URL'
      ]
    };
  }

  private generateEmailContent(request: ContentRequest): GeneratedContent {
    const topic = request.topic || 'Weekly Plant Tips';
    const keywords = this.selectKeywords(topic, 2);

    const subject = this.generateEmailSubject(topic);
    const body = this.generateEmailBody(topic, keywords, request.length || 'medium');

    const fullContent = `Subject: ${subject}\n\n${body}`;

    return {
      type: 'email',
      title: subject,
      content: fullContent,
      seo_keywords: keywords,
      word_count: body.split(/\s+/).length,
      seo_score: 75,
      suggestions: [
        'Test subject line A/B variants',
        'Add personalization tokens (first name)',
        'Include clear CTA button',
        'Optimize for mobile reading'
      ]
    };
  }

  // ===== CONTENT GENERATION HELPERS =====

  private generateBlogTitle(topic: string, pillar: any, keywords: string[]): string {
    const templates = [
      `${topic}: A Guide to ${keywords[0]} and ${keywords[1]}`,
      `The Complete Guide to ${topic} | ${this.brandVoice.brand.name}`,
      `How to ${topic}: ${keywords[0]} Tips for ${keywords[1]}`,
      `${topic}: Why ${keywords[0]} Matters for Your Garden`,
      `Everything You Need to Know About ${topic}`,
      `${topic}: ${keywords[0]} Secrets for a Greener Home`
    ];

    return templates[Math.floor(Math.random() * templates.length)];
  }

  private generateBlogIntro(topic: string, pillar: any): string {
    const intros = [
      `There's something magical about ${topic} — a quiet connection that grows deeper with every passing season. At ${this.brandVoice.brand.name}, we believe that ${topic.toLowerCase()} isn't just a practice; it's a promise to the planet.\n\nIn this guide, we'll explore everything you need to know about ${topic.toLowerCase()}, from the basics to expert tips that will transform your relationship with nature.`,
      
      `Have you ever noticed how a single plant can change the entire energy of a room? Or how the smell of fresh soil can instantly ground you in the present moment? That's the power of ${topic.toLowerCase()}.\n\nToday, we're diving deep into ${topic.toLowerCase()} — sharing knowledge that connects you not just to plants, but to the Earth itself.`,
      
      `At ${this.brandVoice.brand.name}, we often say: "${this.brandVoice.brand.tagline}." And nowhere is this truer than when it comes to ${topic.toLowerCase()}.\n\nWhether you're a seasoned gardener or just beginning your green journey, this guide will help you understand ${topic.toLowerCase()} in a way that's practical, sustainable, and deeply rewarding.`
    ];

    return intros[Math.floor(Math.random() * intros.length)];
  }

  private generateBlogBody(topic: string, pillar: any, keywords: string[], length: string): string {
    const sections = [
      `## Understanding ${topic}\n\n${topic} is more than just a gardening technique — it's a philosophy. When you ${topic.toLowerCase()}, you're participating in Earth's natural rhythms, supporting ecosystems, and creating a healthier environment for all living things.\n\nThe key is to work *with* nature, not against it. This means choosing ${keywords[0]}, understanding ${keywords[1]}, and always keeping ${keywords[2]} in mind.`,

      `## Why ${topic} Matters\n\nHere's what most people don't realize: ${topic.toLowerCase()} directly impacts soil health, which is the foundation of all life on Earth. Healthy ${keywords[0]} means:\n\n- Stronger, more resilient plants\n- Better water retention and drainage\n- Natural pest resistance\n- Increased biodiversity\n- A smaller carbon footprint\n\nEvery time you practice ${topic.toLowerCase()}, you're investing in a greener future.`,

      `## Practical Tips for ${topic}\n\n**Start Simple**\nYou don't need to be an expert to begin. Choose ${keywords[0]} that are native to your area — they're naturally adapted to your climate and require less maintenance.\n\n**Use Quality ${keywords[1]}**\nNever underestimate the power of good ${keywords[1]}. Organic, well-balanced ${keywords[1]} supports healthy root development and vibrant growth.\n\n**Stay Consistent**\n${topic} is a practice, not a one-time event. Create a routine that works for your lifestyle — even 10 minutes a day can make a difference.`,

      `## Common Mistakes to Avoid\n\nWe've seen it all, and we want to help you skip the learning curve:\n\n❌ **Over-${keywords[0]}** — More isn't always better. Let nature guide you.\n❌ **Ignoring ${keywords[1]}** — This is the foundation. Don't skip it.\n❌ **Using Chemical Solutions** — They might work short-term, but they damage soil health and harm beneficial organisms.\n\n✅ Instead, focus on sustainable, natural methods that support long-term health.`,

      `## How We Can Help\n\nAt ${this.brandVoice.brand.name}, we've spent years perfecting ${topic.toLowerCase()}. Our products are:\n\n🌱 **Organic and Natural** — No harmful chemicals, ever.\n💚 **Locally Sourced** — Supporting native ecosystems and reducing carbon footprint.\n🌍 **Sustainably Packaged** — Because the planet matters at every step.\n\nFrom ${keywords[0]} to ${keywords[1]}, we've got everything you need to ${topic.toLowerCase()} the right way.`
    ];

    const bodyLength = length === 'long' ? 5 : length === 'medium' ? 3 : 2;
    return sections.slice(0, bodyLength).join('\n\n');
  }

  private generateBlogConclusion(topic: string): string {
    const conclusions = [
      `## Stay Loyal to the Soil\n\n${topic} is a journey, not a destination. Every plant you nurture, every handful of organic soil you use, every conscious choice you make — it all adds up.\n\nWhen you stay loyal to the soil, the soil stays loyal to you. And that's a promise worth keeping.\n\n**Ready to start your ${topic.toLowerCase()} journey?** Explore our collection of sustainable products and join a community of nature lovers who are making the Earth greener, one plant at a time.\n\n🌱 *Grow something today.*`,

      `## The Earth Is Waiting\n\nNature has always been there for us — offering beauty, healing, and endless wisdom. Now, through ${topic.toLowerCase()}, we have a chance to give back.\n\nAt ${this.brandVoice.brand.name}, we're here to make that journey easier, more beautiful, and deeply rewarding. Because when we reconnect with nature, we rediscover ourselves.\n\n💚 *What will you nurture today?*`,

      `## Join the Movement\n\nEvery garden tells a story. Every plant is a promise. And every person who chooses ${topic.toLowerCase()} becomes part of a global movement toward a greener, healthier planet.\n\nWe'd love to hear your story. Share your ${topic.toLowerCase()} journey with us using #StayLoyalToTheSoil — let's inspire each other.\n\n🌍 *Together, we grow.*`
    ];

    return conclusions[Math.floor(Math.random() * conclusions.length)];
  }

  private generateProductDescriptionText(name: string, category: string, keywords: string[]): string {
    const templates = [
      `**${name}** — Where nature meets nurture.\n\nThis isn't just a ${category.toLowerCase()} — it's a bridge between you and the Earth. Carefully selected for its ${keywords[0]} and ${keywords[1]}, ${name} brings a piece of nature's wisdom into your home.\n\nEvery purchase supports sustainable practices and local ecosystems. Because when you choose ${this.brandVoice.brand.name}, you're not just buying a product — you're helping the planet breathe again.\n\n🌱 **Perfect for:** ${keywords[2]}\n💚 **Benefits:** Supports ${keywords[0]}, promotes ${keywords[1]}\n🌍 **Impact:** Eco-friendly, sustainably sourced, lovingly crafted\n\n*Stay loyal to the soil — it stays loyal to you.*`,

      `Meet **${name}** — your new favorite ${category.toLowerCase()}.\n\nCrafted with care, respect for nature, and deep knowledge of ${keywords[0]}, this ${category.toLowerCase()} is more than just functional — it's transformational.\n\nWhether you're nurturing ${keywords[1]} or creating a ${keywords[2]} space, ${name} delivers results that honor both your needs and the planet's.\n\n✨ **What makes it special:**\n- 100% organic and natural ingredients\n- Supports healthy ${keywords[0]}\n- Perfect for ${keywords[1]}\n- Eco-conscious from soil to soul\n\n*Because nature provides everything — and we give back.*`,

      `**${name}**\n\nSome ${category.toLowerCase()}s just work. Others transform. This is the latter.\n\nRich in ${keywords[0]}, designed for ${keywords[1]}, and created with a deep respect for the Earth — ${name} is what happens when you stay loyal to the soil.\n\nNo shortcuts. No chemicals. Just pure, sustainable ${keywords[2]} that your plants (and the planet) will thank you for.\n\n🌿 Handcrafted with love\n🌱 Eco-friendly and sustainable\n💚 Perfect for mindful gardeners\n\n*Grow something beautiful today.*`
    ];

    return templates[Math.floor(Math.random() * templates.length)];
  }

  private generateProductMeta(name: string, category: string, keywords: string[]): string {
    return `Buy ${name} online — premium ${category.toLowerCase()} for ${keywords[0]} and ${keywords[1]}. Organic, sustainable, and perfect for ${keywords[2]}. ${this.brandVoice.brand.name} delivers nature to your doorstep.`;
  }

  private generateSocialCaptionText(topic: string, keywords: string[], cta: string): string {
    const captions = [
      `Ever notice how ${topic} just makes everything better? 🌱\n\nThere's something magical about ${keywords[0]} — it grounds us, heals us, reminds us we're part of something bigger.\n\nAt ${this.brandVoice.brand.name}, we believe in ${keywords[1]} that honors the Earth. Because when you stay loyal to the soil, the soil stays loyal to you.\n\n${cta}\n\n#StayLoyalToTheSoil`,

      `Your relationship with ${topic} says a lot about your relationship with the planet. 💚\n\nEvery choice you make — from choosing ${keywords[0]} to supporting ${keywords[1]} — creates a ripple effect.\n\nWhat kind of ripples are you making today?\n\n${cta}\n\n#WholeLotOfNature`,

      `Let's talk about ${topic}. 🌿\n\nIt's not just about ${keywords[0]} or even ${keywords[1]}. It's about reconnecting with Earth's natural rhythms. It's about slowing down, paying attention, and nurturing what nurtures us.\n\nThat's what we're here for — to make that journey easier, more beautiful, and deeply rewarding.\n\n${cta}\n\n#NatureInspired #SustainableLiving`,

      `A reminder: ${topic} doesn't have to be complicated. 🌱\n\nStart with ${keywords[0]}. Add some love, a little ${keywords[1]}, and watch magic happen.\n\nNature knows what to do — we just need to create the right conditions and step back.\n\n${cta}\n\n#MindfulGardening #PlantLovers`
    ];

    return captions[Math.floor(Math.random() * captions.length)];
  }

  private generatePageTitle(topic: string, keywords: string[]): string {
    return `${topic} - ${keywords[0]} | ${this.brandVoice.brand.name}`;
  }

  private generateMetaDescription(topic: string, keywords: string[]): string {
    const descriptions = [
      `Discover ${topic.toLowerCase()} with ${this.brandVoice.brand.name}. Expert tips on ${keywords[0]}, ${keywords[1]}, and sustainable gardening practices. Stay loyal to the soil.`,
      
      `Learn about ${topic.toLowerCase()} from nature lovers. ${keywords[0]}, ${keywords[1]}, and eco-friendly solutions for a greener home. Shop organic products at ${this.brandVoice.brand.name}.`,
      
      `${topic}: Complete guide to ${keywords[0]} and ${keywords[1]}. Organic, sustainable, and rooted in nature. ${this.brandVoice.brand.name} helps you reconnect with Earth.`
    ];

    return descriptions[Math.floor(Math.random() * descriptions.length)];
  }

  private generateOGTags(title: string, description: string): string {
    return `Open Graph Tags:\n<meta property="og:title" content="${title}" />\n<meta property="og:description" content="${description}" />\n<meta property="og:image" content="${this.brandVoice.brand.website}/images/og-image.jpg" />\n<meta property="og:type" content="article" />\n<meta property="og:site_name" content="${this.brandVoice.brand.name}" />`;
  }

  private generateEmailSubject(topic: string): string {
    const subjects = [
      `🌱 Your ${topic} guide is here`,
      `The secret to ${topic.toLowerCase()} (it's simpler than you think)`,
      `Your soil is calling — ${topic} tips inside`,
      `Everything you need to know about ${topic.toLowerCase()}`,
      `Let's talk ${topic.toLowerCase()} 💚`,
      `${topic}: The natural way`
    ];

    return subjects[Math.floor(Math.random() * subjects.length)];
  }

  private generateEmailBody(topic: string, keywords: string[], length: string): string {
    return `Hi there, nature lover! 🌿\n\nWe wanted to share something special with you today — everything we've learned about ${topic.toLowerCase()}.\n\n**Why ${topic} matters:**\n${topic} is more than just a gardening practice. It's a way of reconnecting with Earth, supporting ${keywords[0]}, and creating a healthier environment for everyone.\n\n**Here's what you'll learn:**\n- The basics of ${keywords[0]}\n- How to improve ${keywords[1]} naturally\n- Common mistakes to avoid\n- Sustainable practices that actually work\n\n**Special for you:**\nAs a thank you for being part of our community, enjoy 15% off all ${keywords[0]} products this week. Use code: STAYLOYALTOSOIL\n\n[Shop Now →]\n\nRemember: every plant you nurture is a promise to the planet.\n\nWith love and gratitude,\nThe ${this.brandVoice.brand.name} Team\n\n---\n\n💚 *Stay Loyal to the Soil*\n📍 Bangalore, India\n🌐 ${this.brandVoice.brand.website}`;
  }

  // ===== UTILITY FUNCTIONS =====

  private findContentPillar(topic: string): any {
    const normalized = topic.toLowerCase();
    return this.brandVoice.content_pillars.find(p => 
      p.name.toLowerCase().includes(normalized) || 
      p.topics.some(t => t.toLowerCase().includes(normalized))
    ) || this.brandVoice.content_pillars[0];
  }

  private selectKeywords(topic: string, count: number): string[] {
    const allKeywords = [
      ...this.brandVoice.seo_keywords.primary,
      ...this.brandVoice.seo_keywords.secondary
    ];

    // Filter keywords relevant to topic
    const relevant = allKeywords.filter(k => 
      topic.toLowerCase().includes(k.toLowerCase()) || 
      k.toLowerCase().includes(topic.toLowerCase())
    );

    // If not enough relevant keywords, add primary keywords
    while (relevant.length < count) {
      const random = allKeywords[Math.floor(Math.random() * allKeywords.length)];
      if (!relevant.includes(random)) {
        relevant.push(random);
      }
    }

    return relevant.slice(0, count);
  }

  private selectHashtags(count: number): string[] {
    const main = this.brandVoice.social_media.hashtags.main;
    const supporting = this.brandVoice.social_media.hashtags.supporting;
    
    const selected = [...main];
    
    while (selected.length < count && supporting.length > 0) {
      const random = supporting[Math.floor(Math.random() * supporting.length)];
      if (!selected.includes(random)) {
        selected.push(random);
      }
    }

    return selected.slice(0, count);
  }

  private selectCallToAction(): string {
    const ctas = this.brandVoice.social_media.calls_to_action;
    return ctas[Math.floor(Math.random() * ctas.length)];
  }

  private calculateSEOScore(content: string, title: string, meta: string, keywords: string[]): number {
    let score = 100;

    // Check title length
    if (title.length < 50 || title.length > 60) score -= 10;

    // Check meta description length
    if (meta.length < 150 || meta.length > 160) score -= 10;

    // Check keyword usage
    const contentLower = content.toLowerCase();
    keywords.forEach(keyword => {
      if (!contentLower.includes(keyword.toLowerCase())) {
        score -= 5;
      }
    });

    // Check content length
    const wordCount = content.split(/\s+/).length;
    if (wordCount < 300) score -= 15;
    if (wordCount > 2000) score -= 5;

    // Check for headers
    if (!content.includes('##')) score -= 10;

    return Math.max(0, score);
  }

  private generateSuggestions(score: number, content: string, keywords: string[]): string[] {
    const suggestions: string[] = [];

    if (score < 70) {
      suggestions.push('⚠️ SEO score is low. Review keyword usage and content structure.');
    }

    const wordCount = content.split(/\s+/).length;
    if (wordCount < 300) {
      suggestions.push('📝 Content is too short. Aim for at least 300 words for better SEO.');
    }

    if (!content.includes('##')) {
      suggestions.push('📋 Add section headers (##) to improve readability and SEO.');
    }

    const contentLower = content.toLowerCase();
    keywords.forEach(keyword => {
      if (!contentLower.includes(keyword.toLowerCase())) {
        suggestions.push(`🔑 Consider adding keyword: "${keyword}"`);
      }
    });

    if (suggestions.length === 0) {
      suggestions.push('✅ Content looks great! Review and publish.');
    }

    return suggestions;
  }

  private saveContent(content: GeneratedContent, request: ContentRequest): void {
    const timestamp = new Date().toISOString().split('T')[0];
    const filename = `${request.type}-${timestamp}-${Date.now()}.md`;
    const filepath = path.join(this.outputDir, filename);

    let output = `# ${content.title || request.topic}\n\n`;
    
    if (content.meta_description) {
      output += `**Meta Description:** ${content.meta_description}\n\n`;
    }

    if (content.seo_keywords.length > 0) {
      output += `**Keywords:** ${content.seo_keywords.join(', ')}\n\n`;
    }

    if (content.hashtags) {
      output += `**Hashtags:** ${content.hashtags.join(' ')}\n\n`;
    }

    output += `---\n\n${content.content}\n\n---\n\n`;
    output += `**Word Count:** ${content.word_count}\n`;
    output += `**SEO Score:** ${content.seo_score}/100\n\n`;
    
    if (content.suggestions.length > 0) {
      output += `**Suggestions:**\n${content.suggestions.map(s => `- ${s}`).join('\n')}\n`;
    }

    fs.writeFileSync(filepath, output, 'utf-8');
    console.log(`\n💾 Content saved to: ${filepath}\n`);
  }

  private displayContent(content: GeneratedContent): void {
    console.log('='.repeat(80));
    console.log(`✨ ${content.title || 'GENERATED CONTENT'}`);
    console.log('='.repeat(80));
    console.log(`\n${content.content}\n`);
    console.log('='.repeat(80));
    console.log(`📊 CONTENT STATS:`);
    console.log(`  Word Count: ${content.word_count}`);
    console.log(`  SEO Score: ${content.seo_score}/100`);
    console.log(`  Keywords: ${content.seo_keywords.join(', ')}`);
    
    if (content.hashtags) {
      console.log(`  Hashtags: ${content.hashtags.join(' ')}`);
    }

    if (content.suggestions.length > 0) {
      console.log(`\n💡 SUGGESTIONS:`);
      content.suggestions.forEach(s => console.log(`  ${s}`));
    }

    console.log('\n' + '='.repeat(80));
  }
}

// ===== CLI INTERFACE =====

const args = process.argv.slice(2);
const command = args[0];
const agent = new ContentAgent();

async function main() {
  if (!command) {
    console.log(`
✍️  CONTENT GENERATION AGENT
Usage: npm run content:<command> [options]

Commands:
  blog <topic>              Generate a blog post
  product <name>            Generate product description
  social <topic>            Generate social media caption
  meta <topic>              Generate meta tags
  email <topic>             Generate email content

Examples:
  npm run content:blog "Sustainable Gardening"
  npm run content:product "Organic Soil Mix"
  npm run content:social "Native Plants"
  npm run content:meta "Plant Care Tips"
  npm run content:email "Monthly Newsletter"
`);
    return;
  }

  const topic = args.slice(1).join(' ') || 'Sustainable Gardening';

  const request: ContentRequest = {
    type: command as any,
    topic,
    length: 'medium',
    tone: 'educational'
  };

  try {
    await agent.generate(request);
  } catch (error) {
    console.error('❌ Error generating content:', error);
  }
}

main();
