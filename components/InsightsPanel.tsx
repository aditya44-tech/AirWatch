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
            <div className="flex items-center justify-between mb-4">
                <div>
                    <h3 className="font-semibold text-base" style={{ color: 'var(--text-primary)' }}>
                        AI Insights — {city}
                    </h3>
                    <p className="text-xs mt-0.5" style={{ color: 'var(--text-secondary)' }}>
                        AI-generated pollution analysis
                    </p>
                </div>
                <span
                    className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium"
                    style={{
                        background: source === 'ai' ? 'rgba(139,92,246,0.15)' : 'rgba(100,116,139,0.15)',
                        color: source === 'ai' ? '#a78bfa' : 'var(--text-secondary)',
                    }}
                >
                    <Sparkles className="w-3 h-3" />
                    {source === 'ai' ? 'Gemini AI' : 'Simulated'}
                </span>
            </div>

            <div className="flex flex-col gap-3">
                {insights.map((insight, i) => (
                    <div
                        key={i}
                        className="flex items-start gap-3 p-3 rounded-xl transition-colors"
                        style={{ background: 'var(--bg-primary)', border: '1px solid var(--border)' }}
                    >
                        <div
                            className="shrink-0 w-6 h-6 rounded-lg flex items-center justify-center text-xs font-bold"
                            style={{ background: 'rgba(139,92,246,0.15)', color: '#a78bfa' }}
                        >
                            {i + 1}
                        </div>
                        <p className="text-sm leading-relaxed" style={{ color: 'var(--text-primary)' }}>
                            {insight}
                        </p>
                    </div>
                ))}
            </div>

            <div
                className="flex items-center gap-2 mt-4 p-3 rounded-xl"
                style={{ background: 'rgba(59,130,246,0.08)', border: '1px solid rgba(59,130,246,0.2)' }}
            >
                <TrendingUp className="w-4 h-4 shrink-0 text-blue-400" />
                <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                    Insights are generated from real-time pollutant readings and AI pattern recognition.
                </p>
            </div>
        </div>
    );
}
