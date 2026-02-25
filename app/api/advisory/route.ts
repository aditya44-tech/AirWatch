import { NextRequest, NextResponse } from 'next/server';
import { getMockCity, getMockAdvisory } from '@/lib/mock-data';
import { getGeminiResponse, buildAdvisoryPrompt } from '@/lib/gemini';

export async function GET(req: NextRequest) {
    const city = req.nextUrl.searchParams.get('city') || 'Delhi';
    const aqi = parseInt(req.nextUrl.searchParams.get('aqi') || '150', 10);

    try {
        if (!process.env.GEMINI_API_KEY) throw new Error('No Gemini key');

        const prompt = buildAdvisoryPrompt(city, aqi);
        const raw = await getGeminiResponse(prompt);

        const jsonMatch = raw.match(/\{[\s\S]*\}/);
        if (!jsonMatch) throw new Error('Invalid AI response');
        const advisory = JSON.parse(jsonMatch[0]);

        return NextResponse.json({ city, ...advisory, source: 'ai' });
    } catch {
        const cityData = getMockCity(city);
        return NextResponse.json({ city, ...getMockAdvisory(cityData), source: 'mock' });
    }
}
