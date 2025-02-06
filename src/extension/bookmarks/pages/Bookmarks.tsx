import React, { useState, useEffect } from 'react';
import { ContentItem } from '../../content/types';

interface BookmarkItem extends ContentItem {
  bookmarkTime: number;
  tags: string[];
  note?: string;
}

export const BookmarksPage: React.FC = () => {
  const [bookmarks, setBookmarks] = useState<BookmarkItem[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadBookmarks();
  }, []);

  const loadBookmarks = async () => {
    const response = await chrome.runtime.sendMessage({
      type: 'GET_BOOKMARKS'
    });
    if (response.success) {
      setBookmarks(response.bookmarks);
    }
  };

  const handleRemoveBookmark = async (id: string) => {
    const response = await chrome.runtime.sendMessage({
      type: 'REMOVE_BOOKMARK',
      data: { id }
    });
    if (response.success) {
      setBookmarks(bookmarks.filter(item => item.id !== id));
    }
  };

  const handleAddTag = async (bookmarkId: string, tag: string) => {
    const response = await chrome.runtime.sendMessage({
      type: 'ADD_BOOKMARK_TAG',
      data: { bookmarkId, tag }
    });
    if (response.success) {
      loadBookmarks();
    }
  };

  const handleUpdateNote = async (bookmarkId: string, note: string) => {
    const response = await chrome.runtime.sendMessage({
      type: 'UPDATE_BOOKMARK_NOTE',
      data: { bookmarkId, note }
    });
    if (response.success) {
      loadBookmarks();
    }
  };

  // 过滤书签
  const filteredBookmarks = bookmarks.filter(bookmark => {
    const matchesSearch = searchQuery === '' ||
      bookmark.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      bookmark.metadata?.title?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesTags = selectedTags.length === 0 ||
      selectedTags.every(tag => bookmark.tags.includes(tag));

    return matchesSearch && matchesTags;
  });

  // 获取所有标签
  const allTags = Array.from(new Set(
    bookmarks.flatMap(bookmark => bookmark.tags)
  ));

  return (
    <div className="container py-8">
      {/* 搜索和过滤区 */}
      <div className="mb-8">
        <input
          type="text"
          placeholder="搜索收藏..."
          className="w-full p-2 border rounded"
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
        />
        
        <div className="mt-4 flex flex-wrap gap-2">
          {allTags.map(tag => (
            <button
              key={tag}
              className={`px-3 py-1 rounded-full text-sm ${
                selectedTags.includes(tag)
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 text-gray-700'
              }`}
              onClick={() => {
                setSelectedTags(
                  selectedTags.includes(tag)
                    ? selectedTags.filter(t => t !== tag)
                    : [...selectedTags, tag]
                );
              }}
            >
              {tag}
            </button>
          ))}
        </div>
      </div>

      {/* 书签列表 */}
      <div className="space-y-6">
        {filteredBookmarks.map(bookmark => (
          <div key={bookmark.id} className="p-4 border rounded">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-serif text-xl mb-2">
                  {bookmark.metadata?.title || bookmark.content.slice(0, 100)}
                </h3>
                <div className="text-sm text-gray-500 mb-2">
                  收藏于 {new Date(bookmark.bookmarkTime).toLocaleString()}
                </div>
                <div className="text-gray-700">{bookmark.content}</div>
                
                {/* 标签 */}
                <div className="mt-4 flex flex-wrap gap-2">
                  {bookmark.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-gray-100 text-sm rounded"
                    >
                      {tag}
                    </span>
                  ))}
                  <button
                    className="px-2 py-1 text-sm text-blue-500"
                    onClick={() => {
                      const tag = prompt('添加标签');
                      if (tag) {
                        handleAddTag(bookmark.id, tag);
                      }
                    }}
                  >
                    + 添加标签
                  </button>
                </div>

                {/* 笔记 */}
                <div className="mt-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-600">笔记</span>
                    <button
                      className="text-sm text-blue-500 hover:text-blue-600"
                      onClick={() => {
                        const noteEditor = document.getElementById(`note-${bookmark.id}`);
                        if (noteEditor) {
                          noteEditor.focus();
                        }
                      }}
                    >
                      {bookmark.note ? '编辑' : '添加笔记'}
                    </button>
                  </div>
                  
                  {bookmark.note ? (
                    <div className="relative group">
                      <div 
                        className="p-3 bg-yellow-50 rounded-lg text-gray-700 cursor-text"
                        onClick={() => {
                          const noteEditor = document.getElementById(`note-${bookmark.id}`);
                          if (noteEditor) {
                            noteEditor.focus();
                          }
                        }}
                      >
                        {bookmark.note}
                      </div>
                      <textarea
                        id={`note-${bookmark.id}`}
                        className="absolute inset-0 w-full h-full p-3 bg-yellow-50 rounded-lg opacity-0 focus:opacity-100"
                        placeholder="写下你的想法..."
                        value={bookmark.note}
                        onChange={e => {
                          const note = e.target.value;
                          handleUpdateNote(bookmark.id, note);
                        }}
                        onBlur={e => {
                          if (e.target.value.trim() === '') {
                            handleUpdateNote(bookmark.id, '');
                          }
                        }}
                      />
                    </div>
                  ) : (
                    <textarea
                      id={`note-${bookmark.id}`}
                      className="w-full p-3 bg-yellow-50 rounded-lg placeholder-gray-400"
                      placeholder="写下你的想法..."
                      onChange={e => handleUpdateNote(bookmark.id, e.target.value)}
                    />
                  )}
                </div>
              </div>

              <button
                className="text-red-500"
                onClick={() => handleRemoveBookmark(bookmark.id)}
              >
                删除
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
