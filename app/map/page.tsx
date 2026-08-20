'use client';

import { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import PollutionMap from '@/components/PollutionMap';
import { getAqiCategory } from '@/lib/mock-data';
import { Map as MapIcon } from 'lucide-react';

interface CityData {
  city: string; lat: number; lon: number; aqi: number;
}

export default function MapPage() {
  const [cities, setCities] = useState<CityData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/cities').then(r => r.json()).then(d => { setCities(d); setLoading(false); });
  }, []);

  return (
    <div style={{ background: 'var(--bg-primary)', minHeight: '100dvh' }}>
      <Navbar city="Delhi" onCityChange={() => { }} />
      <main
        className="max-w-7xl mx-auto px-4 sm:px-6 pt-8 pb-12"
        style={{ position: 'relative', zIndex: 1 }}
      >
        <div className="flex items-center gap-3 mb-8">
          <div
            className="w-10 h-10 rounded-lg flex items-center justify-center"
            style={{ background: 'var(--accent-muted)' }}
          >
            <MapIcon className="w-5 h-5" style={{ color: 'var(--accent)' }} />
          </div>
          <div>
            <h1 className="display-lg gradient-text">Pollution map</h1>
            <p className="body-sm" style={{ color: 'var(--text-secondary)' }}>
              Geographic air quality heat map across Indian cities
            </p>
          </div>
        </div>

        {loading ? (
          <div className="card shimmer" style={{ height: 500 }} />
        ) : (
          <>
            <PollutionMap cities={cities} />

            {/* City AQI grid beneath the map */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 mt-5">
              {cities.map(c => {
                const cat = getAqiCategory(c.aqi);
                return (
                  <div
                    key={c.city}
                    className="card text-center transition-all duration-200"
                    style={{ padding: '1rem' }}
                    onMouseEnter={e => {
                      (e.currentTarget as HTMLElement).style.borderColor = `${cat.color}50`;
                    }}
                    onMouseLeave={e => {
                      (e.currentTarget as HTMLElement).style.borderColor = '';
                    }}
                  >
                    <div
                      className="data-text font-black text-2xl mb-1"
                      style={{ color: cat.color, letterSpacing: '-0.03em' }}
                    >
                      {c.aqi}
                    </div>
                    <div
                      className="text-sm font-medium mb-1.5"
                      style={{ color: 'var(--text-primary)' }}
                    >
                      {c.city}
                    </div>
                    <span
                      className="text-[10px] font-semibold px-2 py-0.5"
                      style={{
                        background: `${cat.color}15`,
                        color: cat.color,
                        borderRadius: 'var(--radius-sm)',
                        letterSpacing: '0.04em',
                      }}
                    >
                      {cat.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </main>
    </div>
  );
}
