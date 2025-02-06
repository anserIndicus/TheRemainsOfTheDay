import React, { useState, useEffect } from 'react';
import { storage } from '../background/storage';
import APIConfig from './components/APIConfig';

interface Settings {
  minTextLength: number;
  maxTextLength: number;
  imageMinWidth: number;
  imageMinHeight: number;
  excludeSelectors: string[];
}

export const OptionsPage: React.FC = () => {
  const [settings, setSettings] = useState<Settings>({
    minTextLength: 10,
    maxTextLength: 10000,
    imageMinWidth: 100,
    imageMinHeight: 100,
    excludeSelectors: [
      'script',
      'style',
      'noscript',
      'meta',
      'link',
      'iframe',
      '.ad',
      '#ad',
      '[data-ad]',
      '.advertisement'
    ]
  });

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    const result = await chrome.storage.sync.get([
      'minTextLength',
      'maxTextLength',
      'imageMinWidth',
      'imageMinHeight',
      'excludeSelectors'
    ]);

    setSettings({
      minTextLength: result.minTextLength ?? 10,
      maxTextLength: result.maxTextLength ?? 10000,
      imageMinWidth: result.imageMinWidth ?? 100,
      imageMinHeight: result.imageMinHeight ?? 100,
      excludeSelectors: result.excludeSelectors ?? [
        'script',
        'style',
        'noscript',
        'meta',
        'link',
        'iframe',
        '.ad',
        '#ad',
        '[data-ad]',
        '.advertisement'
      ]
    });
  };

  const handleSave = async () => {
    await chrome.storage.sync.set({ settings });
    alert('设置已保存');
  };

  const handleSettingChange = async (key: string, value: number) => {
    await chrome.storage.sync.set({ [key]: value });
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const handleExcludeSelectorsChange = async (value: string[]) => {
    await chrome.storage.sync.set({ excludeSelectors: value });
    setSettings(prev => ({ ...prev, excludeSelectors: value }));
  };

  return (
    <div className="options-page p-6">
      <h1 className="text-2xl font-bold mb-8">The Remains of the Day - 设置</h1>
      
      <div className="space-y-8">
        <section className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-6">内容采集设置</h2>
          
          <div className="space-y-4">
            <div>
              <label className="block">
                <span className="text-gray-700">最小文本长度:</span>
                <input
                  type="number"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                  value={settings.minTextLength}
                  onChange={(e) => handleSettingChange('minTextLength', parseInt(e.target.value, 10))}
                />
              </label>
            </div>

            <div>
              <label className="block">
                <span className="text-gray-700">最大文本长度:</span>
                <input
                  type="number"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                  value={settings.maxTextLength}
                  onChange={(e) => handleSettingChange('maxTextLength', parseInt(e.target.value, 10))}
                />
              </label>
            </div>

            <div>
              <label className="block">
                <span className="text-gray-700">图片最小宽度:</span>
                <input
                  type="number"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                  value={settings.imageMinWidth}
                  onChange={(e) => handleSettingChange('imageMinWidth', parseInt(e.target.value, 10))}
                />
              </label>
            </div>

            <div>
              <label className="block">
                <span className="text-gray-700">图片最小高度:</span>
                <input
                  type="number"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                  value={settings.imageMinHeight}
                  onChange={(e) => handleSettingChange('imageMinHeight', parseInt(e.target.value, 10))}
                />
              </label>
            </div>

            <div>
              <label className="block">
                <span className="text-gray-700">排除选择器:</span>
                <textarea
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                  value={settings.excludeSelectors.join('\n')}
                  onChange={(e) => handleExcludeSelectorsChange(e.target.value.split('\n').filter(Boolean))}
                  rows={5}
                />
              </label>
            </div>

            <button
              onClick={handleSave}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              保存设置
            </button>
          </div>
        </section>

        <section className="bg-white rounded-lg shadow">
          <APIConfig />
        </section>
      </div>
    </div>
  );
};
