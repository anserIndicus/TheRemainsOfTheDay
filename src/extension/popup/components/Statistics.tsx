import React from 'react';

interface StatisticsProps {
  recordCount: number;
}

export const Statistics: React.FC<StatisticsProps> = ({
  recordCount
}) => {
  return (
    <div className="p-4 bg-white rounded-lg shadow">
      <div className="flex items-center justify-between">
        <div className="text-sm text-gray-600">今日已统计</div>
        <div className="flex items-center">
          <span className="text-lg font-semibold text-blue-600">{recordCount}</span>
          <span className="ml-1 text-sm text-gray-500">条摘录</span>
        </div>
      </div>
    </div>
  );
};
