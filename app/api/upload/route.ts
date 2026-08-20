import { NextRequest, NextResponse } from 'next/server';
import { getMockInsights } from '@/lib/mock-data';

export async function POST(req: NextRequest) {
    try {
        const formData = await req.formData();
        const file = formData.get('file') as File | null;
        if (!file) return NextResponse.json({ error: 'No file provided' }, { status: 400 });

        const text = await file.text();
        const lines = text.split('\n').filter(Boolean);
        const headers = lines[0].split(',').map(h => h.trim());
        const rows = lines.slice(1, 20).map(line =>
            line.split(',').reduce((obj, val, i) => ({ ...obj, [headers[i]]: val.trim() }), {} as Record<string, string>)
        );

        let insights: string[] = ['Upload your CSV data to see AI-powered insights about pollution patterns, sources, and health impact.', 'Our analysis examines PM2.5, PM10, NO₂, CO, and O₃ concentrations against national and WHO standards.', 'Data from multiple monitoring stations is cross-referenced to identify pollution hotspots and dispersion patterns.', 'Seasonal and meteorological factors are considered when generating trend predictions from your dataset.', 'Health risk assessment is based on exposure duration, pollutant concentration, and vulnerable population proximity.'];
        if (process.env.GEMINI_API_KEY) {
            try {
                const { getGeminiResponse } = await import('@/lib/gemini');
                const preview = JSON.stringify(rows.slice(0, 5), null, 2);
                const prompt = `You are an air quality data analyst. Analyze this CSV pollution data and generate 5 specific insights:
${preview}

Headers: ${headers.join(', ')}

Respond with a JSON array of 5 insight strings. No markdown, no explanation.`;
                const raw = await getGeminiResponse(prompt);
                const match = raw.match(/\[[\s\S]*\]/);
                if (match) insights = JSON.parse(match[0]);
            } catch { /* use mock */ }
        }

        return NextResponse.json({
            fileName: file.name,
            rowCount: lines.length - 1,
            columns: headers,
            preview: rows.slice(0, 5),
            insights,
            source: process.env.GEMINI_API_KEY ? 'ai' : 'mock',
        });
    } catch (e) {
        return NextResponse.json({ error: String(e) }, { status: 500 });
    }
}
