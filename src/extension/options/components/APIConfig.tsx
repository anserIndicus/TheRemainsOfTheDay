import React, { useEffect, useState } from 'react';
import { DeepSeekConfig } from '../../types/api';
import { APIService } from '../../utils/api-service';

const APIConfig: React.FC = () => {
  const [config, setConfig] = useState<DeepSeekConfig>({
    apiKey: '',
    apiEndpoint: 'https://api.deepseek.com/v1/chat/completions',
    maxTokens: 500,
    temperature: 0.7,
    enabled: false
  });
  const [status, setStatus] = useState<'idle' | 'saving' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  useEffect(() => {
    loadConfig();
  }, []);

  const loadConfig = async () => {
    try {
      const result = await chrome.storage.sync.get('deepseekConfig');
      if (result.deepseekConfig) {
        setConfig(result.deepseekConfig);
      }
    } catch (error) {
      console.error('Failed to load config:', error);
      setStatus('error');
      setMessage('Failed to load configuration');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setConfig(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('saving');
    
    try {
      await APIService.getInstance().updateConfig(config);
      setStatus('success');
      setMessage('Configuration saved successfully');
    } catch (error) {
      console.error('Failed to save config:', error);
      setStatus('error');
      setMessage('Failed to save configuration');
    }
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">DeepSeek API Configuration</h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="flex items-center space-x-4">
          <input
            type="checkbox"
            id="enabled"
            name="enabled"
            checked={config.enabled}
            onChange={handleChange}
            className="h-4 w-4"
          />
          <label htmlFor="enabled" className="font-medium">
            Enable DeepSeek API Integration
          </label>
        </div>

        <div className="space-y-4">
          <div>
            <label htmlFor="apiKey" className="block font-medium mb-1">
              API Key
            </label>
            <input
              type="password"
              id="apiKey"
              name="apiKey"
              value={config.apiKey}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required={config.enabled}
            />
          </div>

          <div>
            <label htmlFor="apiEndpoint" className="block font-medium mb-1">
              API Endpoint
            </label>
            <input
              type="url"
              id="apiEndpoint"
              name="apiEndpoint"
              value={config.apiEndpoint}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required={config.enabled}
            />
          </div>

          <div>
            <label htmlFor="maxTokens" className="block font-medium mb-1">
              Max Tokens
            </label>
            <input
              type="number"
              id="maxTokens"
              name="maxTokens"
              value={config.maxTokens}
              onChange={handleChange}
              min="1"
              max="2048"
              className="w-full p-2 border rounded"
              required={config.enabled}
            />
          </div>

          <div>
            <label htmlFor="temperature" className="block font-medium mb-1">
              Temperature
            </label>
            <input
              type="number"
              id="temperature"
              name="temperature"
              value={config.temperature}
              onChange={handleChange}
              min="0"
              max="1"
              step="0.1"
              className="w-full p-2 border rounded"
              required={config.enabled}
            />
          </div>
        </div>

        {status !== 'idle' && (
          <div className={`p-4 rounded ${
            status === 'success' ? 'bg-green-100 text-green-700' :
            status === 'error' ? 'bg-red-100 text-red-700' :
            'bg-blue-100 text-blue-700'
          }`}>
            {message}
          </div>
        )}

        <button
          type="submit"
          disabled={status === 'saving'}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {status === 'saving' ? 'Saving...' : 'Save Configuration'}
        </button>
      </form>
    </div>
  );
};

export default APIConfig;
