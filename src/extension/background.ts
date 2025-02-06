// 监听来自内容脚本的消息
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  switch (message.type) {
    case 'SAVE_CONTENT': {
      handleSaveContent(message.items);
      sendResponse({ success: true });
      break;
    }
    default: {
      sendResponse({ success: false, error: 'Unknown message type' });
    }
  }
  return true;
});

// 处理保存内容的请求
async function handleSaveContent(items: any[]) {
  try {
    // 获取现有内容
    const result = await chrome.storage.local.get('savedContent');
    const savedContent = result.savedContent || [];
    
    // 添加新内容
    const updatedContent = [...savedContent, ...items];
    
    // 保存更新后的内容
    await chrome.storage.local.set({ savedContent: updatedContent });
    
    // 更新扩展图标上的徽章
    const count = updatedContent.length;
    chrome.action.setBadgeText({ text: count.toString() });
    chrome.action.setBadgeBackgroundColor({ color: '#4CAF50' });
  } catch (error) {
    console.error('Failed to save content:', error);
  }
}
