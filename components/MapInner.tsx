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
      <div className="px-5 pt-5 pb-3">
        <h3 className="heading-md" style={{ color: 'var(--text-primary)' }}>
          Pollution map, India
        </h3>
        <p className="caption mt-0.5" style={{ color: 'var(--text-tertiary)' }}>
          Circle size and color indicate AQI level
        </p>
      </div>
      <MapContainer
        center={[22, 80]}
        zoom={5}
        style={{ height: 340, width: '100%' }}
        zoomControl={false}
      >
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org">OSM</a> &copy; <a href="https://carto.com">CARTO</a>'
        />
        {cities.map(marker => {
          const cat = getAqiCategory(marker.aqi);
          const radius = 7 + marker.aqi * 0.07;
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
                opacity: 0.7,
                fillOpacity: 0.4,
              }}
            >
              <Popup>
                <div
                  style={{
                    fontFamily: 'var(--font-outfit), sans-serif',
                    minWidth: 130,
                    padding: '4px 0',
                  }}
                >
                  <p style={{ fontWeight: 600, fontSize: 13, marginBottom: 2, letterSpacing: '-0.01em' }}>
                    {marker.city}
                  </p>
                  <p
                    className="data-text"
                    style={{
                      fontWeight: 700,
                      fontSize: 22,
                      color: cat.color,
                      margin: '2px 0',
                      letterSpacing: '-0.03em',
                    }}
                  >
                    {marker.aqi}
                  </p>
                  <p
                    style={{
                      fontSize: 10,
                      color: cat.color,
                      letterSpacing: '0.06em',
                      textTransform: 'uppercase',
                    }}
                  >
                    {cat.label}
                  </p>
                </div>
              </Popup>
            </CircleMarker>
          );
        })}
      </MapContainer>
      {/* Legend */}
      <div className="flex flex-wrap gap-3 px-5 py-3">
        {[
          { label: 'Good', color: 'var(--green)' },
          { label: 'Moderate', color: 'var(--yellow)' },
          { label: 'Unhealthy', color: 'var(--red)' },
          { label: 'Hazardous', color: '#8a6fc0' },
        ].map(item => (
          <div key={item.label} className="flex items-center gap-1.5">
            <span
              className="w-2 h-2 rounded-sm"
              style={{ background: item.color }}
            />
            <span className="caption" style={{ color: 'var(--text-tertiary)' }}>
              {item.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
