import { NextRequest, NextResponse } from 'next/server';
import { getMockHistory, getMockPredictions } from '@/lib/mock-data';
import { getGeminiResponse, buildPredictionPrompt } from '@/lib/gemini';

export async function GET(req: NextRequest) {
    const city = req.nextUrl.searchParams.get('city') || 'Delhi';

    try {
        if (!process.env.GEMINI_API_KEY) throw new Error('No Gemini key');

        const history = getMockHistory(city, 24);
        const prompt = buildPredictionPrompt(city, history);
        const raw = await getGeminiResponse(prompt);

        // Extract JSON from response
        const jsonMatch = raw.match(/\[[\s\S]*\]/);
        if (!jsonMatch) throw new Error('Invalid AI response format');
        const predictions = JSON.parse(jsonMatch[0]);

        // Optionally persist prediction
        if (process.env.MONGODB_URI) {
            try {
                const { connectDB } = await import('@/lib/db');
                const Prediction = (await import('@/lib/models/Prediction')).default;
                await connectDB();
                await Prediction.create({ city, predictions, generatedAt: new Date() });
            } catch { /* silent */ }
        }

        return NextResponse.json({ city, predictions, source: 'ai' });
    } catch {
        return NextResponse.json({
            city,
            predictions: getMockPredictions(city),
            source: 'mock',
        });
    }
}
