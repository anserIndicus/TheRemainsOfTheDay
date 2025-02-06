import React from 'react';
import { ContentItem } from '../../content/types';

interface ContentSectionProps {
  content: ContentItem[];
  sectionTitle: string;
}

export const ContentSection: React.FC<ContentSectionProps> = ({ content, sectionTitle }) => {
  const formatTime = (timestamp: number) => {
    return new Date(timestamp).toLocaleString();
  };

  if (!content || content.length === 0) {
    return null;
  }

  return (
    <section className="content-section">
      <h2 className="section-title">{sectionTitle}</h2>
      <div className="content-list">
        {content.map((item) => (
          <div key={item.id} className="content-item">
            <div className="content-header">
              <h3>{item.metadata.title || '无标题'}</h3>
              <div className="content-meta">
                <span className="time">
                  {formatTime(item.timestamp)}
                </span>
                <a href={item.url} target="_blank" rel="noopener noreferrer">
                  查看原文
                </a>
              </div>
            </div>
            <div className="content-body">
              <p>{item.content}</p>
            </div>
            <div className="content-footer">
              <div className="tags">
                {item.metadata.tags.map((tag, index) => (
                  <span key={index} className="tag">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
