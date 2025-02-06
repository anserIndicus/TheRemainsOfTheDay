import React, { useState } from 'react';

interface Stats {
  textCount: number;
  imageCount: number;
  importantCount: number;
  totalTime: number;
  domains: number;
}

interface StatsBannerProps {
  stats: Stats;
  isGenerating: boolean;
}

export const StatsBanner: React.FC<StatsBannerProps> = ({ stats, isGenerating }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div 
      className="stats-banner cursor-pointer"
      onClick={() => setIsExpanded(!isExpanded)}
      onMouseEnter={() => setIsExpanded(true)}
      onMouseLeave={() => setIsExpanded(false)}
    >
      <div className="flex items-center justify-between">
        <div className="text-sm font-medium text-gray-600">
          {isGenerating ? '今日日报生成中...' : '今日日报已生成'}
        </div>
        <div className="text-sm text-gray-500">
          {isExpanded ? '点击收起' : '点击展开'}
        </div>
      </div>

      {isExpanded && (
        <div className="stats-grid mt-4">
          <div className="text-center">
            <div className="text-2xl font-medium text-gray-900">{stats.textCount}</div>
            <div className="text-sm text-gray-500">文本记录</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-medium text-gray-900">{stats.imageCount}</div>
            <div className="text-sm text-gray-500">图片记录</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-medium text-gray-900">{stats.importantCount}</div>
            <div className="text-sm text-gray-500">重要内容</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-medium text-gray-900">
              {Math.round(stats.totalTime / 60)}
            </div>
            <div className="text-sm text-gray-500">浏览时间(分)</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-medium text-gray-900">{stats.domains}</div>
            <div className="text-sm text-gray-500">访问站点</div>
          </div>
        </div>
      )}
    </div>
  );
};
