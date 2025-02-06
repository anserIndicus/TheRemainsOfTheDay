import React from 'react';
import { ContentItem } from '../../content/types';

interface DomainStat {
  domain: string;
  count: number;
  time: number;
}

interface SidebarProps {
  content: ContentItem[];
  domains: DomainStat[];
  recommendations: ContentItem[];
}

export const Sidebar: React.FC<SidebarProps> = ({ content, domains, recommendations }) => {
  const getContentTypeStats = () => {
    return content.reduce((acc, item) => {
      if (!acc[item.metadata?.type]) {
        acc[item.metadata?.type] = 0;
      }
      acc[item.metadata?.type]++;
      return acc;
    }, {} as Record<string, number>);
  };

  const typeStats = getContentTypeStats();

  return (
    <aside className="sidebar">
      <section className="recommendations">
        <h3>推荐内容</h3>
        <div className="recommendation-list">
          {recommendations.map((item) => (
            <div key={item.id} className="recommendation-item">
              <a href={item.url} target="_blank" rel="noopener noreferrer">
                {item.metadata?.title || new URL(item.url).hostname}
              </a>
            </div>
          ))}
        </div>
      </section>

      <section className="domain-stats">
        <h3>浏览足迹</h3>
        <div className="domain-list">
          {domains.map((domain) => (
            <div key={domain.domain} className="domain-item">
              <div className="domain-info">
                <span className="domain-name">{domain.domain}</span>
                <span className="domain-meta">
                  {Math.round(domain.time / 60)}分钟 · {domain.count}条记录
                </span>
              </div>
              <div className="domain-bar">
                <div
                  className="domain-bar-fill"
                  style={{
                    width: `${Math.min(100, (domain.count / content.length) * 100)}%`
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="type-stats">
        <h3>内容类型</h3>
        <div className="type-list">
          {Object.entries(typeStats).map(([type, count]) => (
            <div key={type} className="type-item">
              <span className="type-name">{type}</span>
              <span className="type-count">{count}</span>
            </div>
          ))}
        </div>
      </section>
    </aside>
  );
};
