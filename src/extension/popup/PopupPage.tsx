import React, { useEffect, useState } from 'react';
import { storage } from '../background/storage';

interface Stats {
  todayCount: number;
  totalCount: number;
  lastSync: number | null;
}

export const PopupPage: React.FC = () => {
  const [stats, setStats] = useState<Stats>({
    todayCount: 0,
    totalCount: 0,
    lastSync: null
  });

  useEffect(() => {
    chrome.runtime.sendMessage({ type: 'GET_STATS' }, (response) => {
      if (response.success) {
        setStats(response.stats);
      }
    });
  }, []);

  const handleForceSync = () => {
    chrome.runtime.sendMessage({ type: 'FORCE_SYNC' }, (response) => {
      if (response.success) {
        alert('同步完成');
      } else {
        alert('同步失败: ' + response.error);
      }
    });
  };

  const handleViewReport = () => {
    // 根据 PRD 2.3.1，打开日报查看页面
    const today = new Date();
    const dateStr = today.toISOString().split('T')[0];
    chrome.tabs.create({ 
      url: chrome.runtime.getURL(`extension/report/report.html?date=${dateStr}`) 
    });
  };

  const formatTime = (timestamp: number | null): string => {
    if (!timestamp) return '从未同步';
    return new Date(timestamp).toLocaleString();
  };

  return (
    <div className="p-4">
      <h1 className="text-lg font-bold mb-4">The Remains of the Day</h1>
      
      <div className="space-y-2 mb-4">
        <div className="flex justify-between">
          <label>今日收集:</label>
          <span>{stats.todayCount} 条</span>
        </div>
        
        <div className="flex justify-between">
          <label>总计收集:</label>
          <span>{stats.totalCount} 条</span>
        </div>
        
        <div className="flex justify-between">
          <label>上次同步:</label>
          <span>{formatTime(stats.lastSync)}</span>
        </div>
      </div>

      <div className="space-y-2">
        <button
          onClick={handleViewReport}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
        >
          查看日报
        </button>
        
        <button
          onClick={handleForceSync}
          className="w-full border border-gray-300 py-2 px-4 rounded hover:bg-gray-100"
        >
          立即同步
        </button>
        
        <button
          onClick={() => chrome.runtime.openOptionsPage()}
          className="w-full border border-gray-300 py-2 px-4 rounded hover:bg-gray-100"
        >
          打开设置
        </button>
      </div>
    </div>
  );
};
