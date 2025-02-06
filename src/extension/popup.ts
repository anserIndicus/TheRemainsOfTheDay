document.addEventListener('DOMContentLoaded', async () => {
  const toggleButton = document.getElementById('toggleCollection') as HTMLButtonElement;
  const statusElement = document.getElementById('status') as HTMLDivElement;
  
  // 获取当前收集状态
  const result = await chrome.storage.sync.get('collectionEnabled');
  const isEnabled = result.collectionEnabled || false;
  
  // 更新UI状态
  updateUI(isEnabled);
  
  // 添加按钮点击事件监听器
  toggleButton.addEventListener('click', async () => {
    const newState = !isEnabled;
    await chrome.storage.sync.set({ collectionEnabled: newState });
    
    // 向当前标签页发送消息
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (tab.id) {
      chrome.tabs.sendMessage(tab.id, {
        type: newState ? 'ENABLE_COLLECTION' : 'DISABLE_COLLECTION'
      });
    }
    
    // 更新UI状态
    updateUI(newState);
  });
  
  function updateUI(enabled: boolean) {
    toggleButton.textContent = enabled ? 'Disable Collection' : 'Enable Collection';
    statusElement.textContent = `Collection: ${enabled ? 'Enabled' : 'Disabled'}`;
    statusElement.style.backgroundColor = enabled ? '#e6f4ea' : '#f1f3f4';
  }
});
