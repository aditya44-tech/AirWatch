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
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
    day: 'numeric',
    month: 'short',
  });

  const ringSize = Math.min(180 + aqi * 0.25, 280);

  return (
    <div
      className="card fade-in relative overflow-hidden"
      style={{ minHeight: 300 }}
    >
      {/* Subtle background glow matching AQI color */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `radial-gradient(ellipse at 50% 40%, ${cat.color}0a 0%, transparent 65%)`,
        }}
      />

      <div className="flex flex-col items-center justify-center gap-5 py-6 relative">
        {/* Pulsing ring */}
        <div
          className="relative flex items-center justify-center"
          style={{ width: ringSize * 0.55, height: ringSize * 0.55 }}
        >
          <div
            className="aqi-ring absolute rounded-full"
            style={{
              width: '100%',
              height: '100%',
              border: `2px solid ${cat.color}40`,
              boxShadow: `0 0 30px ${cat.color}15`,
            }}
          />
          <div
            className="absolute rounded-full"
            style={{
              width: '85%',
              height: '85%',
              background: `${cat.color}08`,
            }}
          />

          <div className="relative text-center">
            <div
              className="data-text font-black leading-none"
              style={{
                fontSize: ringSize * 0.26,
                color: cat.color,
                letterSpacing: '-0.04em',
              }}
            >
              {aqi}
            </div>
            <div
              className="caption mt-1"
              style={{ color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.08em' }}
            >
              AQI
            </div>
          </div>
        </div>

        {/* Category badge: square, not pill */}
        <span
          className="px-3 py-1 text-xs font-semibold tracking-wide"
          style={{
            background: `${cat.color}18`,
            color: cat.color,
            borderRadius: 'var(--radius-sm)',
            border: `1px solid ${cat.color}30`,
          }}
        >
          {cat.label}
        </span>

        {/* City & time */}
        <div className="text-center">
          <div className="flex items-center justify-center gap-1.5 mb-0.5">
            <MapPin
              className="w-3.5 h-3.5"
              style={{ color: 'var(--text-tertiary)' }}
            />
            <h2
              className="heading-md"
              style={{ color: 'var(--text-primary)' }}
            >
              {city}
            </h2>
          </div>
          <div className="flex items-center justify-center gap-1.5">
            <Clock
              className="w-3 h-3"
              style={{ color: 'var(--text-tertiary)' }}
            />
            <p className="caption" style={{ color: 'var(--text-tertiary)' }}>
              {now}
            </p>
          </div>
          {source === 'mock' && (
            <p
              className="caption mt-1.5 opacity-60"
              style={{ color: 'var(--text-tertiary)' }}
            >
              Demo data. Add API keys for live data.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
