import Dexie from 'dexie';
import { ContentItem } from '../content/types';

export class Storage extends Dexie {
  contents: Dexie.Table<ContentItem, string>;
  reports: Dexie.Table<any, string>;

  constructor() {
    super('TheRemainsOfTheDay');
    
    this.version(1).stores({
      contents: '&id, type, url, timestamp, synced',
      reports: '&date'
    });

    this.contents = this.table('contents');
    this.reports = this.table('reports');
  }

  async saveContent(content: ContentItem): Promise<void> {
    await this.contents.put(content);
  }

  async getAllContent(): Promise<ContentItem[]> {
    return this.contents.toArray();
  }

  async getContentsByTimeRange(startTime: number, endTime: number): Promise<ContentItem[]> {
    return this.contents
      .where('timestamp')
      .between(startTime, endTime)
      .toArray();
  }

  async getContentsByDate(date: string): Promise<ContentItem[]> {
    const startTime = new Date(date);
    startTime.setHours(0, 0, 0, 0);
    const endTime = new Date(date);
    endTime.setHours(23, 59, 59, 999);
    
    return this.getContentsByTimeRange(startTime.getTime(), endTime.getTime());
  }

  async getUnsyncedContent(): Promise<ContentItem[]> {
    return this.contents.where('synced').equals(0).toArray();
  }

  async markAsSynced(ids: string[]): Promise<void> {
    await Promise.all(
      ids.map(id => 
        this.contents.update(id, { synced: 1 })
      )
    );
  }

  async updateSyncStatus(ids: string[], synced: number): Promise<void> {
    await this.contents
      .where('id')
      .anyOf(ids)
      .modify({ synced });
  }
}

export const storage = new Storage();
