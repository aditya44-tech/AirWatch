'use client';

import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';
import { getAqiCategory } from '@/lib/mock-data';
import { Sparkles } from 'lucide-react';

interface PredictionPoint {
  hour: number;
  label: string;
  aqi: number;
}

const CustomTooltip = ({ active, payload }: { active?: boolean; payload?: { value: number }[] }) => {
  if (active && payload?.length) {
    const aqi = payload[0].value;
    const cat = getAqiCategory(aqi);
    return (
      <div
        className="rounded-lg p-3"
        style={{
          background: 'var(--bg-card)',
          border: '1px solid var(--border)',
          boxShadow: 'var(--shadow-lg)',
        }}
      >
        <p className="data-text font-bold" style={{ color: cat.color }}>
          AQI {aqi}
        </p>
        <p className="caption" style={{ color: cat.color }}>{cat.label}</p>
      </div>
    );
  }
  return null;
};

export default function PredictionChart({ data, source }: { data: PredictionPoint[]; source: string }) {
  const chartData = data.map(d => ({ label: d.label, aqi: d.aqi }));

  return (
    <div className="card fade-in">
      <div className="flex items-center justify-between mb-1">
        <h3 className="heading-md" style={{ color: 'var(--text-primary)' }}>
          24-hour AI forecast
        </h3>
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
      <p className="caption mb-5" style={{ color: 'var(--text-tertiary)' }}>
        Predicted AQI for next 24 hours
      </p>
      <ResponsiveContainer width="100%" height={200}>
        <AreaChart data={chartData} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
          <defs>
            <linearGradient id="predGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="var(--accent)" stopOpacity={0.25} />
              <stop offset="95%" stopColor="var(--accent)" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--border-subtle)" vertical={false} />
          <XAxis
            dataKey="label"
            tick={{ fontSize: 10, fill: 'var(--text-tertiary)' }}
            tickLine={false}
            axisLine={false}
            interval={3}
          />
          <YAxis
            tick={{ fontSize: 10, fill: 'var(--text-tertiary)' }}
            tickLine={false}
            axisLine={false}
            domain={['auto', 'auto']}
          />
          <Tooltip content={<CustomTooltip />} />
          <Area
            type="monotone"
            dataKey="aqi"
            stroke="var(--accent)"
            strokeWidth={2}
            fill="url(#predGradient)"
            dot={false}
            activeDot={{ r: 4, fill: 'var(--accent)', stroke: 'var(--bg-card)', strokeWidth: 2 }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
