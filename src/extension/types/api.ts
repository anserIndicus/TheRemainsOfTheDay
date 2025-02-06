export interface DeepSeekConfig {
  apiKey: string;
  apiEndpoint: string;
  maxTokens: number;
  temperature: number;
  enabled: boolean;
}

export interface DeepSeekResponse {
  id: string;
  choices: {
    text: string;
    index: number;
    finish_reason: string;
  }[];
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

export interface SummaryRequest {
  content: string;
  url: string;
  timestamp: number;
}

export interface SummaryResponse {
  summary: string;
  keywords: string[];
  category: string;
  importance: 'high' | 'medium' | 'low';
}
