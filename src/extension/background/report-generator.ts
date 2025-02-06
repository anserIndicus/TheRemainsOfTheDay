import { ContentItem, ContentType } from '../content/types';
import { Storage } from './storage';

export class ReportGenerator {
  private static instance: ReportGenerator;
  private storage: Storage;

  constructor(storage: Storage) {
    this.storage = storage;
  }

  static getInstance(storage: Storage): ReportGenerator {
    if (!ReportGenerator.instance) {
      ReportGenerator.instance = new ReportGenerator(storage);
    }
    return ReportGenerator.instance;
  }

  async generateReport(startTime: number, endTime: number) {
    const contents = await this.storage.getContentsByTimeRange(startTime, endTime);
    return this.generateReportFromRecords(contents);
  }

  async generateDailyReport(date: string) {
    const contents = await this.storage.getContentsByDate(date);
    return this.generateReportFromRecords(contents);
  }

  private generateReportFromRecords(contents: ContentItem[]) {
    const groupedByType = this.groupContentsByType(contents);
    const domains = this.analyzeDomains(contents);
    const recommendations = this.getRecommendations(contents);

    return {
      date: new Date().toISOString().split('T')[0],
      contents,
      groupedContents: groupedByType,
      domains,
      recommendations
    };
  }

  private groupContentsByType(contents: ContentItem[]) {
    return contents.reduce((acc, item) => {
      if (!acc[item.type]) {
        acc[item.type] = [];
      }
      acc[item.type].push(item);
      return acc;
    }, {} as Record<ContentType, ContentItem[]>);
  }

  private analyzeDomains(contents: ContentItem[]) {
    const domainStats = contents.reduce((acc, item) => {
      try {
        const url = new URL(item.url);
        const domain = url.hostname;
        if (!acc[domain]) {
          acc[domain] = { count: 0, time: 0 };
        }
        acc[domain].count++;
        // 假设每个内容平均阅读时间为2分钟
        acc[domain].time += 2 * 60;
      } catch (error) {
        console.error('Invalid URL:', item.url);
      }
      return acc;
    }, {} as Record<string, { count: number; time: number }>);

    return Object.entries(domainStats)
      .map(([domain, stats]) => ({
        domain,
        count: stats.count,
        time: stats.time
      }))
      .sort((a, b) => b.count - a.count);
  }

  private getRecommendations(contents: ContentItem[]) {
    return contents
      .sort((a, b) => b.weight - a.weight)
      .slice(0, 5);
  }
}
