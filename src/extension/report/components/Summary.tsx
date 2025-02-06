import React from 'react';

interface SummaryProps {
  summary: string;
  keywords: string[];
}

export const Summary: React.FC<SummaryProps> = ({ summary, keywords }) => {
  return (
    <section className="article">
      <div className="font-serif text-xl leading-relaxed mb-6 pb-6 border-b border-gray-200">
        {summary}
      </div>

      {keywords.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-8">
          {keywords.map((keyword, index) => (
            <span
              key={index}
              className="px-3 py-1 bg-gray-100 text-sm text-gray-700 rounded-full"
            >
              {keyword}
            </span>
          ))}
        </div>
      )}
    </section>
  );
};
