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
        <div style={{ background: 'var(--bg-primary)', minHeight: '100vh' }}>
            <Navbar city="Delhi" onCityChange={() => { }} />
            <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
                <div className="flex items-center gap-3 mb-6">
                    <MapIcon className="w-6 h-6 text-blue-400" />
                    <div>
                        <h1 className="text-2xl font-black gradient-text">Pollution Map</h1>
                        <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                            Geographic air quality heat map across Indian cities
                        </p>
                    </div>
                </div>

                {loading ? (
                    <div className="card shimmer" style={{ height: 520 }} />
                ) : (
                    <>
                        <PollutionMap cities={cities} />

                        {/* City AQI grid beneath the map */}
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 mt-4">
                            {cities.map(c => {
                                const cat = getAqiCategory(c.aqi);
                                return (
                                    <div
                                        key={c.city}
                                        className="card text-center transition-all"
                                        style={{ padding: '1rem', borderColor: `${cat.color}40` }}
                                    >
                                        <div className="font-black text-2xl mb-1" style={{ color: cat.color }}>
                                            {c.aqi}
                                        </div>
                                        <div className="font-medium text-sm mb-1" style={{ color: 'var(--text-primary)' }}>
                                            {c.city}
                                        </div>
                                        <span
                                            className="text-xs px-2 py-0.5 rounded-full"
                                            style={{ background: `${cat.color}20`, color: cat.color }}
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
