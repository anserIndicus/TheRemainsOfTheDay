/**
 * 内容类型枚举
 */
export enum ContentType {
  /** 文本内容 */
  TEXT = 'text',
  /** 图片内容 */
  IMAGE = 'image',
  /** 视频内容 */
  VIDEO = 'video',
  /** 链接内容 */
  LINK = 'link',
  /** 代码内容 */
  CODE = 'code',
  /** 文章内容 */
  ARTICLE = 'article',
  /** 评论内容 */
  COMMENT = 'comment',
  /** 社交帖子内容 */
  SOCIAL_POST = 'social_post',
  /** 搜索内容 */
  SEARCH = 'search'
}

/**
 * 内容重要性级别
 */
export enum ImportanceLevel {
  /** 低重要性 */
  LOW = 'low',
  /** 中等重要性 */
  MEDIUM = 'medium',
  /** 高重要性 */
  HIGH = 'high'
}

/**
 * 内容元数据接口
 */
export interface ContentMetadata {
  /** 标题 */
  title: string;
  /** 内容类型 */
  type: string;
  /** 是否为评论 */
  isComment: boolean;
  /** 评论数 */
  commentCount: number;
  /** 标签 */
  tags: string[];
  /** 作者 */
  author?: string;
  /** AI 生成的摘要 */
  summary?: string;
  /** AI 提取的关键词 */
  keywords?: string[];
  /** AI 分类的类别 */
  category?: string;
  /** AI 评估的重要性 */
  aiImportance?: 'high' | 'medium' | 'low';
  /** 发布时间 */
  publishTime?: number;
  /** 点赞数 */
  likes?: number;
  /** 时长 */
  duration?: number;
}

/**
 * 内容项接口
 */
export interface ContentItem {
  /** 唯一标识 */
  id: string;
  /** 内容类型 */
  type: ContentType;
  /** 内容 */
  content: string;
  /** URL */
  url: string;
  /** 时间戳 */
  timestamp: number;
  /** 重要性级别 */
  importance: ImportanceLevel;
  /** 权重 */
  weight: number;
  /** 元数据 */
  metadata: ContentMetadata;
  /** 同步状态 */
  synced: number;
}

/**
 * 采集器选项接口
 */
export interface CollectorOptions {
  /** 是否包含评论 */
  includeComments: boolean;
  /** 最小内容长度 */
  minContentLength: number;
  /** 最大内容长度 */
  maxContentLength?: number;
  /** 排除选择器 */
  excludeSelectors?: string[];
}

/**
 * 时间跟踪接口
 */
export interface TimeTracking {
  /** 开始时间 */
  startTime: number;
  /** 页面开始时间 */
  pageStartTime: number;
  /** 持续时间 */
  duration: number;
  /** 页面时间 */
  pageTime: number;
  /** 活跃时间 */
  activeTime: number;
  /** 焦点次数 */
  focusCount: number;
  /** 模糊次数 */
  blurCount: number;
  /** 结束时间 */
  endTime: number;
  /** 最后活跃时间 */
  lastActiveTime: number;
}

/**
 * 页面内容接口
 */
export interface PageContent {
  /** 页面ID */
  id: string;
  /** 页面URL */
  url: string;
  /** 页面标题 */
  title: string;
  /** 页面内容 */
  content: string;
  /** 采集时间戳 */
  timestamp: number;
  /** 元数据 */
  metadata: ContentMetadata;
}

/**
 * 采集会话接口
 */
export interface CollectionSession {
  /** 会话ID */
  id: string;
  /** 页面URL */
  url: string;
  /** 开始时间 */
  startTime: number;
  /** 结束时间 */
  endTime?: number;
  /** 内容数量 */
  contentCount: number;
}

/**
 * 报告接口
 */
export interface Report {
  /** 报告ID */
  id: string;
  /** 日期 */
  date: string;
  /** 标题 */
  title: string;
  /** 内容 */
  content: string;
  /** 摘要 */
  summary: string;
  /** 内容数量 */
  contentCount: number;
  /** 时间戳 */
  timestamp: number;
}

/**
 * 内容权重配置
 */
export const CONTENT_WEIGHTS: Record<ContentType, number> = {
  [ContentType.TEXT]: 1,
  [ContentType.IMAGE]: 1,
  [ContentType.VIDEO]: 1.5,
  [ContentType.LINK]: 1,
  [ContentType.CODE]: 1,
  [ContentType.ARTICLE]: 1,
  [ContentType.COMMENT]: 1,
  [ContentType.SOCIAL_POST]: 1,
  [ContentType.SEARCH]: 1,
};

/**
 * 时间阈值配置（毫秒）
 */
export const TIME_THRESHOLDS = {
  SHORT: 30000,    // 30秒
  MEDIUM: 300000,  // 5分钟
  LONG: 900000     // 15分钟
} as const;
