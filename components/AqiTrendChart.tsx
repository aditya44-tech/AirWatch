'use client';

import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, ReferenceLine
} from 'recharts';
import { getAqiCategory } from '@/lib/mock-data';

interface HistoryPoint {
  timestamp: string;
  aqi: number;
}

const CustomTooltip = ({ active, payload, label }: { active?: boolean; payload?: { value: number }[]; label?: string }) => {
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
          fontFamily: 'var(--font-outfit)',
        }}
      >
        <p className="caption" style={{ color: 'var(--text-tertiary)' }}>{label}</p>
        <p className="data-text font-bold text-base" style={{ color: cat.color }}>
          {aqi}
        </p>
        <p className="caption" style={{ color: cat.color }}>{cat.label}</p>
      </div>
    );
  }
  return null;
};

export default function AqiTrendChart({ data }: { data: HistoryPoint[] }) {
  const chartData = data.slice(-24).map(d => ({
    time: new Date(d.timestamp).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true }),
    aqi: d.aqi,
  }));

  return (
    <div className="card fade-in">
      <h3 className="heading-md mb-1" style={{ color: 'var(--text-primary)' }}>
        24-hour AQI trend
      </h3>
      <p className="caption mb-5" style={{ color: 'var(--text-tertiary)' }}>
        Historical air quality index
      </p>
      <ResponsiveContainer width="100%" height={200}>
        <LineChart data={chartData} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
          <defs>
            <linearGradient id="aqiGradient" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="var(--green)" />
              <stop offset="50%" stopColor="var(--yellow)" />
              <stop offset="100%" stopColor="var(--red)" />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--border-subtle)" vertical={false} />
          <XAxis
            dataKey="time"
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
          <ReferenceLine
            y={100}
            stroke="var(--yellow)"
            strokeDasharray="4 4"
            strokeWidth={1}
            label={{ value: 'Moderate', fontSize: 9, fill: 'var(--yellow)', position: 'insideTopRight' }}
          />
          <ReferenceLine
            y={150}
            stroke="var(--red)"
            strokeDasharray="4 4"
            strokeWidth={1}
            label={{ value: 'Unhealthy', fontSize: 9, fill: 'var(--red)', position: 'insideTopRight' }}
          />
          <Line
            type="monotone"
            dataKey="aqi"
            stroke="url(#aqiGradient)"
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 4, fill: 'var(--accent)', strokeWidth: 2, stroke: 'var(--bg-card)' }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
