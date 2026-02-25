'use client';

interface Pollutants {
    pm25: number;
    pm10: number;
    no2: number;
    co: number;
    o3: number;
}

interface PollutantConfig {
    key: keyof Pollutants;
    label: string;
    unit: string;
    safe: number;
    color: string;
    description: string;
}

const POLLUTANTS: PollutantConfig[] = [
    { key: 'pm25', label: 'PM2.5', unit: 'μg/m³', safe: 25, color: '#f97316', description: 'Fine particles' },
    { key: 'pm10', label: 'PM10', unit: 'μg/m³', safe: 50, color: '#eab308', description: 'Coarse particles' },
    { key: 'no2', label: 'NO₂', unit: 'μg/m³', safe: 40, color: '#8b5cf6', description: 'Nitrogen dioxide' },
    { key: 'co', label: 'CO', unit: 'mg/m³', safe: 4, color: '#06b6d4', description: 'Carbon monoxide' },
    { key: 'o3', label: 'O₃', unit: 'μg/m³', safe: 100, color: '#22c55e', description: 'Ground ozone' },
];

export default function PollutantsGrid({ data }: { data: Pollutants }) {
    return (
        <div className="card fade-in">
            <h3 className="font-semibold text-base mb-4" style={{ color: 'var(--text-primary)' }}>
                Pollutant Breakdown
            </h3>
            <div className="grid grid-cols-1 gap-4">
                {POLLUTANTS.map(p => {
                    const value = data[p.key];
                    const pct = Math.min((value / (p.safe * 3)) * 100, 100);
                    const isHigh = value > p.safe;
                    return (
                        <div key={p.key}>
                            <div className="flex items-center justify-between mb-1.5">
                                <div className="flex items-center gap-2">
                                    <span
                                        className="w-2 h-2 rounded-full"
                                        style={{ background: p.color, boxShadow: `0 0 6px ${p.color}` }}
                                    />
                                    <span className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>{p.label}</span>
                                    <span className="text-xs hidden sm:inline" style={{ color: 'var(--text-secondary)' }}>{p.description}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="text-sm font-bold" style={{ color: isHigh ? p.color : 'var(--text-primary)' }}>
                                        {value} <span className="text-xs font-normal" style={{ color: 'var(--text-secondary)' }}>{p.unit}</span>
                                    </span>
                                    {isHigh && (
                                        <span className="text-xs px-1.5 py-0.5 rounded-full" style={{ background: `${p.color}20`, color: p.color }}>
                                            HIGH
                                        </span>
                                    )}
                                </div>
                            </div>
                            {/* Progress bar */}
                            <div
                                className="h-1.5 rounded-full overflow-hidden"
                                style={{ background: 'var(--border)' }}
                            >
                                <div
                                    className="h-full rounded-full transition-all duration-1000"
                                    style={{
                                        width: `${pct}%`,
                                        background: `linear-gradient(90deg, ${p.color}80, ${p.color})`,
                                        boxShadow: pct > 50 ? `0 0 8px ${p.color}80` : 'none',
                                    }}
                                />
                            </div>
                            <div className="flex justify-between mt-0.5">
                                <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>0</span>
                                <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>Safe: {p.safe}</span>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
