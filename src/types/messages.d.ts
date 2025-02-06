// 消息类型定义
type MessageType =
  | 'CHECK_COLLECTION_STATUS'
  | 'ENABLE_COLLECTION'
  | 'DISABLE_AND_CLEAN_PAGE'
  | 'DISABLE_AND_CLEAN_DOMAIN'
  | 'GET_TODAY_RECORD_COUNT'
  | 'COLLECTION_STARTED'
  | 'STOP_COLLECTION'
  | 'START_COLLECTION'
  | 'DISABLE_DOMAIN_CONFIRMED'
  | 'GENERATE_REPORT'
  | 'GET_REPORT';

interface BaseMessage {
  type: MessageType;
  data?: any;
}

// 具体消息类型
interface CheckCollectionStatusMessage extends BaseMessage {
  type: 'CHECK_COLLECTION_STATUS';
  data: {
    url: string;
  };
}

interface EnableCollectionMessage extends BaseMessage {
  type: 'ENABLE_COLLECTION';
  data: {
    url: string;
  };
}

interface DisableAndCleanPageMessage extends BaseMessage {
  type: 'DISABLE_AND_CLEAN_PAGE';
  data: {
    url: string;
  };
}

interface DisableAndCleanDomainMessage extends BaseMessage {
  type: 'DISABLE_AND_CLEAN_DOMAIN';
  data: {
    domain: string;
  };
}

interface GetTodayRecordCountMessage extends BaseMessage {
  type: 'GET_TODAY_RECORD_COUNT';
}

interface CollectionStartedMessage extends BaseMessage {
  type: 'COLLECTION_STARTED';
  data: {
    url: string;
    startTime: number;
    pageStartTime: number;
  };
}

interface StopCollectionMessage extends BaseMessage {
  type: 'STOP_COLLECTION';
}

interface StartCollectionMessage extends BaseMessage {
  type: 'START_COLLECTION';
}

interface DisableDomainConfirmedMessage extends BaseMessage {
  type: 'DISABLE_DOMAIN_CONFIRMED';
  data: {
    domain: string;
    confirmed: boolean;
  };
}

interface GenerateReportMessage extends BaseMessage {
  type: 'GENERATE_REPORT';
  data: {
    date: string;
  };
}

interface GetReportMessage extends BaseMessage {
  type: 'GET_REPORT';
  data: {
    date: string;
  };
}

// 所有消息类型的联合
type ExtensionMessage =
  | CheckCollectionStatusMessage
  | EnableCollectionMessage
  | DisableAndCleanPageMessage
  | DisableAndCleanDomainMessage
  | GetTodayRecordCountMessage
  | CollectionStartedMessage
  | StopCollectionMessage
  | StartCollectionMessage
  | DisableDomainConfirmedMessage
  | GenerateReportMessage
  | GetReportMessage;

// 消息响应类型
interface BaseResponse {
  success: boolean;
  error?: string;
}

interface CheckCollectionStatusResponse extends BaseResponse {
  enabled?: boolean;
}

interface GetTodayRecordCountResponse extends BaseResponse {
  count?: number;
}

interface GetReportResponse extends BaseResponse {
  report?: {
    date: string;
    content: string;
  };
}

// 所有响应类型的联合
type ExtensionResponse =
  | BaseResponse
  | CheckCollectionStatusResponse
  | GetTodayRecordCountResponse
  | GetReportResponse;
