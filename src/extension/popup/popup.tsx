import React, { useEffect, useState } from 'react';

interface PopupState {
  url: string;
  isEnabled: boolean;
  recordCount: number;
  status: {
    type: 'success' | 'error' | 'info';
    message: string;
  } | null;
}

export const Popup: React.FC = () => {
  const [state, setState] = useState<PopupState>({
    url: '',
    isEnabled: false,
    recordCount: 0,
    status: null
  });

  useEffect(() => {
    checkCurrentTab();
    getTodayRecordCount();
  }, []);

  const checkCurrentTab = async () => {
    try {
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
      if (tab?.url) {
        setState(prev => ({ ...prev, url: tab.url || '' }));
        checkCollectionStatus(tab.url);
      }
    } catch (error: unknown) {
      showError('Failed to get current tab', error);
    }
  };

  const checkCollectionStatus = async (url: string) => {
    try {
      const response = await sendMessage<{ enabled: boolean }>({
        type: 'CHECK_COLLECTION_STATUS',
        data: { url }
      });
      setState(prev => ({ ...prev, isEnabled: response.enabled }));
    } catch (error: unknown) {
      showError('Failed to check collection status', error);
    }
  };

  const getTodayRecordCount = async () => {
    try {
      const response = await sendMessage<{ count: number }>({
        type: 'GET_TODAY_RECORD_COUNT'
      });
      setState(prev => ({ ...prev, recordCount: response.count }));
    } catch (error: unknown) {
      showError('Failed to get record count', error);
    }
  };

  const toggleCollection = async () => {
    try {
      const message = state.isEnabled
        ? { type: 'DISABLE_AND_CLEAN_PAGE', data: { url: state.url } }
        : { type: 'ENABLE_COLLECTION', data: { url: state.url } };

      await sendMessage(message);
      setState(prev => ({ ...prev, isEnabled: !prev.isEnabled }));
      getTodayRecordCount();
      showStatus(state.isEnabled ? 'Collection disabled' : 'Collection enabled', 'success');
    } catch (error: unknown) {
      showError('Failed to toggle collection', error);
    }
  };

  const disableDomain = async () => {
    try {
      const domain = new URL(state.url).hostname;
      await sendMessage({
        type: 'DISABLE_AND_CLEAN_DOMAIN',
        data: { domain }
      });
      setState(prev => ({ ...prev, isEnabled: false }));
      getTodayRecordCount();
      showStatus(`Collection disabled for domain: ${domain}`, 'success');
    } catch (error: unknown) {
      showError('Failed to disable domain', error);
    }
  };

  const showError = (message: string, error: unknown) => {
    console.error(message, error);
    setState(prev => ({
      ...prev,
      status: {
        type: 'error',
        message: `${message}: ${error instanceof Error ? error.message : String(error)}`
      }
    }));
  };

  const showStatus = (message: string, type: 'success' | 'error' | 'info') => {
    setState(prev => ({
      ...prev,
      status: { type, message }
    }));
    setTimeout(() => {
      setState(prev => ({ ...prev, status: null }));
    }, 3000);
  };

  const sendMessage = <T extends unknown>(
    message: { type: string; data?: any }
  ): Promise<T> => {
    return new Promise((resolve, reject) => {
      chrome.runtime.sendMessage(message, (response: { success: boolean; error?: string } & T) => {
        if (chrome.runtime.lastError) {
          reject(chrome.runtime.lastError);
        } else if (!response.success) {
          reject(new Error(response.error || 'Unknown error'));
        } else {
          resolve(response);
        }
      });
    });
  };

  return (
    <div className="w-80 p-4 space-y-4">
      {state.status && (
        <div
          className={`p-2 rounded ${
            state.status.type === 'error'
              ? 'bg-red-100 text-red-700'
              : state.status.type === 'success'
              ? 'bg-green-100 text-green-700'
              : 'bg-blue-100 text-blue-700'
          }`}
        >
          {state.status.message}
        </div>
      )}

      <div className="flex flex-col space-y-2">
        <div className="text-sm text-gray-600">
          Today's Records: <span className="font-bold">{state.recordCount}</span>
        </div>

        <button
          className={`px-4 py-2 rounded ${
            state.isEnabled
              ? 'bg-red-500 hover:bg-red-600 text-white'
              : 'bg-green-500 hover:bg-green-600 text-white'
          }`}
          onClick={toggleCollection}
        >
          {state.isEnabled ? 'Stop Collecting' : 'Start Collecting'}
        </button>

        {state.isEnabled && (
          <button
            className="px-4 py-2 rounded bg-gray-500 hover:bg-gray-600 text-white"
            onClick={disableDomain}
          >
            Disable for Domain
          </button>
        )}
      </div>
    </div>
  );
};
