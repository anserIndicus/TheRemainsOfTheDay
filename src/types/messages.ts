export interface MessageResponse {
  success: boolean;
  error?: string;
  data?: any;
}

export interface CollectionMessage {
  type: string;
  data?: {
    url?: string;
    content?: any;
    domain?: string;
    date?: string;
    settings?: any;
    images?: string[];
    timestamp?: number;
    startTime?: number;
    pageStartTime?: number;
    duration?: number;
    pageTime?: number;
    bookmarkId?: string;
    tag?: string;
    note?: string;
    jsonData?: string;
  };
}
