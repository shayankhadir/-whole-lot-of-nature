/**
 * Ayurvedic Blog Topics Configuration
 * For generating blog content about Ayurvedic tips, herbal remedies, and wellness
 */

import { TrendData } from '@/lib/agents/trendScraper';

export interface AyurvedicBlogTopic {
  title: string;
  keywords: string[];
  description: string;
  category: 'tips' | 'remedies' | 'wellness' | 'recipes' | 'lifestyle';
  relatedProducts: string[];
  targetAudience: string;
}

export const AYURVEDIC_BLOG_TOPICS: AyurvedicBlogTopic[] = [
  // Tips & Tricks
  {
    title: '10 Ayurvedic Morning Rituals for Better Digestion',
    keywords: ['ayurvedic morning routine', 'digestion tips', 'dinacharya', 'morning rituals ayurveda'],
    description: 'Start your day the Ayurvedic way with these time-tested morning rituals that promote healthy digestion and energy levels throughout the day.',
    category: 'tips',
    relatedProducts: ['triphala', 'ashwagandha', 'herbal tea'],
    targetAudience: 'Health-conscious individuals seeking natural digestive solutions',
  },
  {
    title: 'Ayurvedic Herbs for Hair Growth: A Complete Guide',
    keywords: ['ayurvedic hair care', 'herbs for hair growth', 'natural hair remedies', 'amla for hair'],
    description: 'Discover powerful Ayurvedic herbs like Amla, Bhringraj, and Brahmi that promote healthy hair growth and prevent hair fall naturally.',
    category: 'remedies',
    relatedProducts: ['amla powder', 'bhringraj powder', 'hair oil', 'herbal shampoo'],
    targetAudience: 'People dealing with hair fall or seeking natural hair care solutions',
  },
  {
    title: 'Understanding Your Dosha: Vata, Pitta, Kapha Explained',
    keywords: ['ayurvedic dosha', 'vata pitta kapha', 'ayurveda body type', 'dosha quiz'],
    description: 'Learn about the three Ayurvedic doshas and how understanding your unique constitution can help you make better health and lifestyle choices.',
    category: 'wellness',
    relatedProducts: ['dosha balancing supplements', 'herbal supplements'],
    targetAudience: 'Beginners to Ayurveda interested in personalized wellness',
  },
  {
    title: 'Ayurvedic Immunity Boosters for Every Season',
    keywords: ['ayurvedic immunity', 'natural immunity boosters', 'chyawanprash benefits', 'tulsi benefits'],
    description: 'Strengthen your immune system naturally with these powerful Ayurvedic herbs and formulations that have been used for centuries.',
    category: 'wellness',
    relatedProducts: ['chyawanprash', 'tulsi', 'giloy', 'ashwagandha tablets'],
    targetAudience: 'Health-conscious families seeking natural immunity solutions',
  },
  {
    title: 'Ayurvedic Skincare Routine: Herbs for Glowing Skin',
    keywords: ['ayurvedic skincare', 'herbs for glowing skin', 'natural skincare india', 'turmeric for skin'],
    description: 'Create a natural skincare routine using Ayurvedic herbs like turmeric, neem, and sandalwood for radiant, healthy skin.',
    category: 'tips',
    relatedProducts: ['turmeric powder', 'neem powder', 'face pack', 'natural soap'],
    targetAudience: 'People seeking natural alternatives to chemical skincare',
  },
  {
    title: 'Ayurvedic Remedies for Stress and Anxiety Relief',
    keywords: ['ayurvedic stress relief', 'natural anxiety remedies', 'ashwagandha benefits', 'brahmi for anxiety'],
    description: 'Combat modern stress with ancient Ayurvedic wisdom. Learn about adaptogenic herbs and practices that calm the mind naturally.',
    category: 'remedies',
    relatedProducts: ['ashwagandha', 'brahmi', 'shankhpushpi', 'stress relief tablets'],
    targetAudience: 'Working professionals dealing with stress and anxiety',
  },
  {
    title: 'Ayurvedic Diet: Foods for Your Body Type',
    keywords: ['ayurvedic diet', 'dosha diet', 'ayurvedic foods', 'eating according to ayurveda'],
    description: 'Learn which foods suit your dosha type and how to eat according to Ayurvedic principles for optimal health and energy.',
    category: 'lifestyle',
    relatedProducts: ['herbal supplements', 'digestive aids', 'spices'],
    targetAudience: 'People interested in mindful eating and nutrition',
  },
  {
    title: 'Triphala Benefits: The Ultimate Ayurvedic Detox',
    keywords: ['triphala benefits', 'ayurvedic detox', 'triphala for digestion', 'how to take triphala'],
    description: 'Explore the amazing benefits of Triphala, the three-fruit formula that cleanses, rejuvenates, and balances all three doshas.',
    category: 'remedies',
    relatedProducts: ['triphala tablets', 'triphala powder', 'digestive supplements'],
    targetAudience: 'Those seeking natural detox and digestive support',
  },
  {
    title: 'Ayurvedic Sleep Remedies: Natural Ways to Sleep Better',
    keywords: ['ayurvedic sleep remedies', 'natural sleep aids', 'ashwagandha for sleep', 'ayurveda insomnia'],
    description: 'Discover Ayurvedic herbs and practices that promote deep, restful sleep without the side effects of conventional sleep aids.',
    category: 'tips',
    relatedProducts: ['ashwagandha', 'brahmi', 'sleep support tablets', 'herbal tea'],
    targetAudience: 'People with sleep issues seeking natural solutions',
  },
  {
    title: 'Moringa: The Ayurvedic Superfood You Need',
    keywords: ['moringa benefits', 'moringa powder', 'drumstick leaves health', 'ayurvedic superfood'],
    description: 'Learn why Moringa is called the "Miracle Tree" and how this Ayurvedic superfood can transform your health and energy levels.',
    category: 'wellness',
    relatedProducts: ['moringa powder', 'moringa tablets', 'moringa leaves'],
    targetAudience: 'Health enthusiasts interested in superfoods',
  },
];

/**
 * Convert an Ayurvedic blog topic to TrendData format for the blog generator
 */
export function toTrendData(topic: AyurvedicBlogTopic): TrendData {
  return {
    title: topic.title,
    source: 'ayurveda-content',
    engagement: 1000,
    timestamp: new Date(),
    category: 'plants', // Map to valid TrendData category
    keywords: topic.keywords,
    description: topic.description,
  };
}

/**
 * Get a random selection of Ayurvedic topics for content generation
 */
export function getRandomTopics(count: number = 3): AyurvedicBlogTopic[] {
  const shuffled = [...AYURVEDIC_BLOG_TOPICS].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

export default AYURVEDIC_BLOG_TOPICS;
