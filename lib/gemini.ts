import { GoogleGenerativeAI } from '@google/generative-ai';

const apiKey = process.env.GEMINI_API_KEY || '';

export async function getGeminiResponse(prompt: string): Promise<string> {
    if (!apiKey) throw new Error('GEMINI_API_KEY not set');
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    const result = await model.generateContent(prompt);
    return result.response.text();
}

export function buildPredictionPrompt(
    city: string,
    history: { timestamp: string; aqi: number }[]
): string {
    const recent = history.slice(-12).map(h => `${new Date(h.timestamp).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}: AQI ${h.aqi}`).join('\n');
    return `You are an expert air quality forecasting model. Given the following 12-hour AQI history for ${city}, predict the AQI for each of the next 24 hours.

Recent AQI data:
${recent}

Respond ONLY with a valid JSON array of 24 objects in this exact format, no markdown, no explanation:
[{"hour":1,"label":"HH:MM AM/PM","aqi":number},...]

Start label from the next hour after current time. Use realistic values between 10 and 500 based on trends.`;
}

export function buildInsightsPrompt(city: string, current: { aqi: number; pm25: number; pm10: number; no2: number; co: number; o3: number }): string {
    return `You are an air quality expert analyzing pollution data for ${city}.

Current readings:
- AQI: ${current.aqi}
- PM2.5: ${current.pm25} μg/m³
- PM10: ${current.pm10} μg/m³
- NO₂: ${current.no2} μg/m³
- CO: ${current.co} mg/m³
- O₃: ${current.o3} μg/m³

Generate exactly 5 concise, specific insight bullets about the causes, contributing factors, and expected trends. Be specific and mention traffic, industry, weather, seasons, geography where relevant.

Respond ONLY with a JSON array of strings, no markdown:
["insight 1","insight 2","insight 3","insight 4","insight 5"]`;
}

export function buildAdvisoryPrompt(city: string, aqi: number): string {
    return `You are a public health advisor. AQI in ${city} is currently ${aqi}.

Generate:
1. A risk level: one of "Low", "Medium", "High", or "Hazardous"
2. Exactly 5 health advisory recommendations, tailored to the AQI level.

Respond ONLY with valid JSON, no markdown:
{"riskLevel":"High","recommendations":["rec 1","rec 2","rec 3","rec 4","rec 5"]}`;
}
