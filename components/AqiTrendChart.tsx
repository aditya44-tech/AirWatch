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
                className="rounded-xl p-3 text-sm shadow-2xl"
                style={{ background: 'var(--bg-card)', border: `1px solid ${cat.color}40` }}
            >
                <p style={{ color: 'var(--text-secondary)' }} className="text-xs mb-1">{label}</p>
                <p className="font-bold" style={{ color: cat.color }}>AQI {aqi}</p>
                <p className="text-xs" style={{ color: cat.color }}>{cat.label}</p>
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
            <h3 className="font-semibold text-base mb-1" style={{ color: 'var(--text-primary)' }}>
                24-Hour AQI Trend
            </h3>
            <p className="text-xs mb-4" style={{ color: 'var(--text-secondary)' }}>Historical air quality index</p>
            <ResponsiveContainer width="100%" height={220}>
                <LineChart data={chartData} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
                    <defs>
                        <linearGradient id="aqiGradient" x1="0" y1="0" x2="1" y2="0">
                            <stop offset="0%" stopColor="#22c55e" />
                            <stop offset="50%" stopColor="#f97316" />
                            <stop offset="100%" stopColor="#ef4444" />
                        </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                    <XAxis
                        dataKey="time"
                        tick={{ fontSize: 10, fill: 'var(--text-secondary)' }}
                        tickLine={false}
                        axisLine={false}
                        interval={3}
                    />
                    <YAxis
                        tick={{ fontSize: 10, fill: 'var(--text-secondary)' }}
                        tickLine={false}
                        axisLine={false}
                        domain={['auto', 'auto']}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <ReferenceLine y={100} stroke="#eab308" strokeDasharray="4 4" strokeWidth={1} label={{ value: 'Moderate', fontSize: 9, fill: '#eab308', position: 'insideTopRight' }} />
                    <ReferenceLine y={150} stroke="#ef4444" strokeDasharray="4 4" strokeWidth={1} label={{ value: 'Unhealthy', fontSize: 9, fill: '#ef4444', position: 'insideTopRight' }} />
                    <Line
                        type="monotone"
                        dataKey="aqi"
                        stroke="url(#aqiGradient)"
                        strokeWidth={2.5}
                        dot={false}
                        activeDot={{ r: 5, fill: '#3b82f6', strokeWidth: 2, stroke: '#fff' }}
                    />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
}
