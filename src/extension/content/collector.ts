import { ContentProcessor } from '../utils/content-processor';
import { ContentItem, ContentType, ImportanceLevel, CollectorOptions, ContentMetadata } from './types';

export class ContentCollector {
  private static instance: ContentCollector | null = null;
  private options: CollectorOptions = {
    includeComments: true,
    minContentLength: 50,
    maxContentLength: 10000,
    excludeSelectors: []
  };

  private constructor() {}

  public static getInstance(): ContentCollector {
    if (!ContentCollector.instance) {
      ContentCollector.instance = new ContentCollector();
    }
    return ContentCollector.instance;
  }

  public setOptions(options: Partial<CollectorOptions>): void {
    this.options = { ...this.options, ...options };
  }

  public collectPageContent(): ContentItem[] {
    const items: ContentItem[] = [];
    const mainContent = this.collectMainContent();
    items.push(...mainContent);
    return items;
  }

  private collectMainContent(): ContentItem[] {
    const items: ContentItem[] = [];
    const mainElements = document.querySelectorAll('main, article, .main, .content, .article');
    
    if (mainElements.length === 0) {
      return this.collectFromBody();
    }

    mainElements.forEach(element => {
      if (element instanceof Element && this.isValidElement(element)) {
        const content = this.extractContentFromElement(element);
        items.push(content);
      }
    });

    return items;
  }

  private collectFromBody(): ContentItem[] {
    const items: ContentItem[] = [];
    const bodyElements = Array.from(document.body.children);
    
    bodyElements.forEach(element => {
      if (element instanceof Element && this.isValidElement(element)) {
        const content = this.extractContentFromElement(element);
        items.push(content);
      }
    });

    return items;
  }

  private extractContentFromElement(element: Element): ContentItem {
    const text = element.textContent?.trim() || '';
    const metadata: ContentMetadata = this.createMetadata(element);

    return {
      id: crypto.randomUUID(),
      type: ContentType.TEXT,
      content: text,
      url: window.location.href,
      timestamp: Date.now(),
      importance: ImportanceLevel.MEDIUM,
      weight: this.calculateWeight(element),
      metadata,
      synced: 0
    };
  }

  private extractAuthor(element: Element): string | undefined {
    const authorElement = element.querySelector('[rel="author"], .author, .byline');
    return authorElement?.textContent?.trim();
  }

  private extractPublishTime(element: Element): number | undefined {
    const timeElement = element.querySelector('time, [datetime], .published, .date');
    if (timeElement) {
      const datetime = timeElement.getAttribute('datetime');
      if (datetime) {
        return new Date(datetime).getTime();
      }
      const textContent = timeElement.textContent?.trim();
      if (textContent) {
        const timestamp = new Date(textContent).getTime();
        if (!isNaN(timestamp)) {
          return timestamp;
        }
      }
    }
    return undefined;
  }

  private calculateWeight(element: Element): number {
    let weight = 1;
    const text = element.textContent || '';
    
    // 基于内容长度计算权重
    weight += Math.min(text.length / 1000, 5);

    // 基于元素位置计算权重
    const rect = element.getBoundingClientRect();
    if (rect.top < window.innerHeight) {
      weight += 2;
    }

    // 基于互动元素计算权重
    const interactiveElements = element.querySelectorAll('a, button, input');
    weight += interactiveElements.length * 0.5;

    return Math.min(weight, 10);
  }

  private createMetadata(element: Element): ContentMetadata {
    return {
      title: document.title || '',
      type: 'text',
      isComment: false,
      commentCount: 0,
      tags: [],
      author: this.extractAuthor(element),
      publishTime: this.extractPublishTime(element) || Date.now()
    };
  }

  private isValidElement(element: Element): boolean {
    if (!element.textContent) return false;
    
    // 检查是否在排除列表中
    if (this.options.excludeSelectors) {
      for (const selector of this.options.excludeSelectors) {
        if (element.matches(selector)) {
          return false;
        }
      }
    }
    
    const contentLength = element.textContent.trim().length;
    return contentLength >= this.options.minContentLength && 
           (this.options.maxContentLength === undefined || contentLength <= this.options.maxContentLength) &&
           !this.isHiddenElement(element);
  }

  private isHiddenElement(element: Element): boolean {
    const style = window.getComputedStyle(element);
    return style.display === 'none' || 
           style.visibility === 'hidden' || 
           style.opacity === '0';
  }

  public startCollection(): void {
    console.log('开始内容收集');
  }

  public stopCollection(): void {
    console.log('停止内容收集');
  }
}
