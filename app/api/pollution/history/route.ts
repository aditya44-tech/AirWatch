import { NextRequest, NextResponse } from 'next/server';
import { getMockHistory } from '@/lib/mock-data';

export async function GET(req: NextRequest) {
    const city = req.nextUrl.searchParams.get('city') || 'Delhi';
    const hours = parseInt(req.nextUrl.searchParams.get('hours') || '48', 10);

    try {
        if (!process.env.MONGODB_URI) throw new Error('No DB');
        const { connectDB } = await import('@/lib/db');
        const AqiHistory = (await import('@/lib/models/AqiHistory')).default;
        await connectDB();

        const since = new Date(Date.now() - hours * 3600000);
        const records = await AqiHistory.find({
            city: new RegExp(city, 'i'),
            timestamp: { $gte: since },
        }).sort({ timestamp: 1 }).limit(200).lean();

        if (records.length === 0) throw new Error('No DB records');
        return NextResponse.json(records);
    } catch {
        return NextResponse.json(getMockHistory(city, hours));
    }
}
