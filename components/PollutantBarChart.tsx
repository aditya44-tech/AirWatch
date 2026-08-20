'use client';

import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell
} from 'recharts';

interface Props {
  pm25: number;
  pm10: number;
  no2: number;
  co: number;
  o3: number;
}

const COLORS = ['#d4874e', '#c9a93e', '#8a6fc0', '#4a9eac', '#3fa87a'];

export default function PollutantBarChart({ pm25, pm10, no2, co, o3 }: Props) {
  const data = [
    { name: 'PM2.5', value: pm25, unit: 'μg/m³', safe: 25 },
    { name: 'PM10', value: pm10, unit: 'μg/m³', safe: 50 },
    { name: 'NO₂', value: no2, unit: 'μg/m³', safe: 40 },
    { name: 'CO×10', value: co * 10, unit: 'mg/m³', safe: 40 },
    { name: 'O₃', value: o3, unit: 'μg/m³', safe: 100 },
  ];

  const CustomTooltip = ({ active, payload }: { active?: boolean; payload?: { payload: typeof data[0]; value: number }[] }) => {
    if (active && payload?.length) {
      const d = payload[0].payload;
      const isHigh = d.value > d.safe;
      return (
        <div
          className="rounded-lg p-3"
          style={{
            background: 'var(--bg-card)',
            border: '1px solid var(--border)',
            boxShadow: 'var(--shadow-lg)',
          }}
        >
          <p className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>
            {d.name}
          </p>
          <p className="data-text font-semibold" style={{ color: isHigh ? 'var(--red)' : 'var(--green)' }}>
            {payload[0].value.toFixed(1)} {d.unit}
          </p>
          <p className="caption" style={{ color: 'var(--text-tertiary)' }}>
            Safe: ≤{d.safe}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="card fade-in">
      <h3 className="heading-md mb-1" style={{ color: 'var(--text-primary)' }}>
        Pollutant levels
      </h3>
      <p className="caption mb-5" style={{ color: 'var(--text-tertiary)' }}>
        Current concentration by pollutant
      </p>
      <ResponsiveContainer width="100%" height={200}>
        <BarChart data={data} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
          <XAxis
            dataKey="name"
            tick={{ fontSize: 11, fill: 'var(--text-tertiary)' }}
            tickLine={false}
            axisLine={false}
          />
          <YAxis
            tick={{ fontSize: 10, fill: 'var(--text-tertiary)' }}
            tickLine={false}
            axisLine={false}
          />
          <Tooltip
            content={<CustomTooltip />}
            cursor={{ fill: 'rgba(255,255,255,0.02)' }}
          />
          <Bar dataKey="value" radius={[6, 6, 0, 0]}>
            {data.map((_, i) => (
              <Cell key={i} fill={COLORS[i]} fillOpacity={0.8} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
