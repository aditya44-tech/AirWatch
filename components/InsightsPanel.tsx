'use client';

import { Sparkles, TrendingUp } from 'lucide-react';

interface InsightsPanelProps {
  insights: string[];
  source: string;
  city: string;
}

export default function InsightsPanel({ insights, source, city }: InsightsPanelProps) {
  return (
    <div className="card fade-in">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h3 className="heading-md" style={{ color: 'var(--text-primary)' }}>
            AI insights, {city}
          </h3>
          <p className="caption mt-0.5" style={{ color: 'var(--text-tertiary)' }}>
            AI-generated pollution analysis
          </p>
        </div>
        <span
          className="flex items-center gap-1.5 px-2 py-1 text-xs font-medium"
          style={{
            background: source === 'ai' ? 'var(--accent-muted)' : 'rgba(100,116,139,0.1)',
            color: source === 'ai' ? 'var(--accent)' : 'var(--text-tertiary)',
            borderRadius: 'var(--radius-sm)',
          }}
        >
          <Sparkles className="w-3 h-3" />
          {source === 'ai' ? 'Gemini AI' : 'Simulated'}
        </span>
      </div>

      <div className="flex flex-col gap-2.5">
        {insights.map((insight, i) => (
          <div
            key={i}
            className="flex items-start gap-3 p-3 rounded-lg transition-colors duration-150"
            style={{
              background: 'var(--bg-surface)',
              border: '1px solid var(--border-subtle)',
            }}
          >
            <div
              className="shrink-0 w-6 h-6 rounded-md flex items-center justify-center data-text text-xs font-bold"
              style={{
                background: 'var(--accent-muted)',
                color: 'var(--accent)',
              }}
            >
              {i + 1}
            </div>
            <p
              className="text-sm leading-relaxed"
              style={{ color: 'var(--text-primary)', textWrap: 'pretty' }}
            >
              {insight}
            </p>
          </div>
        ))}
      </div>

      <div
        className="flex items-center gap-2.5 mt-4 p-3 rounded-lg"
        style={{
          background: 'var(--accent-muted)',
          border: '1px solid rgba(74, 158, 172, 0.12)',
        }}
      >
        <TrendingUp
          className="w-4 h-4 shrink-0"
          style={{ color: 'var(--accent)' }}
        />
        <p className="caption" style={{ color: 'var(--text-secondary)' }}>
          Insights are generated from real-time pollutant readings and AI pattern recognition.
        </p>
      </div>
    </div>
  );
}
