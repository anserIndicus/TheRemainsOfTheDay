import React from 'react';

interface QuickAction {
  icon: string;
  label: string;
  onClick: () => void;
}

interface QuickActionsProps {
  actions: QuickAction[];
}

export const QuickActions: React.FC<QuickActionsProps> = ({ actions }) => {
  return (
    <div className="p-4 bg-white rounded-lg shadow">
      <h3 className="text-sm font-medium text-gray-900 mb-4">快捷操作</h3>
      <div className="grid grid-cols-2 gap-4">
        {actions.map((action, index) => (
          <button
            key={index}
            onClick={action.onClick}
            className="flex flex-col items-center justify-center p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors"
          >
            <span className="material-icons text-2xl text-gray-600 mb-2">
              {action.icon}
            </span>
            <span className="text-xs text-gray-600">{action.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};
