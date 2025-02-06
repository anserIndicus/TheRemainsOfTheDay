import { DeepSeekConfig, DeepSeekResponse, SummaryRequest, SummaryResponse } from '../types/api';

export class APIService {
  private static instance: APIService;
  private config: DeepSeekConfig = {
    apiKey: '',
    apiEndpoint: 'https://api.deepseek.com/v1/chat/completions',
    maxTokens: 500,
    temperature: 0.7,
    enabled: false
  };

  private constructor() {}

  public static getInstance(): APIService {
    if (!APIService.instance) {
      APIService.instance = new APIService();
    }
    return APIService.instance;
  }

  public async initialize(): Promise<void> {
    const result = await chrome.storage.sync.get('deepseekConfig');
    if (result.deepseekConfig) {
      this.config = { ...this.config, ...result.deepseekConfig };
    }
  }

  public async updateConfig(config: Partial<DeepSeekConfig>): Promise<void> {
    this.config = { ...this.config, ...config };
    await chrome.storage.sync.set({ deepseekConfig: this.config });
  }

  public async generateSummary(request: SummaryRequest): Promise<SummaryResponse> {
    if (!this.config.enabled || !this.config.apiKey) {
      throw new Error('DeepSeek API is not configured or disabled');
    }

    const prompt = this.generatePrompt(request);
    
    try {
      const response = await fetch(this.config.apiEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.config.apiKey}`
        },
        body: JSON.stringify({
          model: 'deepseek-chat',
          messages: [
            {
              role: 'user',
              content: prompt
            }
          ],
          max_tokens: this.config.maxTokens,
          temperature: this.config.temperature
        })
      });

      if (!response.ok) {
        throw new Error(`API request failed: ${response.statusText}`);
      }

      const data: DeepSeekResponse = await response.json();
      return this.parseSummaryResponse(data);
    } catch (error) {
      console.error('Failed to generate summary:', error);
      throw error;
    }
  }

  private generatePrompt(request: SummaryRequest): string {
    return `Please analyze the following web content and provide:
1. A concise summary (max 3 sentences)
2. Key topics/keywords (max 5)
3. Content category
4. Importance level (high/medium/low) based on content value

Content from ${request.url}:
${request.content}

Format your response as JSON with the following structure:
{
  "summary": "...",
  "keywords": ["..."],
  "category": "...",
  "importance": "..."
}`;
  }

  private parseSummaryResponse(response: DeepSeekResponse): SummaryResponse {
    try {
      const result = JSON.parse(response.choices[0].text);
      return {
        summary: result.summary,
        keywords: result.keywords,
        category: result.category,
        importance: result.importance as 'high' | 'medium' | 'low'
      };
    } catch (error) {
      console.error('Failed to parse API response:', error);
      throw new Error('Invalid API response format');
    }
  }
}
