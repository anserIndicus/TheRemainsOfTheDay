import { ContentItem } from '../content/types';
import { nanoid } from 'nanoid';

interface BookmarkItem {
  id: string;
  url: string;
  title: string;
  content: string;
  tags: string[];
  bookmarkTime: number;
  note?: string;
}

export class BookmarkManager {
  private static STORAGE_KEY = 'bookmarks';
  private static instance: BookmarkManager;
  private bookmarkFolderId: string | null = null;
  private readonly FOLDER_NAME = 'The Remains of the Day';

  private constructor() {
    this.initializeFolder();
  }

  public static getInstance(): BookmarkManager {
    if (!BookmarkManager.instance) {
      BookmarkManager.instance = new BookmarkManager();
    }
    return BookmarkManager.instance;
  }

  private async initializeFolder(): Promise<void> {
    try {
      const results = await chrome.bookmarks.search({ title: this.FOLDER_NAME });
      if (results.length > 0) {
        this.bookmarkFolderId = results[0].id;
      } else {
        const folder = await chrome.bookmarks.create({ title: this.FOLDER_NAME });
        this.bookmarkFolderId = folder.id;
      }
    } catch (error: unknown) {
      console.error('Failed to initialize bookmark folder:', error instanceof Error ? error.message : String(error));
    }
  }

  public async getBookmarks(): Promise<BookmarkItem[]> {
    const result = await chrome.storage.local.get(BookmarkManager.STORAGE_KEY);
    return result[BookmarkManager.STORAGE_KEY] || [];
  }

  public async addBookmark(content: ContentItem): Promise<BookmarkItem> {
    if (!this.bookmarkFolderId) {
      await this.initializeFolder();
    }

    const bookmarks = await this.getBookmarks();
    
    // 检查是否已经收藏
    const exists = bookmarks.some(b => b.url === content.url && b.content === content.content);
    if (exists) {
      throw new Error('已收藏过该内容');
    }

    const newBookmark: BookmarkItem = {
      id: nanoid(),
      url: content.url,
      title: content.metadata?.title || new URL(content.url).pathname,
      content: content.content,
      tags: [],
      bookmarkTime: Date.now(),
    };

    await chrome.storage.local.set({
      [BookmarkManager.STORAGE_KEY]: [...bookmarks, newBookmark]
    });

    try {
      await chrome.bookmarks.create({
        parentId: this.bookmarkFolderId!,
        title: newBookmark.title,
        url: newBookmark.url
      });
    } catch (error: unknown) {
      console.error('Failed to add bookmark:', error instanceof Error ? error.message : String(error));
      throw new Error('Failed to add bookmark');
    }

    return newBookmark;
  }

  public async removeBookmark(id: string): Promise<void> {
    const bookmarks = await this.getBookmarks();
    const updatedBookmarks = bookmarks.filter(b => b.id !== id);
    
    await chrome.storage.local.set({
      [BookmarkManager.STORAGE_KEY]: updatedBookmarks
    });

    try {
      const results = await chrome.bookmarks.search({ url: updatedBookmarks.find(b => b.id === id)?.url });
      for (const bookmark of results) {
        if (bookmark.parentId === this.bookmarkFolderId) {
          await chrome.bookmarks.remove(bookmark.id);
        }
      }
    } catch (error: unknown) {
      console.error('Failed to remove bookmark:', error instanceof Error ? error.message : String(error));
      throw new Error('Failed to remove bookmark');
    }
  }

  public async addTag(bookmarkId: string, tag: string): Promise<BookmarkItem> {
    const bookmarks = await this.getBookmarks();
    const index = bookmarks.findIndex(b => b.id === bookmarkId);
    
    if (index === -1) {
      throw new Error('书签不存在');
    }

    const bookmark = bookmarks[index];
    if (!bookmark.tags.includes(tag)) {
      bookmark.tags.push(tag);
      
      await chrome.storage.local.set({
        [BookmarkManager.STORAGE_KEY]: bookmarks
      });
    }

    return bookmark;
  }

  public async removeTag(bookmarkId: string, tag: string): Promise<BookmarkItem> {
    const bookmarks = await this.getBookmarks();
    const index = bookmarks.findIndex(b => b.id === bookmarkId);
    
    if (index === -1) {
      throw new Error('书签不存在');
    }

    const bookmark = bookmarks[index];
    bookmark.tags = bookmark.tags.filter(t => t !== tag);
    
    await chrome.storage.local.set({
      [BookmarkManager.STORAGE_KEY]: bookmarks
    });

    return bookmark;
  }

  public async updateNote(bookmarkId: string, note: string): Promise<BookmarkItem> {
    const bookmarks = await this.getBookmarks();
    const index = bookmarks.findIndex(b => b.id === bookmarkId);
    
    if (index === -1) {
      throw new Error('书签不存在');
    }

    const bookmark = bookmarks[index];
    bookmark.note = note.trim() || undefined; // 如果笔记为空，则设为undefined
    
    await chrome.storage.local.set({
      [BookmarkManager.STORAGE_KEY]: bookmarks
    });

    return bookmark;
  }

  // 导出收藏数据
  public async exportBookmarks(): Promise<string> {
    const bookmarks = await this.getBookmarks();
    return JSON.stringify(bookmarks, null, 2);
  }

  // 导入收藏数据
  public async importBookmarks(jsonData: string): Promise<void> {
    try {
      const bookmarks = JSON.parse(jsonData) as BookmarkItem[];
      
      // 验证数据格式
      if (!Array.isArray(bookmarks) || !bookmarks.every(this.isValidBookmark)) {
        throw new Error('数据格式不正确');
      }

      await chrome.storage.local.set({
        [BookmarkManager.STORAGE_KEY]: bookmarks
      });
    } catch (error: unknown) {
      throw new Error('导入失败：' + (error instanceof Error ? error.message : String(error)));
    }
  }

  private isValidBookmark(item: any): item is BookmarkItem {
    return (
      typeof item === 'object' &&
      typeof item.id === 'string' &&
      typeof item.content === 'string' &&
      typeof item.url === 'string' &&
      typeof item.bookmarkTime === 'number' &&
      Array.isArray(item.tags) &&
      (!item.note || typeof item.note === 'string')
    );
  }

  public async hasBookmark(url: string): Promise<boolean> {
    try {
      const results = await chrome.bookmarks.search({ url });
      return results.some(bookmark => bookmark.parentId === this.bookmarkFolderId);
    } catch (error: unknown) {
      console.error('Failed to check bookmark:', error instanceof Error ? error.message : String(error));
      return false;
    }
  }
}
