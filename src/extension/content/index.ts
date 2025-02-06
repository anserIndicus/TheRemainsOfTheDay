import { ContentCollector } from './collector';
import { ContentItem } from './types';

const collector = ContentCollector.getInstance();

// 监听消息
chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  switch (message.type) {
    case 'COLLECT_CONTENT': {
      const content = collector.collectPageContent();
      sendResponse({ content });
      break;
    }
    case 'ENABLE_COLLECTION': {
      collector.startCollection();
      sendResponse({ success: true });
      break;
    }
    case 'DISABLE_COLLECTION': {
      collector.stopCollection();
      sendResponse({ success: true });
      break;
    }
    default: {
      sendResponse({ success: false, error: 'Unknown message type' });
    }
  }
  return true;
});

interface StorageData {
  collectionEnabled: boolean;
}

// 检查是否启用内容收集
chrome.storage.sync.get('collectionEnabled').then((result: { collectionEnabled?: boolean }) => {
  if (result.collectionEnabled) {
    collector.startCollection();
  }
});

// 自动收集内容
document.addEventListener('DOMContentLoaded', () => {
  const content = collector.collectPageContent();
  if (content && content.length > 0) {
    chrome.runtime.sendMessage({
      type: 'SAVE_CONTENT',
      items: content
    });
  }
});
