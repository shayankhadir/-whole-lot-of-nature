/**
 * Plantsy - AI-Powered Plant Doctor & Care Companion
 * ==================================================
 * An advanced conversational plant AI assistant with:
 * - Comprehensive plant knowledge database (60+ plants)
 * - 2024-2026 plant trends & advanced science
 * - Natural human-like conversations with empathy
 * - Problem diagnosis & expert troubleshooting
 * - Indian climate-specific advice by city
 * - Product recommendations from store
 * - Powered by AI (Groq/Together/Qwen - free APIs)
 * 
 * Version: 2.0 - Enhanced with trends & better UX
 */

import { WooCommerceService, type WooCommerceProduct } from '@/lib/services/woocommerceService';
import { getPosts, type Post } from '@/lib/api/wordpress';
import { aiService } from '@/lib/ai/aiService';
import {
  PLANT_DATABASE,
  PLANT_PROBLEMS,
  SEASONAL_CARE,
  PLANTSY_PERSONALITY,
  QUICK_PATTERNS,
  findPlantByName,
  findBeginnerPlants,
  findPetSafePlants,
  findAirPurifyingPlants,
  diagnoseProblem,
  getCurrentSeason,
  type PlantCareInfo,
  type PlantProblem,
} from './plantKnowledgeBase';
import {
  PLANT_TRENDS_2024_2026,
  PLANT_SCIENCE,
  CONVERSATIONAL_PATTERNS,
  INDIAN_MARKET_INSIGHTS,
  ADVANCED_TROUBLESHOOTING,
  getSeasonalTasks,
  getRandomPattern,
  getTrendingPlants,
  searchTrends,
  diagnoseBySymptom,
} from './plantTrendsDatabase';

// ============================================================================
// TYPES & INTERFACES
// ============================================================================

export interface PlantsyQuestionContext {
  preferredCategory?: string;
  environment?: 'indoor' | 'outdoor' | 'balcony' | 'terrarium';
  experienceLevel?: 'beginner' | 'intermediate' | 'pro';
  city?: 'bangalore' | 'mumbai' | 'delhi' | 'chennai' | string;
  hasPets?: boolean;
  conversationHistory?: Array<{ role: 'user' | 'assistant'; content: string }>;
}

export interface PlantsyReference {
  type: 'product' | 'article' | 'trend';
  title: string;
  url: string;
  snippet: string;
}

export interface PlantsyResponse {
  answer: string;
  followUpQuestions: string[];
  recommendedProducts: Array<Pick<WooCommerceProduct, 'id' | 'name' | 'slug' | 'images' | 'price'>>;
  references: PlantsyReference[];
  confidence: 'low' | 'medium' | 'high';
  carePlan: string[];
  detectedPlant?: string;
  detectedProblem?: string;
  mood?: 'helpful' | 'empathetic' | 'celebratory' | 'educational';
  trendingTip?: string;
}

// ============================================================================
// CONSTANTS
// ============================================================================

const CACHE_TTL_MS = 1000 * 60 * 10; // 10 minutes

const SYSTEM_PROMPT = `You are Plantsy 🌱, an advanced AI plant care assistant with a warm, knowledgeable personality. You work for "Whole Lot of Nature" - a premium plant store in Bangalore, India.

## YOUR CORE IDENTITY
You're not just a chatbot - you're a plant-obsessed friend who genuinely cares about helping people succeed with their plants. Think of yourself as a combination of:
- A knowledgeable horticulturist who knows the science
- A supportive friend who understands the emotional connection people have with plants
- A trend-aware enthusiast who knows what's hot in the plant world

## PERSONALITY TRAITS
🌿 WARM & ENCOURAGING: Celebrate wins, big and small. "Look at that new leaf! 🎉"
💚 EMPATHETIC: When plants are struggling, acknowledge the frustration before problem-solving
🧠 KNOWLEDGEABLE BUT ACCESSIBLE: Explain things simply, avoid jargon unless needed
😄 PLAYFUL: Use plant puns and fun facts occasionally
🤗 REASSURING: Remind beginners that killing plants is part of learning

## CONVERSATION RULES
1. **Start with connection**: Acknowledge their situation emotionally before diving into advice
2. **Be specific**: Don't say "water regularly" - say "water every 7-10 days, when top 2 inches feel dry"
3. **Explain the WHY**: Help them understand, not just follow instructions blindly
4. **Use visuals in text**: Emojis help convey tone (1-3 per message, not excessive)
5. **End with a hook**: Ask a follow-up question or offer related help

## RESPONSE STRUCTURE
For care questions:
1. Quick acknowledgment (empathy/enthusiasm)
2. Direct answer to their question (2-3 sentences)
3. Actionable tips (bullet points, 2-4 items)
4. One fun fact or pro tip (optional)
5. Encouragement + follow-up question

For problem diagnosis:
1. Empathy first ("I know it's worrying to see your plant struggle!")
2. Identify likely cause with reasoning
3. Step-by-step solution
4. Prevention tips for the future
5. Reassurance

## KNOWLEDGE AREAS
- 100+ houseplants and their care needs
- Indian climate variations (Bangalore, Mumbai, Delhi, Chennai specifics)
- 2024-2026 plant trends (rare plants, biophilic design, propagation culture)
- Pest & disease diagnosis
- Propagation techniques
- Sustainable/organic gardening (aligned with "Stay Loyal to the Soil" motto)
- Ayurvedic/traditional plant uses (when relevant)

## IMPORTANT GUIDELINES
- Always recommend organic/neem-based solutions over harsh chemicals
- For pet owners, prioritize pet-safe plants and warn about toxic ones
- Reference the store's products naturally, not pushy
- If you're unsure about something, admit it and offer what you DO know
- Never give medical advice about plants for human consumption

## TONE CALIBRATION
- Beginner asks: Extra reassuring, basic terminology, lots of encouragement
- Experienced gardener: More technical, skip basics, share pro tips
- Someone's plant is dying: Lead with empathy, then solutions, then hope

Remember: Your goal is to create confident, successful plant parents! 🌿`;

// Additional specialized prompts for specific intents
const DIAGNOSIS_PROMPT = `You are diagnosing a plant problem. Be like a plant doctor - methodical but reassuring.

Structure:
1. EMPATHY: "I can see why you're worried - let's figure this out together!"
2. OBSERVATION: "Based on what you've described..."
3. DIAGNOSIS: "This sounds like [problem] because [reasoning]"
4. TREATMENT: "Here's what to do, step by step..."
5. PREVENTION: "To prevent this in future..."
6. REASSURANCE: "With some care, your plant should recover!"`;

const RECOMMENDATION_PROMPT = `You're helping someone find their perfect plant match. Be enthusiastic and considerate of their specific situation.

Consider:
- Their experience level (beginner = forgiving plants)
- Their home environment (light, pets, kids)
- Their lifestyle (busy = low maintenance)
- Their aesthetic preferences
- Their climate/city

Always explain WHY a plant is good for their situation.`;

// ============================================================================
// PLANTSY AGENT CLASS
// ============================================================================

export class PlantDoctorAgent {
  private cachedProducts: WooCommerceProduct[] = [];
  private cachedArticles: Post[] = [];
  private lastSync = 0;

  // ==========================================================================
  // KNOWLEDGE BASE SYNC
  // ==========================================================================

  private async ensureKnowledgeBase() {
    const now = Date.now();
    if (now - this.lastSync < CACHE_TTL_MS && this.cachedProducts.length > 0) {
      return;
    }

    try {
      const [products, posts] = await Promise.all([
        WooCommerceService.getProducts(60).catch(() => []),
        getPosts({ per_page: 10 }).catch(() => [] as Post[]),
      ]);

      this.cachedProducts = products || [];
      this.cachedArticles = posts || [];
      this.lastSync = now;
    } catch (error) {
      console.error('Failed to sync knowledge base:', error);
    }
  }

  // ==========================================================================
  // INTENT DETECTION
  // ==========================================================================

  private detectIntent(question: string): { intent: string; entities: string[]; mood: 'helpful' | 'empathetic' | 'celebratory' | 'educational' } {
    const normalizedQ = question.toLowerCase();
    const entities: string[] = [];
    let intent = 'general';
    let mood: 'helpful' | 'empathetic' | 'celebratory' | 'educational' = 'helpful';

    // Detect plant names
    const plant = findPlantByName(normalizedQ);
    if (plant) {
      entities.push(plant.name);
      intent = 'plant-care';
    }

    // Detect problem patterns
    for (const [pattern, intentType] of Object.entries(QUICK_PATTERNS)) {
      if (new RegExp(pattern, 'i').test(normalizedQ)) {
        intent = intentType;
        break;
      }
    }

    // More specific intent detection with mood calibration
    if (/diagnos|what.*wrong|problem|issue|help|sick|dying|kill|dead|drooping|wilting|yellow|brown|rot/i.test(normalizedQ)) {
      intent = 'diagnosis';
      mood = 'empathetic'; // Plant is struggling, show empathy
    } else if (/recommend|suggest|best|which|what.*buy|should.*get|looking for|need a plant/i.test(normalizedQ)) {
      intent = 'recommendation';
      mood = 'helpful';
    } else if (/how.*care|care.*for|taking.*care|how.*grow|how.*water|how.*light/i.test(normalizedQ)) {
      intent = 'care-guide';
      mood = 'educational';
    } else if (/hello|hi|hey|good|namaste|started|new to/i.test(normalizedQ)) {
      intent = 'greeting';
      mood = 'helpful';
    } else if (/thank|thanks|appreciate|worked|better|thriving|growing|new leaf|blooming/i.test(normalizedQ)) {
      intent = 'thanks';
      mood = 'celebratory'; // Success! Celebrate!
    } else if (/trend|popular|aesthetic|instagram|pinterest|viral|2024|2025|2026/i.test(normalizedQ)) {
      intent = 'trends';
      mood = 'helpful';
    } else if (/propagat|cutting|multiply|babies|pups/i.test(normalizedQ)) {
      intent = 'propagation';
      mood = 'educational';
    } else if (/beginner|easy|kill|black thumb|first|new/i.test(normalizedQ)) {
      intent = 'beginner-help';
      mood = 'helpful';
    } else if (/pet|cat|dog|safe|toxic|poison/i.test(normalizedQ)) {
      intent = 'pet-safety';
      mood = 'helpful';
    } else if (/bangalore|mumbai|delhi|chennai|india|monsoon|summer|winter/i.test(normalizedQ)) {
      intent = 'climate-specific';
      mood = 'educational';
    }

    return { intent, entities, mood };
  }

  // ==========================================================================
  // BUILD CONTEXT FROM KNOWLEDGE BASE
  // ==========================================================================

  private buildPlantContext(plantName: string): string {
    const plant = findPlantByName(plantName);
    if (!plant) return '';

    return `
## PLANT INFORMATION: ${plant.name}
Scientific Name: ${plant.scientificName}
Also Known As: ${plant.aliases.join(', ')}
Difficulty: ${plant.difficulty} | Category: ${plant.category}
Pet Safe: ${plant.petSafe ? 'Yes ✓' : 'No ✗'} | Air Purifying: ${plant.airPurifying ? 'Yes ✓' : 'No'}

### WATERING
- Frequency: ${plant.water.frequency}
- Amount: ${plant.water.amount}
- Tips: ${plant.water.tips.join('; ')}
- Overwatering signs: ${plant.water.signs.overwatered.join(', ')}
- Underwatering signs: ${plant.water.signs.underwatered.join(', ')}

### LIGHT
- Ideal: ${plant.light.ideal}
- Tolerance: ${plant.light.tolerance}
- Tips: ${plant.light.tips.join('; ')}

### SOIL
- Type: ${plant.soil.type}
- pH: ${plant.soil.ph}
- Mix: ${plant.soil.mix}

### HUMIDITY & TEMPERATURE
- Humidity: ${plant.humidity.ideal}
- Temperature: ${plant.temperature.ideal}
- Indian Climate: ${plant.temperature.indianClimate}

### FERTILIZER
- Type: ${plant.fertilizer.type}
- Frequency: ${plant.fertilizer.frequency}
- Tips: ${plant.fertilizer.tips.join('; ')}

### PROPAGATION
${plant.propagation.join('\n- ')}

### COMMON PROBLEMS
- Pests: ${plant.commonPests.join(', ')}
- Diseases: ${plant.commonDiseases.join(', ')}

### TROUBLESHOOTING
${Object.entries(plant.troubleshooting).map(([prob, sol]) => `- ${prob}: ${sol}`).join('\n')}

### PRO TIPS
${plant.proTips.join('\n- ')}

### FUN FACTS
${plant.funFacts.join('\n- ')}

### BEST FOR
${plant.bestFor.join(', ')}
`;
  }

  private buildProblemContext(symptoms: string): string {
    const problem = diagnoseProblem(symptoms);
    if (!problem) return '';

    return `
## PROBLEM DIAGNOSIS
Urgency: ${problem.urgency.toUpperCase()}

### SYMPTOMS
${problem.symptoms.join('\n- ')}

### POSSIBLE CAUSES
${problem.causes.map((c, i) => `${i + 1}. ${c}`).join('\n')}

### SOLUTIONS
${problem.solutions.map((s, i) => `${i + 1}. ${s}`).join('\n')}

### PREVENTION
${problem.prevention.join('\n- ')}
`;
  }

  private buildSeasonalContext(): string {
    const season = getCurrentSeason();
    const tips = SEASONAL_CARE[season];
    const monthlyTasks = getSeasonalTasks();
    
    return `
## CURRENT SEASON: ${season.toUpperCase()} (India)
Months: ${tips.months.join(', ')}

### SEASONAL TIPS
${tips.generalTips.slice(0, 5).join('\n- ')}

### CURRENT MONTH TASKS
Activity: ${monthlyTasks.activity}
${monthlyTasks.tasks.join('\n- ')}

### WATCH OUT FOR
${tips.problems.join(', ')}
`;
  }

  // ==========================================================================
  // NEW: BUILD TRENDS CONTEXT
  // ==========================================================================

  private buildTrendsContext(question: string): string {
    const relevantTrends = searchTrends(question);
    if (relevantTrends.length === 0) {
      // Return top trending info
      const topTrend = PLANT_TRENDS_2024_2026[0];
      return `
## TRENDING NOW IN 2024-2026 🔥
Trend: ${topTrend.name}
${topTrend.description}
Top plants: ${topTrend.bestPlants.slice(0, 5).join(', ')}
`;
    }
    
    return relevantTrends.slice(0, 2).map(trend => `
## TRENDING: ${trend.name} 🔥
${trend.description}
Why trending: ${trend.whyTrending}
Best plants: ${trend.bestPlants.join(', ')}
Tips: ${trend.tips.slice(0, 3).join('; ')}
`).join('\n');
  }

  // ==========================================================================
  // NEW: BUILD CITY-SPECIFIC CONTEXT
  // ==========================================================================

  private buildCityContext(city?: string): string {
    if (!city) return this.buildDefaultCityContext();
    
    const normalizedCity = city.toLowerCase() as keyof typeof INDIAN_MARKET_INSIGHTS.popularCities;
    const cityInfo = INDIAN_MARKET_INSIGHTS.popularCities[normalizedCity];
    
    if (!cityInfo) return this.buildDefaultCityContext();
    
    return `
## CITY-SPECIFIC ADVICE: ${city.toUpperCase()}
Climate: ${cityInfo.climate}
Challenges: ${cityInfo.challenges.join(', ')}
Best plants for ${city}: ${cityInfo.bestPlants.join(', ')}
Local tip: ${cityInfo.tips[0]}
`;
  }

  private buildDefaultCityContext(): string {
    const bangalore = INDIAN_MARKET_INSIGHTS.popularCities.bangalore;
    return `
## LOCATION: BANGALORE (Default)
Climate: ${bangalore.climate}
Best plants: ${bangalore.bestPlants.join(', ')}
Tip: ${bangalore.tips[0]}
`;
  }

  // ==========================================================================
  // NEW: BUILD ADVANCED TROUBLESHOOTING CONTEXT
  // ==========================================================================

  private buildAdvancedDiagnosisContext(symptoms: string): string {
    const diagnosed = diagnoseBySymptom(symptoms);
    let context = '';
    
    if (diagnosed) {
      context += `
## SYMPTOM ANALYSIS
Likely cause: ${diagnosed.cause}
Diagnosis approach: ${diagnosed.diagnosis}
Recommended solution: ${diagnosed.solution}
`;
    }
    
    // Add root health guide if relevant
    if (/root|rot|mushy|smell/i.test(symptoms)) {
      const rootGuide = ADVANCED_TROUBLESHOOTING.rootHealthDiagnosis;
      context += `
## ROOT HEALTH REFERENCE
Healthy roots: ${rootGuide.healthy}
Rotting signs: ${rootGuide.rotting}
Treatment steps: ${rootGuide.treatment.rootRot.slice(0, 4).join('; ')}
`;
    }
    
    // Add pest identification if relevant
    if (/pest|bug|insect|web|sticky|cotton|white|black fly/i.test(symptoms)) {
      context += `
## PEST IDENTIFICATION GUIDE
- Mealybugs: White cottony masses → treat with rubbing alcohol
- Spider mites: Fine webbing, stippled leaves → increase humidity, neem oil
- Fungus gnats: Small black flies in soil → let soil dry, sticky traps
- Aphids: Clustered on new growth → spray off with water, neem oil
- Scale: Brown bumps on stems → scrape off, rubbing alcohol
`;
    }
    
    return context;
  }

  private buildProductContext(): string {
    if (this.cachedProducts.length === 0) return '';
    
    const productList = this.cachedProducts
      .slice(0, 20)
      .map((p) => `- ${p.name} (₹${p.price}) - ${p.categories?.[0]?.name || 'Plants'}`)
      .join('\n');
    
    return `
## AVAILABLE PRODUCTS AT WHOLE LOT OF NATURE
${productList}

When relevant, recommend these products to help the customer.
`;
  }

  private buildRecommendationLists(): string {
    const beginnerPlants = findBeginnerPlants().slice(0, 5).map(p => p.name).join(', ');
    const petSafePlants = findPetSafePlants().slice(0, 5).map(p => p.name).join(', ');
    const airPurifying = findAirPurifyingPlants().slice(0, 5).map(p => p.name).join(', ');
    
    return `
## QUICK RECOMMENDATIONS
- Beginner-Friendly: ${beginnerPlants}
- Pet-Safe: ${petSafePlants}
- Air Purifying: ${airPurifying}
`;
  }

  // ==========================================================================
  // PRODUCT MATCHING
  // ==========================================================================

  private scoreProduct(product: WooCommerceProduct, question: string, context?: PlantsyQuestionContext): number {
    let score = 0;
    const normalizedQuestion = question.toLowerCase();

    const applyMatch = (text?: string, weight = 1) => {
      if (!text) return;
      text.toLowerCase().split(/[^a-z0-9]+/).forEach((token) => {
        if (token && token.length > 2 && normalizedQuestion.includes(token)) {
          score += weight;
        }
      });
    };

    applyMatch(product.name, 3);
    applyMatch(product.short_description, 1.5);
    applyMatch(product.description, 1);
    product.categories?.forEach((cat) => applyMatch(cat.name, 2));
    product.tags?.forEach((tag) => applyMatch(tag.name, 2));

    // Boost for specific categories
    if (context?.preferredCategory) {
      const category = context.preferredCategory;
      const match = product.categories?.some(
        (cat) => cat.slug === category || cat.name.toLowerCase().includes(category.toLowerCase())
      );
      if (match) score += 3;
    }

    // Boost for pet-safe if mentioned
    if (/pet|cat|dog|safe/i.test(normalizedQuestion)) {
      const petSafe = product.tags?.some((tag) => /pet|safe|non.?toxic/i.test(tag.name));
      if (petSafe) score += 3;
    }

    // Boost for beginner if mentioned
    if (/beginner|easy|simple|low.?maintenance/i.test(normalizedQuestion)) {
      const easy = product.tags?.some((tag) => /easy|beginner|low/i.test(tag.name));
      if (easy) score += 2;
    }

    return score;
  }

  private getRecommendedProducts(question: string, context?: PlantsyQuestionContext): WooCommerceProduct[] {
    return this.cachedProducts
      .map((product) => ({ product, score: this.scoreProduct(product, question, context) }))
      .filter(({ score }) => score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 3)
      .map(({ product }) => product);
  }

  // ==========================================================================
  // CARE PLAN GENERATION
  // ==========================================================================

  private generateCarePlan(plant: PlantCareInfo): string[] {
    const season = getCurrentSeason();
    const carePlan: string[] = [];

    // Watering tip
    carePlan.push(`💧 **Water**: ${plant.water.frequency} - ${plant.water.tips[0]}`);

    // Light tip
    carePlan.push(`☀️ **Light**: ${plant.light.ideal} - ${plant.light.tips[0]}`);

    // Seasonal tip
    if (season === 'summer') {
      carePlan.push('🌡️ **Summer tip**: Increase watering and provide shade from harsh afternoon sun.');
    } else if (season === 'monsoon') {
      carePlan.push('🌧️ **Monsoon tip**: Reduce watering and ensure good drainage to prevent root rot.');
    } else if (season === 'winter') {
      carePlan.push('❄️ **Winter tip**: Reduce watering and fertilizing - your plant is resting.');
    }

    // Fertilizer tip
    carePlan.push(`🌱 **Feed**: ${plant.fertilizer.frequency} with ${plant.fertilizer.type.toLowerCase()}`);

    // Pro tip
    if (plant.proTips.length > 0) {
      carePlan.push(`💡 **Pro tip**: ${plant.proTips[0]}`);
    }

    return carePlan;
  }

  // ==========================================================================
  // FOLLOW-UP QUESTIONS
  // ==========================================================================

  private generateFollowUpQuestions(question: string, intent: string, plant?: PlantCareInfo): string[] {
    const followUps: string[] = [];
    const lowerQ = question.toLowerCase();

    if (intent === 'diagnosis' || intent === 'yellow-leaves' || intent === 'brown-tips') {
      if (!lowerQ.includes('water')) followUps.push('How often are you watering your plant?');
      if (!lowerQ.includes('light')) followUps.push('What kind of light does it get?');
      followUps.push('Can you describe your plant\'s environment?');
    } else if (intent === 'care-guide' && plant) {
      if (!lowerQ.includes('propagat')) followUps.push(`Would you like to know how to propagate ${plant.name}?`);
      if (!lowerQ.includes('problem')) followUps.push('What challenges are you facing with this plant?');
      followUps.push('Would you like specific seasonal care tips?');
    } else if (intent === 'recommendation') {
      followUps.push('What\'s your experience level with plants?');
      followUps.push('Do you have pets at home?');
      followUps.push('How much light does your space get?');
    } else {
      followUps.push('Would you like care tips for any specific plant?');
      followUps.push('Are you looking for plant recommendations?');
      followUps.push('Need help troubleshooting a plant problem?');
    }

    return followUps.slice(0, 3);
  }

  // ==========================================================================
  // ARTICLE SELECTION
  // ==========================================================================

  private selectArticles(question: string): PlantsyReference[] {
    const normalized = question.toLowerCase();
    return this.cachedArticles
      .slice(0, 5)
      .filter((post) => {
        const title = post.title.rendered.toLowerCase();
        const excerpt = post.excerpt.rendered.toLowerCase();
        return normalized.split(' ').some((token) => 
          token.length > 3 && (title.includes(token) || excerpt.includes(token))
        );
      })
      .slice(0, 2)
      .map((post) => ({
        type: 'article' as const,
        title: post.title.rendered.replace(/<[^>]+>/g, ''),
        url: post.link,
        snippet: post.excerpt.rendered.replace(/<[^>]+>/g, '').slice(0, 140) + '…',
      }));
  }

  // ==========================================================================
  // FALLBACK RESPONSES
  // ==========================================================================

  private generateFallbackResponse(intent: string, plant?: PlantCareInfo): string {
    const greeting = PLANTSY_PERSONALITY.greetings[Math.floor(Math.random() * PLANTSY_PERSONALITY.greetings.length)];
    const closing = PLANTSY_PERSONALITY.closings[Math.floor(Math.random() * PLANTSY_PERSONALITY.closings.length)];
    const funFact = PLANTSY_PERSONALITY.funFacts[Math.floor(Math.random() * PLANTSY_PERSONALITY.funFacts.length)];

    if (intent === 'greeting') {
      return `${greeting}\n\nI can help you with:\n- 🌱 Plant care guides & tips\n- 🔍 Diagnosing plant problems\n- 🛒 Product recommendations\n- 🌡️ Seasonal care advice\n\nWhat would you like to know?`;
    }

    if (intent === 'thanks') {
      return `You're welcome! 😊 It's always a pleasure helping fellow plant lovers. ${funFact}\n\n${closing}`;
    }

    if (plant) {
      const carePlan = this.generateCarePlan(plant);
      return `Here's a quick care guide for **${plant.name}** (${plant.scientificName}):\n\n${carePlan.join('\n\n')}\n\n${plant.bestFor.length > 0 ? `Best for: ${plant.bestFor.join(', ')}` : ''}\n\n${closing}`;
    }

    return PLANTSY_PERSONALITY.unknownResponses[Math.floor(Math.random() * PLANTSY_PERSONALITY.unknownResponses.length)];
  }

  // ==========================================================================
  // MAIN ANSWER FUNCTION
  // ==========================================================================

  public async answerQuestion(question: string, context?: PlantsyQuestionContext): Promise<PlantsyResponse> {
    await this.ensureKnowledgeBase();

    // Detect intent and entities with mood
    const { intent, entities, mood } = this.detectIntent(question);
    
    // Find relevant plant
    const plant = findPlantByName(question);
    
    // Build comprehensive contextual information for AI
    let knowledgeContext = '';
    
    // Add mood-appropriate opener
    if (mood === 'empathetic') {
      knowledgeContext += `\n## MOOD GUIDANCE\n${getRandomPattern('empathyResponses')}\nLead with empathy before problem-solving.\n`;
    } else if (mood === 'celebratory') {
      knowledgeContext += `\n## MOOD GUIDANCE\n${getRandomPattern('celebrationResponses')}\nCelebrate their success!\n`;
    }
    
    // Core context
    knowledgeContext += this.buildSeasonalContext();
    knowledgeContext += this.buildRecommendationLists();
    
    // City-specific context
    knowledgeContext += this.buildCityContext(context?.city);
    
    if (plant) {
      knowledgeContext += this.buildPlantContext(plant.name);
    }
    
    // Add problem/diagnosis context if relevant
    if (['diagnosis', 'yellow-leaves', 'brown-tips', 'wilting', 'pests', 'mealybugs', 'spider-mites', 'root-rot'].includes(intent)) {
      knowledgeContext += this.buildProblemContext(question);
      knowledgeContext += this.buildAdvancedDiagnosisContext(question);
    }
    
    // Add trends context if relevant
    if (intent === 'trends' || /trend|popular|aesthetic|instagram/i.test(question)) {
      knowledgeContext += this.buildTrendsContext(question);
    }
    
    knowledgeContext += this.buildProductContext();

    // Build conversation history context
    let conversationContext = '';
    if (context?.conversationHistory && context.conversationHistory.length > 0) {
      const recentHistory = context.conversationHistory.slice(-6);
      conversationContext = '\n\n## RECENT CONVERSATION\n' + 
        recentHistory.map(msg => `${msg.role.toUpperCase()}: ${msg.content}`).join('\n\n');
    }

    // Select appropriate prompt based on intent
    let intentPrompt = '';
    if (intent === 'diagnosis') {
      intentPrompt = `\n\n${DIAGNOSIS_PROMPT}`;
    } else if (intent === 'recommendation') {
      intentPrompt = `\n\n${RECOMMENDATION_PROMPT}`;
    }

    // Complete AI prompt
    const fullSystemPrompt = `${SYSTEM_PROMPT}${intentPrompt}

${knowledgeContext}
${conversationContext}

Remember: You're chatting with a plant parent who needs your help. Match the detected mood (${mood}) in your response!
Use natural conversational language with appropriate warmth and expertise.`;

    // Get recommended products
    const recommendedProducts = this.getRecommendedProducts(question, context);
    
    let aiAnswer: string;
    let confidence: 'low' | 'medium' | 'high' = 'medium';

    try {
      aiAnswer = await aiService.complete(question, {
        systemPrompt: fullSystemPrompt,
        temperature: 0.78, // Slightly higher for more natural conversation
        maxTokens: 900,
      });
      confidence = 'high';
    } catch (error) {
      console.error('AI completion failed:', error);
      // Fall back to enhanced knowledge-base response
      aiAnswer = this.generateEnhancedFallbackResponse(intent, mood, plant ?? undefined);
      confidence = plant ? 'medium' : 'low';
    }

    // Extract care plan from response or generate from plant data
    let carePlan: string[] = [];
    if (plant) {
      carePlan = this.generateCarePlan(plant);
    } else {
      // Try to extract tips from AI response
      const lines = aiAnswer.split('\n');
      for (const line of lines) {
        const trimmed = line.trim();
        if (/^[-*•🌱💧☀️🌡️❄️🌧️💡]\s+/.test(trimmed) || /^\d+\.\s+/.test(trimmed)) {
          const cleanLine = trimmed.replace(/^[-*•🌱💧☀️🌡️❄️🌧️💡]\s+/, '').replace(/^\d+\.\s+/, '');
          if (cleanLine.length > 10 && cleanLine.length < 200) {
            carePlan.push(cleanLine);
          }
        }
      }
      carePlan = carePlan.slice(0, 5);
    }

    // Build references including trends
    const references: PlantsyReference[] = [
      ...recommendedProducts.slice(0, 2).map((product) => ({
        type: 'product' as const,
        title: product.name,
        url: `/shop/${product.slug}`,
        snippet: product.short_description?.replace(/<[^>]+>/g, '').slice(0, 100) || `Premium ${product.name}`,
      })),
      ...this.selectArticles(question),
    ];
    
    // Add trend reference if relevant
    const relevantTrends = searchTrends(question);
    if (relevantTrends.length > 0) {
      references.push({
        type: 'trend' as const,
        title: `Trending: ${relevantTrends[0].name}`,
        url: '/blog/plant-trends-2024',
        snippet: relevantTrends[0].description.slice(0, 100),
      });
    }

    // Generate follow-up questions
    const followUpQuestions = this.generateFollowUpQuestions(question, intent, plant ?? undefined);
    
    // Get a trending tip
    const trendingTip = getTrendingPlants().slice(0, 3).join(', ');

    return {
      answer: aiAnswer,
      carePlan,
      confidence,
      followUpQuestions,
      references,
      recommendedProducts: recommendedProducts.map((product) => ({
        id: product.id,
        name: product.name,
        slug: product.slug,
        images: product.images,
        price: product.price,
      })),
      detectedPlant: plant?.name,
      detectedProblem: diagnoseProblem(question) ? intent : undefined,
      mood,
      trendingTip: `🔥 Trending: ${trendingTip}`,
    };
  }

  // ==========================================================================
  // ENHANCED FALLBACK RESPONSE
  // ==========================================================================

  private generateEnhancedFallbackResponse(intent: string, mood: string, plant?: PlantCareInfo): string {
    // Get mood-appropriate opener
    let opener = '';
    if (mood === 'empathetic') {
      opener = getRandomPattern('empathyResponses') + '\n\n';
    } else if (mood === 'celebratory') {
      opener = getRandomPattern('celebrationResponses') + '\n\n';
    }
    
    const transition = getRandomPattern('transitions');
    const closing = getRandomPattern('closings');
    const funFact = getRandomPattern('funResponses');

    if (intent === 'greeting') {
      return `Hey there, plant friend! 🌱 Welcome to Whole Lot of Nature!\n\nI'm Plantsy, your personal plant whisperer. I can help you with:\n\n• 🌿 Finding the perfect plants for your space\n• 💧 Care guides tailored to Indian climates\n• 🔍 Diagnosing plant problems (I'm like a plant doctor!)\n• 📈 What's trending in the plant world\n\n${funFact}\n\nSo, what brings you to the green side today?`;
    }

    if (intent === 'thanks') {
      return `${opener}You're so welcome! 😊 It warms my leafy heart to hear from happy plant parents.\n\n${funFact}\n\n${closing}`;
    }

    if (plant) {
      const carePlan = this.generateCarePlan(plant);
      return `${opener}${transition} here's everything you need to know about **${plant.name}** (${plant.scientificName}):\n\n${carePlan.join('\n\n')}\n\n✨ **Best for**: ${plant.bestFor.join(', ')}\n\n💡 **Pro tip**: ${plant.proTips[0]}\n\n${closing}`;
    }

    if (intent === 'beginner-help') {
      const beginnerReassurance = getRandomPattern('beginnerReassurance');
      const beginnerPlants = findBeginnerPlants().slice(0, 5).map(p => p.name).join(', ');
      return `${beginnerReassurance}\n\n${transition} here are some nearly-unkillable plants to start with:\n\n🌱 **Perfect for beginners**: ${beginnerPlants}\n\nThese plants are forgiving, adaptable, and will give you confidence. Start with one or two, learn their rhythms, and you'll be a plant pro before you know it!\n\n${closing}`;
    }

    return `${opener}${PLANTSY_PERSONALITY.unknownResponses[Math.floor(Math.random() * PLANTSY_PERSONALITY.unknownResponses.length)]}\n\n${closing}`;
  }
}

// ============================================================================
// EXPORT SINGLETON INSTANCE
// ============================================================================

const plantsyAgent = new PlantDoctorAgent();
export default plantsyAgent;
