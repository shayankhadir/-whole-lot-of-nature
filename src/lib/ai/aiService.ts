/**
 * Universal AI Service for Whole Lot of Nature
 * Supports multiple providers: Groq (free), Together AI (free), Perplexity, OpenAI
 * 
 * Recommended Free Options:
 * 1. Groq - Very fast, generous free tier (https://console.groq.com)
 * 2. Together AI - Free tier available (https://api.together.xyz)
 * 3. Qwen AI via Alibaba Cloud - Free tier (https://dashscope.aliyun.com)
 */

export type AIProvider = 'groq' | 'together' | 'perplexity' | 'openai' | 'qwen';

interface AIMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

interface AICompletionOptions {
  provider?: AIProvider;
  model?: string;
  temperature?: number;
  maxTokens?: number;
  systemPrompt?: string;
}

interface ProviderConfig {
  endpoint: string;
  defaultModel: string;
  apiKeyEnv: string;
}

const PROVIDER_CONFIGS: Record<AIProvider, ProviderConfig> = {
  groq: {
    endpoint: 'https://api.groq.com/openai/v1/chat/completions',
    defaultModel: 'llama-3.3-70b-versatile', // Fast & free
    apiKeyEnv: 'GROQ_API_KEY',
  },
  together: {
    endpoint: 'https://api.together.xyz/v1/chat/completions',
    defaultModel: 'meta-llama/Llama-3.3-70B-Instruct-Turbo',
    apiKeyEnv: 'TOGETHER_API_KEY',
  },
  perplexity: {
    endpoint: 'https://api.perplexity.ai/chat/completions',
    defaultModel: 'llama-3.1-sonar-large-128k-online',
    apiKeyEnv: 'PERPLEXITY_API_KEY',
  },
  openai: {
    endpoint: 'https://api.openai.com/v1/chat/completions',
    defaultModel: 'gpt-4o-mini',
    apiKeyEnv: 'OPENAI_API_KEY',
  },
  qwen: {
    endpoint: 'https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions',
    defaultModel: 'qwen-turbo',
    apiKeyEnv: 'QWEN_API_KEY',
  },
};

class AIService {
  private getApiKey(provider: AIProvider): string | null {
    const envKey = PROVIDER_CONFIGS[provider].apiKeyEnv;
    return process.env[envKey] || null;
  }

  private getAvailableProvider(): AIProvider | null {
    // Priority order: Groq (free & fast), Together (free), Qwen (free), then paid
    const priority: AIProvider[] = ['groq', 'together', 'qwen', 'perplexity', 'openai'];
    
    for (const provider of priority) {
      if (this.getApiKey(provider)) {
        return provider;
      }
    }
    return null;
  }

  isConfigured(): boolean {
    return this.getAvailableProvider() !== null;
  }

  async complete(prompt: string, options: AICompletionOptions = {}): Promise<string> {
    const provider = options.provider || this.getAvailableProvider();
    
    if (!provider) {
      console.warn('No AI provider configured, using fallback response');
      return this.getFallbackResponse(prompt);
    }

    const apiKey = this.getApiKey(provider);
    if (!apiKey) {
      throw new Error(`API key not found for provider: ${provider}`);
    }

    const config = PROVIDER_CONFIGS[provider];
    const messages: AIMessage[] = [
      {
        role: 'system',
        content: options.systemPrompt || this.getDefaultSystemPrompt(),
      },
      {
        role: 'user',
        content: prompt,
      },
    ];

    try {
      const response = await fetch(config.endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: options.model || config.defaultModel,
          messages,
          temperature: options.temperature ?? 0.7,
          max_tokens: options.maxTokens ?? 1500,
          stream: false,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`AI API error (${provider}): ${response.status} - ${errorText}`);
      }

      const data = await response.json();
      const content = data.choices?.[0]?.message?.content;

      if (!content) {
        throw new Error('No content in AI response');
      }

      return typeof content === 'string' ? content.trim() : JSON.stringify(content);
    } catch (error) {
      console.error(`AI completion error (${provider}):`, error);
      return this.getFallbackResponse(prompt);
    }
  }

  private getDefaultSystemPrompt(): string {
    return `You are Plantsy, a friendly and knowledgeable plant care assistant for "Whole Lot of Nature" - a premium Indian plant store in Bangalore.

Your personality:
- Warm, helpful, and encouraging
- Expert in plants, gardening, soil mixes, and eco-friendly practices
- Aligned with the brand tagline "Stay Loyal to the Soil"
- Focused on sustainable, organic, and nature-friendly solutions

Guidelines:
- Give practical, actionable advice
- Use simple language that beginners can understand
- Recommend products from the store when relevant
- Include care tips specific to Indian climate conditions
- Be concise but thorough
- Always be positive and supportive`;
  }

  private getFallbackResponse(prompt: string): string {
    const lowercasePrompt = prompt.toLowerCase();
    
    // Contextual fallback responses based on common queries
    if (lowercasePrompt.includes('water') || lowercasePrompt.includes('watering')) {
      return `Great question about watering! 🌱

**General Watering Tips:**
- Check the top inch of soil - if dry, it's time to water
- Most plants prefer the "soak and dry" method
- Use room temperature water, preferably filtered or rainwater
- Water in the morning for best results
- Reduce watering in winter months

For specific plant guidance, let me know which plant you're caring for!`;
    }

    if (lowercasePrompt.includes('light') || lowercasePrompt.includes('sunlight')) {
      return `Light is essential for healthy plants! ☀️

**Light Requirements Guide:**
- **Bright indirect**: Most houseplants (near window, no direct sun)
- **Low light**: Snake plants, ZZ plants, pothos
- **Direct sun**: Succulents, cacti, herbs
- **Filtered light**: Ferns, calatheas, peace lilies

In Bangalore's climate, morning sun is gentler than harsh afternoon light. Place sensitive plants away from south-facing windows!`;
    }

    if (lowercasePrompt.includes('soil') || lowercasePrompt.includes('potting')) {
      return `Soil is the foundation of plant health - staying loyal to the soil! 🌿

**Soil Tips:**
- Use well-draining potting mix for most houseplants
- Add perlite or cocopeat for better drainage
- Succulents need sandy, gritty soil
- Refresh topsoil every few months with vermicompost

Check out our premium soil mixes specially formulated for Indian conditions!`;
    }

    if (lowercasePrompt.includes('pest') || lowercasePrompt.includes('bug') || lowercasePrompt.includes('insect')) {
      return `Dealing with pests? Let's fix that naturally! 🐛

**Eco-Friendly Pest Control:**
1. **Neem oil spray**: Mix 2ml neem oil + 1L water + few drops dish soap
2. **Remove affected leaves**: Isolate the plant immediately
3. **Increase airflow**: Pests love stagnant, humid conditions
4. **Spray weekly**: Until pests are gone

Prevention is key - regularly inspect leaves (especially undersides) and avoid overwatering!`;
    }

    if (lowercasePrompt.includes('beginner') || lowercasePrompt.includes('easy') || lowercasePrompt.includes('start')) {
      return `Welcome to your plant journey! 🌱

**Best Beginner Plants:**
1. **Snake Plant**: Thrives on neglect
2. **Pothos**: Nearly indestructible
3. **ZZ Plant**: Perfect for low light
4. **Spider Plant**: Air-purifying & forgiving
5. **Succulents**: Water once a week

Start with 2-3 plants, learn their needs, then expand your collection. We're here to help you succeed!`;
    }

    // Generic helpful response
    return `Thanks for reaching out! 🌿

I'm here to help with all your plant care questions. I can assist with:
- **Watering schedules** for specific plants
- **Light requirements** and placement tips
- **Soil recommendations** for different plant types
- **Pest control** using natural methods
- **Plant recommendations** for your space

What would you like to know more about? Feel free to ask anything - no question is too basic!`;
  }
}

export const aiService = new AIService();
export default AIService;
