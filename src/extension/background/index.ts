import { storage } from './storage';
import { SyncManager } from './sync';
import { ReportGenerator } from './report-generator';
import { ContentItem } from '../content/types';
import { APIService } from '../utils/api-service';

export class BackgroundService {
  private static instance: BackgroundService;
  private syncManager: SyncManager;
  private reportGenerator: ReportGenerator;
  private apiService: APIService;

  private constructor() {
    this.syncManager = new SyncManager();
    this.reportGenerator = new ReportGenerator(storage);
    this.apiService = APIService.getInstance();
    this.setupMessageHandlers();
    this.initialize();
  }

  private async initialize(): Promise<void> {
    await this.apiService.initialize();
  }

  public static getInstance(): BackgroundService {
    if (!BackgroundService.instance) {
      BackgroundService.instance = new BackgroundService();
    }
    return BackgroundService.instance;
  }

  private setupMessageHandlers(): void {
    chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
      this.handleMessage(message, sender, sendResponse);
      return true; // 保持消息通道开放
    });

    // 设置定期同步任务
    setInterval(() => {
      this.syncManager.sync().catch((error) => {
        console.error('自动同步失败:', error instanceof Error ? error.message : String(error));
      });
    }, 5 * 60 * 1000); // 每5分钟同步一次
  }

  private async handleMessage(
    message: any,
    sender: chrome.runtime.MessageSender,
    sendResponse: (response?: any) => void
  ): Promise<void> {
    try {
      switch (message.type) {
        case 'SAVE_CONTENT':
          await this.handleSaveContent(message.items);
          sendResponse({ success: true });
          break;

        case 'GET_STATS':
          const stats = await this.handleGetStats();
          sendResponse(stats);
          break;

        case 'FORCE_SYNC':
          await this.syncManager.sync();
          sendResponse({ success: true });
          break;

        case 'GENERATE_REPORT':
          const report = await this.reportGenerator.generateDailyReport(message.date);
          sendResponse({ success: true, report });
          break;

        case 'TEST_API':
          const testResult = await this.testAPIConnection();
          sendResponse(testResult);
          break;

        default:
          console.warn('Unknown message type:', message.type);
          sendResponse({ success: false, error: 'Unknown message type' });
      }
    } catch (error) {
      console.error('Error handling message:', error instanceof Error ? error.message : String(error));
      sendResponse({ success: false, error: error instanceof Error ? error.message : 'Unknown error' });
    }
  }

  private async handleSaveContent(items: ContentItem[]): Promise<void> {
    for (const item of items) {
      try {
        // 尝试使用 DeepSeek API 生成摘要
        const summary = await this.apiService.generateSummary({
          content: item.content,
          url: item.url,
          timestamp: item.timestamp
        });

        // 将摘要信息添加到内容项中
        const enrichedItem: ContentItem = {
          ...item,
          metadata: {
            ...item.metadata,
            summary: summary.summary,
            keywords: summary.keywords,
            category: summary.category,
            aiImportance: summary.importance
          }
        };

        await storage.saveContent(enrichedItem);
      } catch (error) {
        console.error('Failed to generate summary:', error);
        // 如果 API 调用失败，仍然保存原始内容
        await storage.saveContent(item);
      }
    }
  }

  private async handleGetStats() {
    const contents = await storage.getAllContent();
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    return {
      todayCount: contents.filter(item => item.timestamp >= todayStart.getTime()).length,
      totalCount: contents.length,
      lastSync: contents.length > 0 ? Math.max(...contents.map(item => item.timestamp)) : null
    };
  }

  private async testAPIConnection() {
    try {
      await this.apiService.generateSummary({
        content: 'This is a test content.',
        url: 'https://test.com',
        timestamp: Date.now()
      });
      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      };
    }
  }
}

// 初始化后台服务
BackgroundService.getInstance();
