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
    const CHART_COLORS = ['#3b82f6', '#8b5cf6', '#06b6d4', '#f97316', '#22c55e'];

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
            <div style={{ background: 'var(--bg-primary)', minHeight: '100vh' }}>
                <Navbar city="Delhi" onCityChange={() => { }} />
                <div className="max-w-7xl mx-auto px-4 py-8">
                    <div className="card shimmer" style={{ height: 400 }} />
                </div>
            </div>
        );
    }

    return (
        <div style={{ background: 'var(--bg-primary)', minHeight: '100vh' }}>
            <Navbar city="Delhi" onCityChange={() => { }} />
            <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
                <div className="flex items-center gap-3 mb-6">
                    <GitCompare className="w-6 h-6 text-blue-400" />
                    <div>
                        <h1 className="text-2xl font-black gradient-text">City Comparison</h1>
                        <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>Compare air quality across Indian cities</p>
                    </div>
                </div>

                {/* City selector chips */}
                <div className="flex flex-wrap gap-2 mb-6">
                    {cities.map(c => {
                        const cat = getAqiCategory(c.aqi);
                        const isSelected = selected.includes(c.city);
                        return (
                            <button
                                key={c.city}
                                onClick={() => toggleCity(c.city)}
                                className="px-3 py-1.5 rounded-xl text-sm font-medium transition-all"
                                style={{
                                    background: isSelected ? `${cat.color}20` : 'var(--bg-card)',
                                    border: `1px solid ${isSelected ? cat.color : 'var(--border)'}`,
                                    color: isSelected ? cat.color : 'var(--text-secondary)',
                                }}
                            >
                                {c.city}
                                <span className="ml-1.5 font-bold">{c.aqi}</span>
                            </button>
                        );
                    })}
                </div>

                {/* AQI comparison bar chart */}
                <div className="card mb-4">
                    <h3 className="font-semibold text-base mb-4" style={{ color: 'var(--text-primary)' }}>AQI Comparison</h3>
                    <ResponsiveContainer width="100%" height={260}>
                        <BarChart data={filtered} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
                            <XAxis dataKey="city" tick={{ fontSize: 11, fill: 'var(--text-secondary)' }} tickLine={false} axisLine={false} />
                            <YAxis tick={{ fontSize: 10, fill: 'var(--text-secondary)' }} tickLine={false} axisLine={false} />
                            <Tooltip
                                contentStyle={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 12, fontSize: 12 }}
                                labelStyle={{ color: 'var(--text-primary)', fontWeight: 700 }}
                            />
                            <Bar dataKey="aqi" radius={[8, 8, 0, 0]} label={{ position: 'top', fontSize: 10, fill: 'var(--text-secondary)' }}>
                                {filtered.map((c) => {
                                    const cat = getAqiCategory(c.aqi);
                                    return <Cell key={c.city} fill={cat.color} fillOpacity={0.85} />;
                                })}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                {/* Pollutant grouped comparison */}
                <div className="card mb-4">
                    <h3 className="font-semibold text-base mb-4" style={{ color: 'var(--text-primary)' }}>Pollutant Breakdown by City</h3>
                    <ResponsiveContainer width="100%" height={260}>
                        <BarChart data={pollutantData} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
                            <XAxis dataKey="key" tick={{ fontSize: 11, fill: 'var(--text-secondary)' }} tickLine={false} axisLine={false} />
                            <YAxis tick={{ fontSize: 10, fill: 'var(--text-secondary)' }} tickLine={false} axisLine={false} />
                            <Tooltip
                                contentStyle={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 12, fontSize: 12 }}
                                labelStyle={{ color: 'var(--text-primary)', fontWeight: 700 }}
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
                    <h3 className="font-semibold text-base mb-4" style={{ color: 'var(--text-primary)' }}>Summary Table</h3>
                    <table className="w-full text-sm">
                        <thead>
                            <tr style={{ borderBottom: '1px solid var(--border)' }}>
                                {['City', 'AQI', 'Category', 'PM2.5', 'PM10', 'NO₂', 'CO', 'O₃'].map(h => (
                                    <th key={h} className="text-left py-2 px-3 font-medium" style={{ color: 'var(--text-secondary)' }}>{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.map(c => {
                                const cat = getAqiCategory(c.aqi);
                                return (
                                    <tr key={c.city} style={{ borderBottom: '1px solid var(--border)' }} className="hover:bg-[var(--bg-card-hover)] transition-colors">
                                        <td className="py-3 px-3 font-medium" style={{ color: 'var(--text-primary)' }}>{c.city}</td>
                                        <td className="py-3 px-3 font-black" style={{ color: cat.color }}>{c.aqi}</td>
                                        <td className="py-3 px-3">
                                            <span className="px-2 py-0.5 rounded-full text-xs font-medium" style={{ background: `${cat.color}20`, color: cat.color }}>{cat.label}</span>
                                        </td>
                                        <td className="py-3 px-3" style={{ color: 'var(--text-primary)' }}>{c.pm25}</td>
                                        <td className="py-3 px-3" style={{ color: 'var(--text-primary)' }}>{c.pm10}</td>
                                        <td className="py-3 px-3" style={{ color: 'var(--text-primary)' }}>{c.no2}</td>
                                        <td className="py-3 px-3" style={{ color: 'var(--text-primary)' }}>{c.co}</td>
                                        <td className="py-3 px-3" style={{ color: 'var(--text-primary)' }}>{c.o3}</td>
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
