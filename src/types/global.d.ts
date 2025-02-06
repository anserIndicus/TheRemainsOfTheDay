declare namespace chrome {
  export interface Manifest {
    version: string;
  }

  export interface Tab {
    id?: number;
    url?: string;
    active: boolean;
    windowId: number;
  }

  export interface Runtime {
    getURL(path: string): string;
    getManifest(): Manifest;
    onMessage: {
      addListener(callback: (
        message: any,
        sender: MessageSender,
        sendResponse: (response?: any) => void
      ) => void): void;
      removeListener(callback: Function): void;
    };
    sendMessage(
      message: any,
      responseCallback?: (response: any) => void
    ): void;
    openOptionsPage(): void;
  }

  export interface MessageSender {
    tab?: Tab;
    frameId?: number;
    id?: string;
    url?: string;
  }

  export interface Tabs {
    query(queryInfo: {
      active?: boolean;
      currentWindow?: boolean;
      url?: string | string[];
    }): Promise<Tab[]>;
    create(createProperties: {
      url?: string;
      active?: boolean;
    }): Promise<Tab>;
    sendMessage(tabId: number, message: any): Promise<any>;
  }

  export interface Windows {
    create(createData: {
      url?: string;
      type?: string;
      width?: number;
      height?: number;
      left?: number;
      top?: number;
    }): Promise<any>;
  }

  export interface Alarms {
    create(name: string, alarmInfo: {
      when?: number;
      periodInMinutes?: number;
    }): void;
    onAlarm: {
      addListener(callback: (alarm: Alarm) => void): void;
    };
  }

  export interface Alarm {
    name: string;
    scheduledTime: number;
    periodInMinutes?: number;
  }

  export const runtime: Runtime;
  export const tabs: Tabs;
  export const windows: Windows;
  export const alarms: Alarms;
}

// 扩展 Window 接口
interface Window {
  screen: {
    width: number;
    height: number;
  };
}

// 时间追踪相关类型
interface TimeTracking {
  startTime: number;
  endTime?: number;
  activeTime: number;
  duration: number;
  pageTime: number;
  pageStartTime: number;
  focusCount: number;
  blurCount: number;
  lastActiveTime: number;
  type: 'active' | 'inactive';
}

// 消息类型
interface Message {
  type: string;
  data?: any;
}

// 消息响应类型
interface MessageResponse {
  success: boolean;
  error?: string;
  enabled?: boolean;
  count?: number;
  settings?: any;
}

// 重要性等级
export type ImportanceLevel = 'high' | 'normal' | 'low';

// 内容元数据
export interface ContentMetadata {
  title: string;
  author?: string;
  likes?: number;
  comments?: number;
  isComment: boolean;
  type: string;
}

// 内容记录
export interface ContentRecord {
  id: string;
  url: string;
  content: string;
  title: string;
  timestamp: number;
  type: string;
  metadata?: ContentMetadata;
  timeSpent?: number;
}

// 内容条目
export interface ContentItem extends ContentRecord {
  importance: ImportanceLevel;
  weight: number;
  duration: number;
}

// 收藏会话
export interface CollectionSession {
  id: string;
  url: string;
  startTime: number;
  endTime?: number;
  tabId: number;
  timeTracking?: TimeTracking[];
}

// 报告
export interface Report {
  id: string;
  timestamp: number;
  title: string;
  content: string;
  summary: string;
  contentCount: number;
}

// 设置
export interface Settings {
  id: string;
  excludedDomains: string[];
  maxSessionDuration: number;
  minSessionDuration: number;
  autoCleanupAge: number;
  timestamp: number;
}
