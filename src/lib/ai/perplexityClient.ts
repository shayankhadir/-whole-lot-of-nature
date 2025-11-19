type ChatMessage = {
  role: 'system' | 'user' | 'assistant';
  content: string;
};

interface PerplexityChoiceMessage {
  role: string;
  content:
    | string
    | Array<{
        type?: string;
        text?: string;
      }>;
}

interface PerplexityChatCompletionResponse {
  choices?: Array<{
    index: number;
    finish_reason?: string;
    message?: PerplexityChoiceMessage;
  }>;
  usage?: {
    prompt_tokens?: number;
    completion_tokens?: number;
    total_tokens?: number;
  };
  error?: {
    code?: string;
    message?: string;
  };
}

export interface PerplexityCompletionOptions {
  model?: string;
  temperature?: number;
  topP?: number;
  maxTokens?: number;
  frequencyPenalty?: number;
  presencePenalty?: number;
  systemPrompt?: string;
  signal?: AbortSignal;
}

/**
 * Lightweight helper around the Perplexity /chat/completions API.
 */
class PerplexityClient {
  private readonly endpoint = 'https://api.perplexity.ai/chat/completions';

  constructor(private readonly apiKey: string = process.env.PERPLEXITY_API_KEY || process.env.OPENAI_API_KEY || '') {}

  isConfigured(): boolean {
    return Boolean(this.apiKey);
  }

  async complete(prompt: string, options: PerplexityCompletionOptions = {}): Promise<string> {
    if (!this.apiKey) {
      throw new Error('Missing Perplexity API key');
    }

    const body = {
      model: options.model ?? 'llama-3.1-sonar-large-128k-online',
      messages: this.buildMessages(prompt, options.systemPrompt),
      temperature: options.temperature ?? 0.45,
      top_p: options.topP ?? 0.9,
      max_tokens: options.maxTokens ?? 2000,
      presence_penalty: options.presencePenalty ?? 0,
      frequency_penalty: options.frequencyPenalty ?? 0,
      stream: false,
    };

    const response = await fetch(this.endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.apiKey}`,
      },
      body: JSON.stringify(body),
      signal: options.signal,
    });

    const raw = await response.text();

    if (!response.ok) {
      throw new Error(`Perplexity API error ${response.status}: ${raw}`);
    }

    const data = JSON.parse(raw) as PerplexityChatCompletionResponse;

    if (data.error) {
      throw new Error(`Perplexity API responded with an error: ${data.error.message ?? 'unknown error'}`);
    }

    const content = data.choices?.[0]?.message?.content;
    if (!content) {
      throw new Error('Perplexity API returned no content');
    }

    return this.normalizeContent(content);
  }

  private buildMessages(prompt: string, systemPrompt?: string): ChatMessage[] {
    return [
      {
        role: 'system',
        content:
          systemPrompt ??
          'You are a senior horticulture copywriter for a premium Indian gardening brand. Use data-backed insights, specific plant care steps, and empathetic coaching language.',
      },
      { role: 'user', content: prompt.trim() },
    ];
  }

  private normalizeContent(
    content: string | Array<{ type?: string; text?: string }>
  ): string {
    if (typeof content === 'string') {
      return content.trim();
    }

    return content
      .map((chunk) => chunk?.text ?? '')
      .filter((text) => text && text.trim().length > 0)
      .join('\n')
      .trim();
  }
}

export default PerplexityClient;
