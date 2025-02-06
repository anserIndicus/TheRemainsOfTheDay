interface CollectorOptions {
  excludeSelectors?: string[];
  minTextLength?: number;
  maxTextLength?: number;
  imageMinWidth?: number;
  imageMinHeight?: number;
}

interface CollectionState {
  isEnabled: boolean;
  startTime: number;
  pageStartTime: number;
}

interface CollectedContent {
  url: string;
  title: string;
  text: string;
  timestamp: number;
  metadata?: {
    author?: string;
    publishDate?: string;
    category?: string;
    tags?: string[];
  };
}

interface CollectedImage {
  url: string;
  alt?: string;
  width: number;
  height: number;
  timestamp: number;
}

interface CollectionStats {
  url: string;
  duration: number;
  pageTime: number;
  contentCount: number;
  imageCount: number;
  timestamp: number;
}

declare class ContentCollector {
  constructor(options?: CollectorOptions);
  
  start(): void;
  stop(): void;
  isEnabled(): boolean;
  
  collectContent(): CollectedContent[];
  collectImages(): CollectedImage[];
  
  getStats(): CollectionStats;
  
  private initMessageListener(): void;
  private handleMessage(message: Message): void;
  private shouldCollect(element: Element): boolean;
  private extractMetadata(): CollectedContent['metadata'];
}
