import React, { useState, useEffect } from 'react';
import { Switch } from '@headlessui/react';

interface CollectionStatusProps {
  url: string;
  enabled: boolean;
  onToggle: (enabled: boolean) => void;
}

export const CollectionStatus: React.FC<CollectionStatusProps> = ({
  url,
  enabled,
  onToggle
}) => {
  const [domain, setDomain] = useState('');

  useEffect(() => {
    try {
      const urlObj = new URL(url);
      setDomain(urlObj.hostname);
    } catch {
      setDomain('未知域名');
    }
  }, [url]);

  return (
    <div className="p-4 bg-white rounded-lg shadow">
      <div className="flex items-center justify-between mb-4">
        <div className="flex-1">
          <h3 className="text-sm font-medium text-gray-900">当前页面</h3>
          <p className="text-sm text-gray-500 truncate" title={url}>
            {domain}
          </p>
        </div>
        <Switch
          checked={enabled}
          onChange={onToggle}
          className={`${
            enabled ? 'bg-blue-600' : 'bg-gray-200'
          } relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2`}
        >
          <span
            className={`${
              enabled ? 'translate-x-6' : 'translate-x-1'
            } inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
          />
        </Switch>
      </div>
      <div className="flex items-center space-x-2">
        <div className={`w-2 h-2 rounded-full ${enabled ? 'bg-green-500' : 'bg-red-500'}`} />
        <span className="text-sm text-gray-600">
          {enabled ? '正在采集' : '已暂停'}
        </span>
      </div>
    </div>
  );
};
