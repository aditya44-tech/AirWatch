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
            <div className="rounded-xl p-3 text-sm shadow-2xl" style={{ background: 'var(--bg-card)', border: `1px solid ${cat.color}40` }}>
                <p className="font-bold" style={{ color: cat.color }}>AQI {aqi}</p>
                <p className="text-xs" style={{ color: cat.color }}>{cat.label}</p>
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
                <h3 className="font-semibold text-base" style={{ color: 'var(--text-primary)' }}>
                    24-Hour AI Forecast
                </h3>
                <span
                    className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium"
                    style={{ background: source === 'ai' ? 'rgba(139,92,246,0.15)' : 'rgba(100,116,139,0.15)', color: source === 'ai' ? '#a78bfa' : 'var(--text-secondary)' }}
                >
                    <Sparkles className="w-3 h-3" />
                    {source === 'ai' ? 'Gemini AI' : 'Simulated'}
                </span>
            </div>
            <p className="text-xs mb-4" style={{ color: 'var(--text-secondary)' }}>Predicted AQI for next 24 hours</p>
            <ResponsiveContainer width="100%" height={220}>
                <AreaChart data={chartData} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
                    <defs>
                        <linearGradient id="predGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.4} />
                            <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                        </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                    <XAxis
                        dataKey="label"
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
                    <Area
                        type="monotone"
                        dataKey="aqi"
                        stroke="#8b5cf6"
                        strokeWidth={2.5}
                        fill="url(#predGradient)"
                        dot={false}
                        activeDot={{ r: 5, fill: '#8b5cf6', stroke: '#fff', strokeWidth: 2 }}
                    />
                </AreaChart>
            </ResponsiveContainer>
        </div>
    );
}
