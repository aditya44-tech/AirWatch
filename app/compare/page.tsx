'use client';

import { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, Legend
} from 'recharts';
import { getAqiCategory } from '@/lib/mock-data';
import { GitCompare } from 'lucide-react';

interface CityData {
  city: string; lat: number; lon: number;
  aqi: number; pm25: number; pm10: number; no2: number; co: number; o3: number;
}

export default function ComparePage() {
  const [cities, setCities] = useState<CityData[]>([]);
  const [selected, setSelected] = useState<string[]>(['Delhi', 'Mumbai', 'Bangalore']);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/cities').then(r => r.json()).then(d => { setCities(d); setLoading(false); });
  }, []);

  const filtered = cities.filter(c => selected.includes(c.city));
  const CHART_COLORS = ['#4a9eac', '#3fa87a', '#c9a93e', '#d4874e', '#8a6fc0'];

  const pollutantData = ['pm25', 'pm10', 'no2', 'co', 'o3'].map(key => {
    const row: Record<string, string | number> = { key: key.toUpperCase() };
    filtered.forEach(c => { row[c.city] = (c as unknown as Record<string, number>)[key]; });
    return row;
  });

  const toggleCity = (city: string) => {
    setSelected(prev => prev.includes(city) ? prev.filter(c => c !== city) : [...prev, city]);
  };

  if (loading) {
    return (
      <div style={{ background: 'var(--bg-primary)', minHeight: '100dvh' }}>
        <Navbar city="Delhi" onCityChange={() => { }} />
        <div className="max-w-7xl mx-auto px-4 pt-8">
          <div className="card shimmer" style={{ height: 400 }} />
        </div>
      </div>
    );
  }

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
            <GitCompare className="w-5 h-5" style={{ color: 'var(--accent)' }} />
          </div>
          <div>
            <h1 className="display-lg gradient-text">City comparison</h1>
            <p className="body-sm" style={{ color: 'var(--text-secondary)' }}>
              Compare air quality across Indian cities
            </p>
          </div>
        </div>

        {/* City selector chips */}
        <div className="flex flex-wrap gap-2 mb-8">
          {cities.map(c => {
            const cat = getAqiCategory(c.aqi);
            const isSelected = selected.includes(c.city);
            return (
              <button
                key={c.city}
                onClick={() => toggleCity(c.city)}
                className="px-3 py-1.5 text-sm font-medium transition-all duration-150"
                style={{
                  background: isSelected ? `${cat.color}15` : 'var(--bg-card)',
                  border: `1px solid ${isSelected ? `${cat.color}50` : 'var(--border-subtle)'}`,
                  color: isSelected ? cat.color : 'var(--text-secondary)',
                  borderRadius: 'var(--radius-sm)',
                }}
              >
                {c.city}
                <span className="data-text ml-1.5 font-bold text-xs">{c.aqi}</span>
              </button>
            );
          })}
        </div>

        {/* AQI comparison bar chart */}
        <div className="card mb-5">
          <h3 className="heading-md mb-5" style={{ color: 'var(--text-primary)' }}>
            AQI comparison
          </h3>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={filtered} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
              <XAxis dataKey="city" tick={{ fontSize: 11, fill: 'var(--text-tertiary)' }} tickLine={false} axisLine={false} />
              <YAxis tick={{ fontSize: 10, fill: 'var(--text-tertiary)' }} tickLine={false} axisLine={false} />
              <Tooltip
                contentStyle={{
                  background: 'var(--bg-card)',
                  border: '1px solid var(--border)',
                  borderRadius: 'var(--radius-md)',
                  fontSize: 12,
                  boxShadow: 'var(--shadow-lg)',
                }}
                labelStyle={{ color: 'var(--text-primary)', fontWeight: 600 }}
              />
              <Bar dataKey="aqi" radius={[8, 8, 0, 0]} label={{ position: 'top', fontSize: 10, fill: 'var(--text-tertiary)' }}>
                {filtered.map((c) => {
                  const cat = getAqiCategory(c.aqi);
                  return <Cell key={c.city} fill={cat.color} fillOpacity={0.8} />;
                })}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Pollutant grouped comparison */}
        <div className="card mb-5">
          <h3 className="heading-md mb-5" style={{ color: 'var(--text-primary)' }}>
            Pollutant breakdown by city
          </h3>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={pollutantData} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
              <XAxis dataKey="key" tick={{ fontSize: 11, fill: 'var(--text-tertiary)' }} tickLine={false} axisLine={false} />
              <YAxis tick={{ fontSize: 10, fill: 'var(--text-tertiary)' }} tickLine={false} axisLine={false} />
              <Tooltip
                contentStyle={{
                  background: 'var(--bg-card)',
                  border: '1px solid var(--border)',
                  borderRadius: 'var(--radius-md)',
                  fontSize: 12,
                  boxShadow: 'var(--shadow-lg)',
                }}
                labelStyle={{ color: 'var(--text-primary)', fontWeight: 600 }}
              />
              <Legend wrapperStyle={{ fontSize: 11, color: 'var(--text-secondary)' }} />
              {filtered.map((c, i) => (
                <Bar key={c.city} dataKey={c.city} fill={CHART_COLORS[i % CHART_COLORS.length]} radius={[4, 4, 0, 0]} />
              ))}
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Summary table */}
        <div className="card overflow-x-auto">
          <h3 className="heading-md mb-5" style={{ color: 'var(--text-primary)' }}>
            Summary table
          </h3>
          <table className="w-full text-sm">
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                {['City', 'AQI', 'Category', 'PM2.5', 'PM10', 'NO₂', 'CO', 'O₃'].map(h => (
                  <th
                    key={h}
                    className="text-left py-2.5 px-3 caption font-semibold"
                    style={{ color: 'var(--text-tertiary)' }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map(c => {
                const cat = getAqiCategory(c.aqi);
                return (
                  <tr
                    key={c.city}
                    style={{ borderBottom: '1px solid var(--border-subtle)' }}
                    className="transition-colors duration-150"
                    onMouseEnter={e => {
                      (e.currentTarget as HTMLElement).style.background = 'var(--bg-card-hover)';
                    }}
                    onMouseLeave={e => {
                      (e.currentTarget as HTMLElement).style.background = 'transparent';
                    }}
                  >
                    <td className="py-3 px-3 font-medium" style={{ color: 'var(--text-primary)' }}>{c.city}</td>
                    <td className="py-3 px-3 data-text font-bold" style={{ color: cat.color }}>{c.aqi}</td>
                    <td className="py-3 px-3">
                      <span
                        className="text-[10px] font-semibold px-2 py-0.5"
                        style={{
                          background: `${cat.color}15`,
                          color: cat.color,
                          borderRadius: 'var(--radius-sm)',
                        }}
                      >
                        {cat.label}
                      </span>
                    </td>
                    <td className="py-3 px-3 data-text" style={{ color: 'var(--text-primary)' }}>{c.pm25}</td>
                    <td className="py-3 px-3 data-text" style={{ color: 'var(--text-primary)' }}>{c.pm10}</td>
                    <td className="py-3 px-3 data-text" style={{ color: 'var(--text-primary)' }}>{c.no2}</td>
                    <td className="py-3 px-3 data-text" style={{ color: 'var(--text-primary)' }}>{c.co}</td>
                    <td className="py-3 px-3 data-text" style={{ color: 'var(--text-primary)' }}>{c.o3}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}
