import { NextResponse } from 'next/server';
import { CITIES } from '@/lib/mock-data';

export async function GET() {
    const apiKey = process.env.OPENWEATHER_API_KEY;

    if (!apiKey) {
        return NextResponse.json(CITIES.map(c => ({ ...c, source: 'mock' })));
    }

    // Attempt live fetch for all cities in parallel
    const results = await Promise.allSettled(
        CITIES.map(async (city) => {
            const res = await fetch(
                `https://api.openweathermap.org/data/2.5/air_pollution?lat=${city.lat}&lon=${city.lon}&appid=${apiKey}`
            );
            const json = await res.json();
            const c = json.list[0].components;
            const aqiIndex = json.list[0].main.aqi;
            const aqiMap = [0, 25, 75, 125, 175, 300];
            return {
                ...city,
                aqi: aqiMap[aqiIndex] + Math.round(Math.random() * 30),
                pm25: parseFloat(c.pm2_5.toFixed(1)),
                pm10: parseFloat(c.pm10.toFixed(1)),
                no2: parseFloat(c.no2.toFixed(1)),
                co: parseFloat((c.co / 1000).toFixed(2)),
                o3: parseFloat(c.o3.toFixed(1)),
                source: 'live',
            };
        })
    );

    return NextResponse.json(
        results.map((r, i) =>
            r.status === 'fulfilled' ? r.value : { ...CITIES[i], source: 'mock' }
        )
    );
}
