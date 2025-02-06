import { ContentItem, ContentType, ContentMetadata, ImportanceLevel } from '../content/types';

const TIME_THRESHOLDS = {
  SHORT: 60000,    // 1分钟
  MEDIUM: 300000,  // 5分钟
  LONG: 900000     // 15分钟
};

export class ContentProcessor {
  private static readonly TYPE_WEIGHTS: Record<ContentType, number> = {
    [ContentType.TEXT]: 1,
    [ContentType.IMAGE]: 1,
    [ContentType.VIDEO]: 1.5,
    [ContentType.LINK]: 1,
    [ContentType.CODE]: 1,
    [ContentType.ARTICLE]: 1.5,
    [ContentType.COMMENT]: 0.8,
    [ContentType.SOCIAL_POST]: 1.2,
    [ContentType.SEARCH]: 0.5
  };

  static extractContent(element: Element): ContentItem[] {
    const content = element.textContent?.trim() || '';
    if (!content) {
      return [];
    }

    const metadata: ContentMetadata = {
      title: document.title || '',
      type: 'text',
      isComment: false,
      commentCount: 0,
      tags: [],
      author: this.extractAuthor(element),
      publishTime: this.extractPublishTime(element)
    };

    const contentType = this.determineContentType(element);
    const weight = this.calculateWeight(element);

    return [{
      id: crypto.randomUUID(),
      type: contentType,
      content,
      url: window.location.href,
      timestamp: Date.now(),
      importance: this.determineImportance(metadata.duration || 0),
      weight: weight * (this.TYPE_WEIGHTS[contentType] || 1),
      metadata,
      synced: 0
    }];
  }

  private static extractAuthor(element: Element): string | undefined {
    const authorElement = element.querySelector('[rel="author"], .author, .byline');
    return authorElement?.textContent?.trim();
  }

  private static extractPublishTime(element: Element): number | undefined {
    const timeElement = element.querySelector('time, [datetime], .published, .date');
    if (timeElement) {
      const datetime = timeElement.getAttribute('datetime');
      if (datetime) {
        return new Date(datetime).getTime();
      }
      return new Date(timeElement.textContent || '').getTime();
    }
    return undefined;
  }

  private static calculateWeight(element: Element): number {
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

  private static determineContentType(element: Element): ContentType {
    if (element.matches('article, .article')) {
      return ContentType.ARTICLE;
    }
    if (element.matches('.comment, [data-type="comment"]')) {
      return ContentType.COMMENT;
    }
    if (element.matches('video, .video')) {
      return ContentType.VIDEO;
    }
    if (element.matches('img, .image')) {
      return ContentType.IMAGE;
    }
    if (element.matches('code, pre')) {
      return ContentType.CODE;
    }
    if (element.matches('.social-post, [data-type="social"]')) {
      return ContentType.SOCIAL_POST;
    }
    if (element.matches('.search-result, [data-type="search"]')) {
      return ContentType.SEARCH;
    }
    return ContentType.TEXT;
  }

  private static determineImportance(duration: number): ImportanceLevel {
    if (duration >= TIME_THRESHOLDS.LONG) {
      return ImportanceLevel.HIGH;
    } else if (duration >= TIME_THRESHOLDS.MEDIUM) {
      return ImportanceLevel.MEDIUM;
    }
    return ImportanceLevel.LOW;
  }
}
