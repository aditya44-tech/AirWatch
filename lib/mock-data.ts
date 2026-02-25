// Rich mock data used as fallback when API keys are not configured

export interface CityData {
    city: string;
    lat: number;
    lon: number;
    aqi: number;
    pm25: number;
    pm10: number;
    no2: number;
    co: number;
    o3: number;
}

export interface HistoryPoint {
    timestamp: string;
    aqi: number;
    pm25: number;
    pm10: number;
    no2: number;
    co: number;
    o3: number;
}

export interface PredictionPoint {
    hour: number;
    label: string;
    aqi: number;
}

export const CITIES: CityData[] = [
    { city: 'Delhi', lat: 28.6139, lon: 77.209, aqi: 182, pm25: 98.4, pm10: 152.3, no2: 44.1, co: 1.8, o3: 28.5 },
    { city: 'Mumbai', lat: 19.076, lon: 72.8777, aqi: 112, pm25: 54.2, pm10: 87.1, no2: 32.4, co: 1.1, o3: 35.2 },
    { city: 'Kolkata', lat: 22.5726, lon: 88.3639, aqi: 145, pm25: 74.8, pm10: 118.6, no2: 38.7, co: 1.4, o3: 22.8 },
    { city: 'Chennai', lat: 13.0827, lon: 80.2707, aqi: 78, pm25: 28.6, pm10: 51.4, no2: 21.3, co: 0.8, o3: 42.1 },
    { city: 'Bangalore', lat: 12.9716, lon: 77.5946, aqi: 94, pm25: 38.2, pm10: 64.8, no2: 28.9, co: 0.9, o3: 38.7 },
    { city: 'Hyderabad', lat: 17.385, lon: 78.4867, aqi: 88, pm25: 32.4, pm10: 58.2, no2: 24.6, co: 0.7, o3: 41.3 },
    { city: 'Pune', lat: 18.5204, lon: 73.8567, aqi: 102, pm25: 46.1, pm10: 78.5, no2: 29.8, co: 1.0, o3: 36.4 },
    { city: 'Ahmedabad', lat: 23.0225, lon: 72.5714, aqi: 138, pm25: 68.9, pm10: 108.3, no2: 35.2, co: 1.3, o3: 26.9 },
    { city: 'Jaipur', lat: 26.9124, lon: 75.7873, aqi: 156, pm25: 82.3, pm10: 132.4, no2: 41.8, co: 1.6, o3: 23.5 },
    { city: 'Lucknow', lat: 26.8467, lon: 80.9462, aqi: 168, pm25: 91.2, pm10: 144.7, no2: 42.9, co: 1.7, o3: 21.4 },
];

function generateHistory(baseAqi: number, hours = 48): HistoryPoint[] {
    const now = Date.now();
    return Array.from({ length: hours }, (_, i) => {
        const variation = (Math.random() - 0.5) * 30;
        const aqi = Math.max(10, Math.round(baseAqi + variation));
        return {
            timestamp: new Date(now - (hours - i) * 3600000).toISOString(),
            aqi,
            pm25: parseFloat((aqi * 0.54).toFixed(1)),
            pm10: parseFloat((aqi * 0.84).toFixed(1)),
            no2: parseFloat((aqi * 0.24).toFixed(1)),
            co: parseFloat((aqi * 0.01).toFixed(2)),
            o3: parseFloat((40 - aqi * 0.08).toFixed(1)),
        };
    });
}

function generatePredictions(baseAqi: number): PredictionPoint[] {
    const now = new Date();
    return Array.from({ length: 24 }, (_, i) => {
        const hour = i + 1;
        const timeOfDay = (now.getHours() + hour) % 24;
        // Traffic rush hours increase AQI
        const rushHourFactor = (timeOfDay >= 7 && timeOfDay <= 9) || (timeOfDay >= 17 && timeOfDay <= 20) ? 1.2 : 1.0;
        // Night hours slightly lower
        const nightFactor = timeOfDay >= 2 && timeOfDay <= 5 ? 0.85 : 1.0;
        const variation = (Math.random() - 0.45) * 20;
        const aqi = Math.max(10, Math.round(baseAqi * rushHourFactor * nightFactor + variation));
        const futureDate = new Date(Date.now() + hour * 3600000);
        return {
            hour,
            label: futureDate.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true }),
            aqi,
        };
    });
}

export function getMockCity(city: string): CityData {
    return CITIES.find(c => c.city.toLowerCase() === city.toLowerCase()) ?? CITIES[0];
}

export function getMockHistory(city: string, hours = 48): HistoryPoint[] {
    const cityData = getMockCity(city);
    return generateHistory(cityData.aqi, hours);
}

export function getMockPredictions(city: string): PredictionPoint[] {
    const cityData = getMockCity(city);
    return generatePredictions(cityData.aqi);
}

export function getAqiCategory(aqi: number): {
    label: string;
    color: string;
    bg: string;
    textClass: string;
} {
    if (aqi <= 50) return { label: 'Good', color: '#22c55e', bg: 'bg-green-500', textClass: 'text-green-400' };
    if (aqi <= 100) return { label: 'Moderate', color: '#eab308', bg: 'bg-yellow-500', textClass: 'text-yellow-400' };
    if (aqi <= 150) return { label: 'Unhealthy for Sensitive Groups', color: '#f97316', bg: 'bg-orange-500', textClass: 'text-orange-400' };
    if (aqi <= 200) return { label: 'Unhealthy', color: '#ef4444', bg: 'bg-red-500', textClass: 'text-red-400' };
    if (aqi <= 300) return { label: 'Very Unhealthy', color: '#a855f7', bg: 'bg-purple-500', textClass: 'text-purple-400' };
    return { label: 'Hazardous', color: '#7f1d1d', bg: 'bg-red-900', textClass: 'text-red-300' };
}

export const MOCK_INSIGHTS = [
    '🚗 Heavy traffic congestion on major arterials is the primary contributor to elevated PM2.5 levels during peak hours.',
    '🌡️ High temperature and low humidity are trapping pollutants near the surface, worsening AQI.',
    '🏭 Industrial emissions from the eastern corridor spiked overnight, raising NO₂ by 18%.',
    '🌧️ Light rainfall forecasted in 12 hours is expected to wash out particulates and improve AQI significantly.',
    '🌬️ Wind direction shifted westward — pollutants from neighboring regions are being carried into the city.',
];

export const MOCK_ADVISORY = {
    riskLevel: 'High',
    recommendations: [
        '😷 Wear an N95 mask when stepping outdoors — PM2.5 is at 3.2x the safe limit.',
        '🏃 Avoid outdoor exercise; reschedule morning runs to after 10 PM when AQI typically drops.',
        '🪟 Keep windows closed and run air purifiers with HEPA filters indoors.',
        '👶 Children, elderly, and those with respiratory conditions should remain indoors.',
        '🕐 If outdoor activity is unavoidable, limit exposure to under 30 minutes between 2 PM – 4 PM.',
    ],
};
