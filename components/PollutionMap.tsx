'use client';

import dynamic from 'next/dynamic';

// Dynamically import to avoid SSR issues with Leaflet
const MapInner = dynamic(() => import('./MapInner'), {
    ssr: false, loading: () => (
        <div className="card fade-in" style={{ height: 400 }}>
            <div className="flex items-center justify-center h-full">
                <div className="shimmer rounded-xl w-full h-full" />
            </div>
        </div>
    )
});

interface CityMarker {
    city: string;
    lat: number;
    lon: number;
    aqi: number;
}

export default function PollutionMap({ cities }: { cities: CityMarker[] }) {
    return <MapInner cities={cities} />;
}
