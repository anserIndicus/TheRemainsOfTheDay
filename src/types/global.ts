export type ImportanceLevel = 'high' | 'normal' | 'low';

export interface ContentMetadata {
  title: string;
  author?: string;
  likes?: number;
  comments?: number;
  isComment: boolean;
  type: string;
}

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

export interface ContentItem extends ContentRecord {
  importance: ImportanceLevel;
  weight: number;
  duration: number;
}

export interface CollectionSession {
  id: string;
  url: string;
  startTime: number;
  endTime?: number;
  tabId: number;
  timeTracking: TimeTracking[];
}

export interface TimeTracking {
  startTime: number;
  endTime?: number;
  type: 'active' | 'inactive';
}

export interface Report {
  id: string;
  timestamp: number;
  title: string;
  content: string;
  summary: string;
  contentCount: number;
}

export interface Settings {
  id: string;
  excludedDomains: string[];
  maxSessionDuration: number;
  minSessionDuration: number;
  autoCleanupAge: number;
  timestamp: number;
}
