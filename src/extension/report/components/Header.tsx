import React from 'react';
import { format } from 'date-fns';
import { zhCN } from 'date-fns/locale';

interface HeaderProps {
  date: Date;
}

export const Header: React.FC<HeaderProps> = ({ date }) => {
  return (
    <header className="header">
      <div className="container">
        <div className="flex items-center justify-between h-full">
          <div className="flex items-center gap-4">
            <h1 className="text-xl font-serif font-medium">The Remains of the Day</h1>
            <span className="text-sm text-gray-500">
              {format(date, 'yyyy年M月d日 EEEE', { locale: zhCN })}
            </span>
          </div>
          
          <nav className="flex items-center gap-6">
            <a href="#" className="text-sm hover:text-gray-600">归档</a>
            <a href="#" className="text-sm hover:text-gray-600">收藏</a>
            <a href="#" className="text-sm hover:text-gray-600">设置</a>
          </nav>
        </div>
      </div>
    </header>
  );
};
