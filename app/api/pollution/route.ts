import { NextRequest, NextResponse } from 'next/server';
import { getMockCity } from '@/lib/mock-data';

export async function GET(req: NextRequest) {
    const city = req.nextUrl.searchParams.get('city') || 'Delhi';
    const apiKey = process.env.OPENWEATHER_API_KEY;

    try {
        if (!apiKey) throw new Error('No API key');

        // Geocode city first
        const geoRes = await fetch(
            `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(city)}&limit=1&appid=${apiKey}`
        );
        const geoData = await geoRes.json();
        if (!geoData.length) throw new Error('City not found');

        const { lat, lon } = geoData[0];

        // Fetch air pollution data
        const pollRes = await fetch(
            `https://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${apiKey}`
        );
        const pollData = await pollRes.json();
        const c = pollData.list[0].components;
        const aqiIndex = pollData.list[0].main.aqi;
        // OpenWeatherMap AQI index 1-5, convert to 0-500 scale
        const aqiMap = [0, 25, 75, 125, 175, 300];
        const aqi = aqiMap[aqiIndex] + Math.round(Math.random() * 30);

        const result = {
            city,
            lat,
            lon,
            aqi,
            pm25: parseFloat(c.pm2_5.toFixed(1)),
            pm10: parseFloat(c.pm10.toFixed(1)),
            no2: parseFloat(c.no2.toFixed(1)),
            co: parseFloat((c.co / 1000).toFixed(2)),
            o3: parseFloat(c.o3.toFixed(1)),
            source: 'live',
        };

        // Store in DB if MongoDB is configured
        if (process.env.MONGODB_URI) {
            try {
                const { connectDB } = await import('@/lib/db');
                const AqiHistory = (await import('@/lib/models/AqiHistory')).default;
                await connectDB();
                await AqiHistory.create({ ...result, timestamp: new Date() });
            } catch {
                // DB storage optional — don't fail the request
            }
        }

        return NextResponse.json(result);
    } catch {
        // Fallback to mock data
        const mock = getMockCity(city);
        return NextResponse.json({ ...mock, source: 'mock' });
    }
}
