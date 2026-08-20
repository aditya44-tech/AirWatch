'use client';

import { Sparkles, ShieldAlert, ShieldCheck, AlertTriangle } from 'lucide-react';

interface AdvisoryPanelProps {
  riskLevel: string;
  recommendations: string[];
  source: string;
  city: string;
  aqi: number;
}

const RISK_CONFIG = {
  Low: {
    icon: ShieldCheck,
    color: '#3fa87a',
    bg: 'rgba(63, 168, 122, 0.08)',
    border: 'rgba(63, 168, 122, 0.2)',
  },
  Medium: {
    icon: AlertTriangle,
    color: '#c9a93e',
    bg: 'rgba(201, 169, 62, 0.08)',
    border: 'rgba(201, 169, 62, 0.2)',
  },
  High: {
    icon: ShieldAlert,
    color: '#c45a5a',
    bg: 'rgba(196, 90, 90, 0.08)',
    border: 'rgba(196, 90, 90, 0.2)',
  },
  Hazardous: {
    icon: ShieldAlert,
    color: '#8a6fc0',
    bg: 'rgba(138, 111, 192, 0.08)',
    border: 'rgba(138, 111, 192, 0.2)',
  },
};

export default function AdvisoryPanel({
  riskLevel,
  recommendations,
  source,
  city,
  aqi,
}: AdvisoryPanelProps) {
  const config =
    RISK_CONFIG[riskLevel as keyof typeof RISK_CONFIG] ?? RISK_CONFIG.Medium;
  const RiskIcon = config.icon;

  return (
    <div className="card fade-in">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h3 className="heading-md" style={{ color: 'var(--text-primary)' }}>
            Health advisory
          </h3>
          <p className="caption mt-0.5" style={{ color: 'var(--text-tertiary)' }}>
            {city} · AQI{' '}
            <span className="data-text font-semibold">{aqi}</span>
          </p>
        </div>
        <span
          className="flex items-center gap-1.5 px-2 py-1 text-xs font-medium"
          style={{
            background:
              source === 'ai' ? 'var(--accent-muted)' : 'rgba(100,116,139,0.1)',
            color:
              source === 'ai' ? 'var(--accent)' : 'var(--text-tertiary)',
            borderRadius: 'var(--radius-sm)',
          }}
        >
          <Sparkles className="w-3 h-3" />
          {source === 'ai' ? 'Gemini AI' : 'Simulated'}
        </span>
      </div>

      {/* Risk Level Badge */}
      <div
        className="flex items-center gap-4 p-4 rounded-lg mb-5"
        style={{ background: config.bg, border: `1px solid ${config.border}` }}
      >
        <RiskIcon
          className="w-5 h-5 shrink-0"
          style={{ color: config.color }}
        />
        <div className="flex-1">
          <p className="caption" style={{ color: 'var(--text-tertiary)' }}>
            AI Risk Assessment
          </p>
          <p
            className="text-base font-bold"
            style={{ color: config.color }}
          >
            {riskLevel} Risk
          </p>
        </div>
        <div
          className="w-10 h-10 rounded-lg flex items-center justify-center data-text text-sm font-bold"
          style={{
            background: `${config.color}15`,
            color: config.color,
            border: `1px solid ${config.color}30`,
          }}
        >
          {aqi}
        </div>
      </div>

      {/* Recommendations */}
      <div className="flex flex-col gap-2">
        {recommendations.map((rec, i) => (
          <div
            key={i}
            className="flex items-start gap-3 p-3 rounded-lg"
            style={{
              background: 'var(--bg-surface)',
              border: '1px solid var(--border-subtle)',
            }}
          >
            <span className="text-base leading-none shrink-0">
              {rec.split(' ')[0]}
            </span>
            <p
              className="text-sm leading-relaxed"
              style={{ color: 'var(--text-primary)', textWrap: 'pretty' }}
            >
              {rec.split(' ').slice(1).join(' ')}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
