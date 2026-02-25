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

const COLORS = ['#f97316', '#eab308', '#8b5cf6', '#06b6d4', '#22c55e'];

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
                <div className="rounded-xl p-3 text-sm shadow-2xl" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
                    <p className="font-semibold" style={{ color: 'var(--text-primary)' }}>{d.name}</p>
                    <p style={{ color: isHigh ? '#ef4444' : '#22c55e' }}>
                        {payload[0].value.toFixed(1)} {d.unit}
                    </p>
                    <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>Safe: ≤{d.safe}</p>
                </div>
            );
        }
        return null;
    };

    return (
        <div className="card fade-in">
            <h3 className="font-semibold text-base mb-1" style={{ color: 'var(--text-primary)' }}>
                Pollutant Levels
            </h3>
            <p className="text-xs mb-4" style={{ color: 'var(--text-secondary)' }}>Current concentration by pollutant</p>
            <ResponsiveContainer width="100%" height={200}>
                <BarChart data={data} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
                    <XAxis dataKey="name" tick={{ fontSize: 11, fill: 'var(--text-secondary)' }} tickLine={false} axisLine={false} />
                    <YAxis tick={{ fontSize: 10, fill: 'var(--text-secondary)' }} tickLine={false} axisLine={false} />
                    <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.03)' }} />
                    <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                        {data.map((_, i) => (
                            <Cell key={i} fill={COLORS[i]} fillOpacity={0.85} />
                        ))}
                    </Bar>
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
}
