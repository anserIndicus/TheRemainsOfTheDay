declare namespace chrome {
  export interface Runtime {
    onMessage: {
      addListener: (
        callback: (
          message: any,
          sender: chrome.runtime.MessageSender,
          sendResponse: (response?: any) => void
        ) => void | boolean
      ) => void;
      removeListener: (callback: Function) => void;
      hasListener: (callback: Function) => boolean;
    };
    sendMessage: <T = any>(
      message: any,
      responseCallback?: (response: T) => void
    ) => void;
    lastError?: {
      message: string;
    };
    id: string;
    MessageSender: {
      tab?: chrome.tabs.Tab;
      frameId?: number;
      id?: string;
      url?: string;
      tlsChannelId?: string;
    };
  }

  export interface Action {
    setBadgeText: (details: { text: string }) => Promise<void>;
    setBadgeBackgroundColor: (details: { color: string }) => Promise<void>;
  }

  export interface Storage {
    local: {
      get: <T = any>(keys: string | string[] | Object | null) => Promise<T>;
      set: (items: Object) => Promise<void>;
      remove: (keys: string | string[]) => Promise<void>;
      clear: () => Promise<void>;
    };
    sync: {
      get: <T = any>(keys: string | string[] | Object | null) => Promise<T>;
      set: (items: Object) => Promise<void>;
      remove: (keys: string | string[]) => Promise<void>;
      clear: () => Promise<void>;
    };
    onChanged: {
      addListener: (callback: (changes: { [key: string]: chrome.storage.StorageChange }, areaName: string) => void) => void;
      removeListener: (callback: Function) => void;
    };
  }

  export interface StorageChange {
    oldValue?: any;
    newValue?: any;
  }

  export interface Tabs {
    query: (queryInfo: {
      active?: boolean;
      currentWindow?: boolean;
      url?: string | string[];
    }) => Promise<chrome.tabs.Tab[]>;
    sendMessage: <T = any>(
      tabId: number,
      message: any,
      responseCallback?: (response: T) => void
    ) => void;
    Tab: {
      id?: number;
      url?: string;
      title?: string;
      favIconUrl?: string;
      status?: string;
    };
  }

  export interface Bookmarks {
    create: (bookmark: {
      parentId?: string;
      index?: number;
      title?: string;
      url?: string;
    }) => Promise<chrome.bookmarks.BookmarkTreeNode>;
    remove: (id: string) => Promise<void>;
    search: (query: {
      query?: string;
      url?: string;
      title?: string;
    }) => Promise<chrome.bookmarks.BookmarkTreeNode[]>;
    BookmarkTreeNode: {
      id: string;
      parentId?: string;
      index?: number;
      url?: string;
      title: string;
      dateAdded?: number;
      dateGroupModified?: number;
      children?: chrome.bookmarks.BookmarkTreeNode[];
    };
  }

  export namespace runtime {
    export interface MessageSender {
      tab?: chrome.tabs.Tab;
      frameId?: number;
      id?: string;
      url?: string;
      tlsChannelId?: string;
    }

    export type MessageCallback = (
      message: any,
      sender: MessageSender,
      sendResponse: (response?: any) => void
    ) => void | boolean;

    export interface Runtime {
      lastError?: {
        message: string;
      };
      id: string;
    }

    export const onMessage: {
      addListener(callback: MessageCallback): void;
      removeListener(callback: MessageCallback): void;
      hasListener(callback: MessageCallback): boolean;
    };

    export function sendMessage(
      message: any,
      responseCallback?: (response: any) => void
    ): void;
    export function sendMessage(
      extensionId: string,
      message: any,
      responseCallback?: (response: any) => void
    ): void;

    export const lastError: chrome.runtime.Runtime['lastError'];
    export const id: string;
  }

  export namespace tabs {
    export interface Tab {
      id?: number;
      index: number;
      windowId: number;
      highlighted: boolean;
      active: boolean;
      pinned: boolean;
      url?: string;
      title?: string;
      favIconUrl?: string;
      status?: string;
      incognito: boolean;
      width?: number;
      height?: number;
      sessionId?: string;
    }

    export function query(queryInfo: {
      active?: boolean;
      currentWindow?: boolean;
    }): Promise<Tab[]>;
  }

  export const runtime: Runtime;
  export const action: Action;
  export const storage: Storage;
  export const tabs: Tabs;
  export const bookmarks: Bookmarks;
}
