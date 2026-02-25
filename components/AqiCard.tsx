'use client';

import { getAqiCategory } from '@/lib/mock-data';
import { MapPin, Clock } from 'lucide-react';

interface AqiCardProps {
    city: string;
    aqi: number;
    lat: number;
    lon: number;
    source?: string;
}

export default function AqiCard({ city, aqi, lat, lon, source }: AqiCardProps) {
    const cat = getAqiCategory(aqi);
    const now = new Date().toLocaleString('en-IN', {
        hour: '2-digit', minute: '2-digit', hour12: true,
        day: 'numeric', month: 'short',
    });

    const ringSize = Math.min(200 + aqi * 0.3, 320);

    return (
        <div className="card fade-in relative overflow-hidden" style={{ minHeight: 280 }}>
            {/* Background glow matching AQI color */}
            <div
                className="absolute inset-0 opacity-10 pointer-events-none"
                style={{ background: `radial-gradient(ellipse at 50% 50%, ${cat.color} 0%, transparent 70%)` }}
            />

            <div className="flex flex-col items-center justify-center gap-4 py-4">
                {/* Pulsing ring */}
                <div className="relative flex items-center justify-center" style={{ width: ringSize * 0.6, height: ringSize * 0.6 }}>
                    <div
                        className="aqi-ring absolute rounded-full opacity-20"
                        style={{
                            width: '100%', height: '100%',
                            border: `3px solid ${cat.color}`,
                            boxShadow: `0 0 40px ${cat.color}`,
                        }}
                    />
                    <div
                        className="absolute rounded-full opacity-10"
                        style={{ width: '80%', height: '80%', background: cat.color }}
                    />

                    <div className="relative text-center">
                        <div
                            className="font-black leading-none"
                            style={{ fontSize: ringSize * 0.28, color: cat.color, textShadow: `0 0 30px ${cat.color}` }}
                        >
                            {aqi}
                        </div>
                        <div className="text-xs font-semibold mt-1" style={{ color: 'var(--text-secondary)' }}>
                            AQI
                        </div>
                    </div>
                </div>

                {/* Category badge */}
                <div>
                    <span
                        className="px-4 py-1.5 rounded-full text-sm font-bold tracking-wide text-white"
                        style={{ background: cat.color, boxShadow: `0 4px 15px ${cat.color}60` }}
                    >
                        {cat.label}
                    </span>
                </div>

                {/* City & time */}
                <div className="text-center">
                    <div className="flex items-center justify-center gap-1.5 mb-1">
                        <MapPin className="w-4 h-4" style={{ color: 'var(--text-secondary)' }} />
                        <h2 className="font-semibold text-lg" style={{ color: 'var(--text-primary)' }}>{city}</h2>
                    </div>
                    <div className="flex items-center justify-center gap-1.5">
                        <Clock className="w-3.5 h-3.5" style={{ color: 'var(--text-secondary)' }} />
                        <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>{now}</p>
                    </div>
                    {source === 'mock' && (
                        <p className="text-xs mt-1 opacity-50" style={{ color: 'var(--text-secondary)' }}>
                            Demo data — add API keys for live data
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
}
