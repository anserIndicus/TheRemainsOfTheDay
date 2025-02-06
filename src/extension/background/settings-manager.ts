export interface Settings {
  collection: {
    enabled: boolean;
    excludedDomains: string[];
    minTextLength: number;
    maxImagesPerPage: number;
  };
  storage: {
    maxDaysToKeep: number;
    maxStorageSize: number; // MB
  };
  report: {
    generateTime: string; // HH:mm
    notifyOnComplete: boolean;
  };
  sync: {
    enabled: boolean;
    frequency: 'realtime' | 'hourly' | 'daily';
  };
}

export class SettingsManager {
  private static STORAGE_KEY = 'settings';

  private defaultSettings: Settings = {
    collection: {
      enabled: true,
      excludedDomains: [],
      minTextLength: 10,
      maxImagesPerPage: 10
    },
    storage: {
      maxDaysToKeep: 30,
      maxStorageSize: 500
    },
    report: {
      generateTime: '23:00',
      notifyOnComplete: true
    },
    sync: {
      enabled: false,
      frequency: 'daily'
    }
  };

  async getSettings(): Promise<Settings> {
    const result = await chrome.storage.local.get(SettingsManager.STORAGE_KEY);
    return result[SettingsManager.STORAGE_KEY] || this.defaultSettings;
  }

  async saveSettings(settings: Settings): Promise<void> {
    // 验证设置
    if (!this.validateSettings(settings)) {
      throw new Error('设置格式不正确');
    }

    await chrome.storage.local.set({
      [SettingsManager.STORAGE_KEY]: settings
    });

    // 应用新设置
    await this.applySettings(settings);
  }

  async resetSettings(): Promise<Settings> {
    await chrome.storage.local.set({
      [SettingsManager.STORAGE_KEY]: this.defaultSettings
    });
    
    // 应用默认设置
    await this.applySettings(this.defaultSettings);

    return this.defaultSettings;
  }

  private validateSettings(settings: any): settings is Settings {
    try {
      // 验证collection设置
      if (typeof settings.collection !== 'object') return false;
      if (typeof settings.collection.enabled !== 'boolean') return false;
      if (!Array.isArray(settings.collection.excludedDomains)) return false;
      if (typeof settings.collection.minTextLength !== 'number') return false;
      if (typeof settings.collection.maxImagesPerPage !== 'number') return false;

      // 验证storage设置
      if (typeof settings.storage !== 'object') return false;
      if (typeof settings.storage.maxDaysToKeep !== 'number') return false;
      if (typeof settings.storage.maxStorageSize !== 'number') return false;

      // 验证report设置
      if (typeof settings.report !== 'object') return false;
      if (typeof settings.report.generateTime !== 'string') return false;
      if (!settings.report.generateTime.match(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/)) return false;
      if (typeof settings.report.notifyOnComplete !== 'boolean') return false;

      // 验证sync设置
      if (typeof settings.sync !== 'object') return false;
      if (typeof settings.sync.enabled !== 'boolean') return false;
      if (!['realtime', 'hourly', 'daily'].includes(settings.sync.frequency)) return false;

      return true;
    } catch {
      return false;
    }
  }

  private async applySettings(settings: Settings): Promise<void> {
    // 应用采集设置
    if (!settings.collection.enabled) {
      // 停止所有标签页的采集
      const tabs = await chrome.tabs.query({});
      for (const tab of tabs) {
        if (tab.id) {
          chrome.tabs.sendMessage(tab.id, { type: 'STOP_COLLECTION' });
        }
      }
    }

    // 应用存储设置
    if (settings.storage.maxDaysToKeep > 0) {
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - settings.storage.maxDaysToKeep);
      // 清理过期数据
      await this.cleanupOldData(cutoffDate);
    }

    // 应用报告设置
    if (settings.report.generateTime) {
      // 设置报告生成的定时任务
      this.scheduleReportGeneration(settings.report.generateTime);
    }

    // 应用同步设置
    if (settings.sync.enabled) {
      // 根据频率设置同步
      this.configureSyncSchedule(settings.sync.frequency);
    }
  }

  private async cleanupOldData(cutoffDate: Date): Promise<void> {
    // 实现数据清理逻辑
    // TODO: 需要实现数据清理功能
  }

  private scheduleReportGeneration(time: string): void {
    // 实现报告生成调度逻辑
    // TODO: 需要实现定时生成报告功能
  }

  private configureSyncSchedule(frequency: 'realtime' | 'hourly' | 'daily'): void {
    // 实现同步调度逻辑
    // TODO: 需要实现同步调度功能
  }
}
