import React, { useState, useEffect } from 'react';

interface Settings {
  collection: {
    enabled: boolean;
    excludedDomains: string[];
    minTextLength: number;
    maxImagesPerPage: number;
  };
  storage: {
    maxDaysToKeep: number;
    maxStorageSize: number; // MB
  };
  report: {
    generateTime: string; // HH:mm
    notifyOnComplete: boolean;
  };
  sync: {
    enabled: boolean;
    frequency: 'realtime' | 'hourly' | 'daily';
  };
}

export const OptionsPage: React.FC = () => {
  const [settings, setSettings] = useState<Settings>({
    collection: {
      enabled: true,
      excludedDomains: [],
      minTextLength: 10,
      maxImagesPerPage: 10
    },
    storage: {
      maxDaysToKeep: 30,
      maxStorageSize: 500
    },
    report: {
      generateTime: '23:00',
      notifyOnComplete: true
    },
    sync: {
      enabled: false,
      frequency: 'daily'
    }
  });

  const [newDomain, setNewDomain] = useState('');

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    const response = await chrome.runtime.sendMessage({
      type: 'GET_SETTINGS'
    });
    if (response.success) {
      setSettings(response.settings);
    }
  };

  const saveSettings = async (newSettings: Settings) => {
    const response = await chrome.runtime.sendMessage({
      type: 'SAVE_SETTINGS',
      data: { settings: newSettings }
    });
    if (response.success) {
      setSettings(newSettings);
    }
  };

  const handleAddDomain = () => {
    if (newDomain && !settings.collection.excludedDomains.includes(newDomain)) {
      const newSettings = {
        ...settings,
        collection: {
          ...settings.collection,
          excludedDomains: [...settings.collection.excludedDomains, newDomain]
        }
      };
      saveSettings(newSettings);
      setNewDomain('');
    }
  };

  const handleRemoveDomain = (domain: string) => {
    const newSettings = {
      ...settings,
      collection: {
        ...settings.collection,
        excludedDomains: settings.collection.excludedDomains.filter(d => d !== domain)
      }
    };
    saveSettings(newSettings);
  };

  return (
    <div className="container py-8">
      <h1 className="text-2xl font-serif mb-8">设置</h1>

      {/* 采集设置 */}
      <section className="mb-8">
        <h2 className="text-xl font-serif mb-4">采集设置</h2>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <label className="font-medium">启用采集</label>
            <input
              type="checkbox"
              checked={settings.collection.enabled}
              onChange={e => {
                saveSettings({
                  ...settings,
                  collection: {
                    ...settings.collection,
                    enabled: e.target.checked
                  }
                });
              }}
            />
          </div>

          <div>
            <label className="font-medium block mb-2">排除域名</label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                className="flex-1 p-2 border rounded"
                placeholder="输入域名..."
                value={newDomain}
                onChange={e => setNewDomain(e.target.value)}
              />
              <button
                className="px-4 py-2 bg-blue-500 text-white rounded"
                onClick={handleAddDomain}
              >
                添加
              </button>
            </div>
            <div className="space-y-2">
              {settings.collection.excludedDomains.map(domain => (
                <div
                  key={domain}
                  className="flex items-center justify-between p-2 bg-gray-50 rounded"
                >
                  <span>{domain}</span>
                  <button
                    className="text-red-500"
                    onClick={() => handleRemoveDomain(domain)}
                  >
                    删除
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div>
            <label className="font-medium block mb-2">最小文本长度</label>
            <input
              type="number"
              className="w-full p-2 border rounded"
              value={settings.collection.minTextLength}
              onChange={e => {
                saveSettings({
                  ...settings,
                  collection: {
                    ...settings.collection,
                    minTextLength: parseInt(e.target.value)
                  }
                });
              }}
            />
          </div>

          <div>
            <label className="font-medium block mb-2">每页最大图片数</label>
            <input
              type="number"
              className="w-full p-2 border rounded"
              value={settings.collection.maxImagesPerPage}
              onChange={e => {
                saveSettings({
                  ...settings,
                  collection: {
                    ...settings.collection,
                    maxImagesPerPage: parseInt(e.target.value)
                  }
                });
              }}
            />
          </div>
        </div>
      </section>

      {/* 存储设置 */}
      <section className="mb-8">
        <h2 className="text-xl font-serif mb-4">存储设置</h2>
        
        <div className="space-y-4">
          <div>
            <label className="font-medium block mb-2">保留天数</label>
            <input
              type="number"
              className="w-full p-2 border rounded"
              value={settings.storage.maxDaysToKeep}
              onChange={e => {
                saveSettings({
                  ...settings,
                  storage: {
                    ...settings.storage,
                    maxDaysToKeep: parseInt(e.target.value)
                  }
                });
              }}
            />
          </div>

          <div>
            <label className="font-medium block mb-2">最大存储空间 (MB)</label>
            <input
              type="number"
              className="w-full p-2 border rounded"
              value={settings.storage.maxStorageSize}
              onChange={e => {
                saveSettings({
                  ...settings,
                  storage: {
                    ...settings.storage,
                    maxStorageSize: parseInt(e.target.value)
                  }
                });
              }}
            />
          </div>
        </div>
      </section>

      {/* 日报设置 */}
      <section className="mb-8">
        <h2 className="text-xl font-serif mb-4">日报设置</h2>
        
        <div className="space-y-4">
          <div>
            <label className="font-medium block mb-2">生成时间</label>
            <input
              type="time"
              className="w-full p-2 border rounded"
              value={settings.report.generateTime}
              onChange={e => {
                saveSettings({
                  ...settings,
                  report: {
                    ...settings.report,
                    generateTime: e.target.value
                  }
                });
              }}
            />
          </div>

          <div className="flex items-center justify-between">
            <label className="font-medium">生成完成后通知</label>
            <input
              type="checkbox"
              checked={settings.report.notifyOnComplete}
              onChange={e => {
                saveSettings({
                  ...settings,
                  report: {
                    ...settings.report,
                    notifyOnComplete: e.target.checked
                  }
                });
              }}
            />
          </div>
        </div>
      </section>

      {/* 同步设置 */}
      <section>
        <h2 className="text-xl font-serif mb-4">同步设置</h2>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <label className="font-medium">启用同步</label>
            <input
              type="checkbox"
              checked={settings.sync.enabled}
              onChange={e => {
                saveSettings({
                  ...settings,
                  sync: {
                    ...settings.sync,
                    enabled: e.target.checked
                  }
                });
              }}
            />
          </div>

          <div>
            <label className="font-medium block mb-2">同步频率</label>
            <select
              className="w-full p-2 border rounded"
              value={settings.sync.frequency}
              onChange={e => {
                saveSettings({
                  ...settings,
                  sync: {
                    ...settings.sync,
                    frequency: e.target.value as 'realtime' | 'hourly' | 'daily'
                  }
                });
              }}
            >
              <option value="realtime">实时</option>
              <option value="hourly">每小时</option>
              <option value="daily">每天</option>
            </select>
          </div>
        </div>
      </section>
    </div>
  );
};
