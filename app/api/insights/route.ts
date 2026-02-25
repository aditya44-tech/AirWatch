import { NextRequest, NextResponse } from 'next/server';
import { getMockCity, MOCK_INSIGHTS } from '@/lib/mock-data';
import { getGeminiResponse, buildInsightsPrompt } from '@/lib/gemini';

export async function GET(req: NextRequest) {
    const city = req.nextUrl.searchParams.get('city') || 'Delhi';

    try {
        if (!process.env.GEMINI_API_KEY) throw new Error('No Gemini key');

        const cityData = getMockCity(city);
        const prompt = buildInsightsPrompt(city, cityData);
        const raw = await getGeminiResponse(prompt);

        const jsonMatch = raw.match(/\[[\s\S]*\]/);
        if (!jsonMatch) throw new Error('Invalid AI response');
        const insights = JSON.parse(jsonMatch[0]);

        return NextResponse.json({ city, insights, source: 'ai' });
    } catch {
        return NextResponse.json({ city, insights: MOCK_INSIGHTS, source: 'mock' });
    }
}
