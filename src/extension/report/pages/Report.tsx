import React, { useState, useEffect } from 'react';
import { Header } from '../components/Header';
import { StatsBanner } from '../components/StatsBanner';
import { Summary } from '../components/Summary';
import { ContentSection } from '../components/ContentSection';
import { Sidebar } from '../components/Sidebar';
import { ContentItem, ContentType, ImportanceLevel } from '../../content/types';
import { storage } from '../../background/storage';

interface Report {
  date: string;
  summary: string;
  keywords: string[];
  contents: ContentItem[];
  stats: {
    textCount: number;
    imageCount: number;
    importantCount: number;
    totalTime: number;
    domains: number;
  };
  domains: Array<{
    domain: string;
    count: number;
    time: number;
  }>;
}

export const ReportPage: React.FC = () => {
  const [report, setReport] = useState<Report | null>(null);
  const [isGenerating, setIsGenerating] = useState(true);
  const [date] = useState(new Date());

  useEffect(() => {
    loadReport();
  }, []);

  const loadReport = async () => {
    try {
      const response = await chrome.runtime.sendMessage({
        type: 'GET_REPORT',
        data: { date: date.toISOString().split('T')[0] }
      });

      if (response.success) {
        setReport(response.report);
        setIsGenerating(false);
      }
    } catch (error) {
      console.error('Failed to load report:', error);
    }
  };

  if (!report) {
    return (
      <div>
        <Header date={date} />
        <main className="container py-8">
          <div className="text-center text-gray-500">加载中...</div>
        </main>
      </div>
    );
  }

  const getContentByImportance = (level: ImportanceLevel) => {
    return report.contents.filter(item => item.importance === level);
  };

  const getDomainStats = () => {
    const stats = report.contents.reduce((acc, item) => {
      try {
        const url = new URL(item.url);
        const domain = url.hostname;
        if (!acc[domain]) {
          acc[domain] = { count: 0, time: 0 };
        }
        acc[domain].count++;
        acc[domain].time += 120; // 假设每个内容平均阅读时间为2分钟
      } catch (error) {
        console.error('Invalid URL:', item.url);
      }
      return acc;
    }, {} as Record<string, { count: number; time: number }>);

    return Object.entries(stats)
      .map(([domain, stats]) => ({
        domain,
        count: stats.count,
        time: stats.time
      }))
      .sort((a, b) => b.count - a.count);
  };

  const getRecommendations = () => {
    return [...report.contents]
      .sort((a, b) => b.weight - a.weight)
      .slice(0, 5);
  };

  const importantContents = getContentByImportance(ImportanceLevel.HIGH);
  const normalContents = getContentByImportance(ImportanceLevel.MEDIUM);
  const otherContents = getContentByImportance(ImportanceLevel.LOW);
  const domains = getDomainStats();
  const recommendations = getRecommendations();

  return (
    <div>
      <Header date={date} />
      
      <main className="container py-8">
        <StatsBanner
          stats={report.stats}
          isGenerating={isGenerating}
        />

        <div className="grid">
          <div className="main-content">
            <Summary
              summary={report.summary}
              keywords={report.keywords}
            />

            <div className="report-content">
              <ContentSection
                content={importantContents}
                sectionTitle="重要内容"
              />
              <ContentSection
                content={normalContents}
                sectionTitle="最近内容"
              />
              <ContentSection
                content={report.contents}
                sectionTitle="全部内容"
              />
            </div>
          </div>

          <Sidebar
            content={report.contents}
            domains={domains}
            recommendations={recommendations}
          />
        </div>
      </main>
    </div>
  );
};
