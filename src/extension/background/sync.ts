import { storage } from './storage';
import { ContentItem } from '../content/types';

export class SyncManager {
  private lastSyncTime: number = 0;
  private isSyncing: boolean = false;

  constructor() {
    this.lastSyncTime = Date.now();
  }

  async sync(): Promise<void> {
    if (this.isSyncing) {
      console.log('同步已在进行中');
      return;
    }

    try {
      this.isSyncing = true;
      const unsyncedContent = await storage.getUnsyncedContent();
      
      if (unsyncedContent.length === 0) {
        console.log('没有需要同步的内容');
        return;
      }

      // 这里添加实际的同步逻辑，例如发送到服务器
      console.log(`开始同步 ${unsyncedContent.length} 条内容`);

      // 模拟同步成功
      const syncedIds = unsyncedContent.map(item => item.id);
      await storage.updateSyncStatus(syncedIds, 1);
      
      this.lastSyncTime = Date.now();
      console.log('同步完成');
    } catch (error) {
      console.error('同步失败:', error instanceof Error ? error.message : String(error));
      throw error;
    } finally {
      this.isSyncing = false;
    }
  }

  getLastSyncTime(): number {
    return this.lastSyncTime;
  }

  isCurrentlySyncing(): boolean {
    return this.isSyncing;
  }
}
