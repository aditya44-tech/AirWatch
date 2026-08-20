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
  if (aqi <= 50) return { label: 'Good', color: '#3fa87a', bg: 'bg-green-500', textClass: 'text-green-400' };
  if (aqi <= 100) return { label: 'Moderate', color: '#c9a93e', bg: 'bg-yellow-500', textClass: 'text-yellow-400' };
  if (aqi <= 150) return { label: 'Unhealthy for sensitive groups', color: '#d4874e', bg: 'bg-orange-500', textClass: 'text-orange-400' };
  if (aqi <= 200) return { label: 'Unhealthy', color: '#c45a5a', bg: 'bg-red-500', textClass: 'text-red-400' };
  if (aqi <= 300) return { label: 'Very unhealthy', color: '#8a6fc0', bg: 'bg-purple-500', textClass: 'text-purple-400' };
  return { label: 'Hazardous', color: '#7f1d1d', bg: 'bg-red-900', textClass: 'text-red-300' };
}

export function getMockInsights(cityData: CityData): string[] {
  const insights: string[] = [];

  // Insight 1: General based on city and AQI
  if (cityData.aqi > 200) {
    insights.push(`${cityData.city} is currently experiencing severe air pollution, primarily driven by seasonal and geographical factors trapping emissions.`);
  } else if (cityData.aqi > 100) {
    insights.push(`Moderate-to-poor air quality in ${cityData.city} due to accumulated local emissions.`);
  } else {
    insights.push(`Air quality in ${cityData.city} is currently within acceptable limits.`);
  }

  // Insight 2: PM2.5 / Traffic
  if (cityData.pm25 > 50) {
    insights.push(`Heavy vehicular traffic and construction dust are keeping PM2.5 levels elevated at ${cityData.pm25} μg/m³.`);
  } else {
    insights.push(`PM2.5 levels are stable, indicating normal traffic flow without major congestion impacts.`);
  }

  // Insight 3: NO2 / Industry
  if (cityData.no2 > 40) {
    insights.push(`Significant NO₂ concentrations detected (${cityData.no2} μg/m³), indicating localized industrial emissions are a major contributing factor.`);
  } else {
    insights.push(`Industrial pollutant indicators like NO₂ are currently well within normal ranges.`);
  }

  // Insight 4: Weather
  if (cityData.lat > 25) { // Northern cities (e.g. Delhi, Jaipur, Lucknow)
    insights.push(`Low temperatures and low wind speeds in northern India are preventing dispersion of particulate matter.`);
  } else if (cityData.lat < 15) { // Southern cities (e.g. Bangalore, Chennai)
    insights.push(`Stronger coastal or southern breezes are aiding in the dispersion of localized pollutants.`);
  } else {
    insights.push(`Stagnant wind conditions are currently maintaining elevated pollutant concentrations near the surface in central regions.`);
  }

  // Insight 5: Predictive trend
  insights.push(`Based on historical patterns for ${cityData.city}, we anticipate a slight improvement in AQI over the next 12 hours as weather patterns shift.`);

  return insights;
}

export function getMockAdvisory(cityData: CityData): { riskLevel: string, recommendations: string[] } {
  let riskLevel = 'Low';

  if (cityData.aqi > 300) riskLevel = 'Hazardous';
  else if (cityData.aqi > 200) riskLevel = 'High';
  else if (cityData.aqi > 100) riskLevel = 'Medium';

  const recommendations = [];

  if (riskLevel === 'Hazardous' || riskLevel === 'High') {
    recommendations.push(`Wear an N95 mask when stepping outdoors in ${cityData.city}.`);
    recommendations.push(`Avoid outdoor exercise; limit physical exertion.`);
    recommendations.push(`Keep windows closed and run HEPA air purifiers indoors.`);
    recommendations.push(`Children, the elderly, and asthmatics must remain indoors.`);
    recommendations.push(`Avoid leaving the house entirely unless absolutely necessary.`);
  } else if (riskLevel === 'Medium') {
    recommendations.push(`Sensitive individuals should consider wearing a mask outdoors.`);
    recommendations.push(`Reduce prolonged or heavy exertion outdoors.`);
    recommendations.push(`Keep windows closed during peak traffic hours.`);
    recommendations.push(`Children and elderly should limit outdoor activities.`);
    recommendations.push(`Best time for outdoor activity in ${cityData.city} is early morning or late evening.`);
  } else {
    recommendations.push(`Air quality is good. A great day for outdoor activities.`);
    recommendations.push(`Ideal conditions for exercising outdoors.`);
    recommendations.push(`Open your windows to let fresh air circulate indoors.`);
    recommendations.push(`Perfectly safe for children and the elderly to be outside.`);
    recommendations.push(`No mask or special precautions are required today in ${cityData.city}.`);
  }

  return { riskLevel, recommendations };
}
