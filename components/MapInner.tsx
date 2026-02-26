'use client';

import { MapContainer, TileLayer, CircleMarker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { getAqiCategory } from '@/lib/mock-data';

interface CityMarker {
    city: string;
    lat: number;
    lon: number;
    aqi: number;
}

export default function MapInner({ cities }: { cities: CityMarker[] }) {
    return (
        <div className="card fade-in overflow-hidden" style={{ padding: 0 }}>
            <div style={{ padding: '1.5rem 1.5rem 0.75rem' }}>
                <h3 className="font-semibold text-base" style={{ color: 'var(--text-primary)' }}>
                    Pollution Map — India
                </h3>
                <p className="text-xs mt-0.5" style={{ color: 'var(--text-secondary)' }}>
                    Circle size and color indicate AQI level
                </p>
            </div>
            <MapContainer
                center={[22, 80] as [number, number]}
                zoom={5}
                style={{ height: 360, width: '100%' }}
                zoomControl={false}
            >
                <TileLayer
                    url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org">OSM</a> &copy; <a href="https://carto.com">CARTO</a>'
                />
                {cities.map(marker => {
                    const cat = getAqiCategory(marker.aqi);
                    const radius = 8 + marker.aqi * 0.08;
                    return (
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        <CircleMarker
                            key={marker.city}
                            center={[marker.lat, marker.lon]}
                            {...({ radius } as any)}
                            pathOptions={{
                                fillColor: cat.color,
                                color: cat.color,
                                weight: 2,
                                opacity: 0.8,
                                fillOpacity: 0.45,
                            }}
                        >
                            <Popup>
                                <div style={{ fontFamily: 'Inter, sans-serif', minWidth: 140 }}>
                                    <p style={{ fontWeight: 700, fontSize: 14, marginBottom: 4 }}>{marker.city}</p>
                                    <p style={{ fontWeight: 800, fontSize: 22, color: cat.color, margin: '4px 0' }}>{marker.aqi}</p>
                                    <p style={{ fontSize: 11, color: cat.color, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{cat.label}</p>
                                </div>
                            </Popup>
                        </CircleMarker>
                    );
                })}
            </MapContainer>
            {/* Legend */}
            <div className="flex flex-wrap gap-3 px-4 py-3">
                {[
                    { label: 'Good', color: '#22c55e' },
                    { label: 'Moderate', color: '#eab308' },
                    { label: 'Unhealthy', color: '#ef4444' },
                    { label: 'Hazardous', color: '#7f1d1d' },
                ].map(item => (
                    <div key={item.label} className="flex items-center gap-1.5">
                        <span className="w-2.5 h-2.5 rounded-full" style={{ background: item.color }} />
                        <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>{item.label}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}
