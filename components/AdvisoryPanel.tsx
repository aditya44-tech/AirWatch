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
    Low: { icon: ShieldCheck, color: '#22c55e', bg: 'rgba(34,197,94,0.1)', border: 'rgba(34,197,94,0.3)' },
    Medium: { icon: AlertTriangle, color: '#eab308', bg: 'rgba(234,179,8,0.1)', border: 'rgba(234,179,8,0.3)' },
    High: { icon: ShieldAlert, color: '#ef4444', bg: 'rgba(239,68,68,0.1)', border: 'rgba(239,68,68,0.3)' },
    Hazardous: { icon: ShieldAlert, color: '#7c3aed', bg: 'rgba(124,58,237,0.1)', border: 'rgba(124,58,237,0.3)' },
};

export default function AdvisoryPanel({ riskLevel, recommendations, source, city, aqi }: AdvisoryPanelProps) {
    const config = RISK_CONFIG[riskLevel as keyof typeof RISK_CONFIG] ?? RISK_CONFIG.Medium;
    const RiskIcon = config.icon;

    return (
        <div className="card fade-in">
            <div className="flex items-center justify-between mb-4">
                <div>
                    <h3 className="font-semibold text-base" style={{ color: 'var(--text-primary)' }}>
                        Health Advisory
                    </h3>
                    <p className="text-xs mt-0.5" style={{ color: 'var(--text-secondary)' }}>{city} · AQI {aqi}</p>
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

            {/* Risk Level Badge */}
            <div
                className="flex items-center gap-3 p-4 rounded-xl mb-4"
                style={{ background: config.bg, border: `1px solid ${config.border}` }}
            >
                <RiskIcon className="w-6 h-6 shrink-0" style={{ color: config.color }} />
                <div>
                    <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>AI Risk Assessment</p>
                    <p className="text-lg font-black" style={{ color: config.color }}>{riskLevel} Risk</p>
                </div>
                <div className="ml-auto">
                    <div
                        className="w-10 h-10 rounded-full flex items-center justify-center font-black text-sm"
                        style={{ background: config.bg, color: config.color, border: `2px solid ${config.color}` }}
                    >
                        {aqi}
                    </div>
                </div>
            </div>

            {/* Recommendations */}
            <div className="flex flex-col gap-2.5">
                {recommendations.map((rec, i) => (
                    <div
                        key={i}
                        className="flex items-start gap-3 p-3 rounded-xl"
                        style={{ background: 'var(--bg-primary)', border: '1px solid var(--border)' }}
                    >
                        <span className="text-lg leading-none">{rec.split(' ')[0]}</span>
                        <p className="text-sm leading-relaxed" style={{ color: 'var(--text-primary)' }}>
                            {rec.split(' ').slice(1).join(' ')}
                        </p>
                    </div>
                ))}
            </div>
        </div>
    );
}
