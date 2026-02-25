'use client';

import { useState } from 'react';
import { AlertTriangle, X } from 'lucide-react';
import { getAqiCategory } from '@/lib/mock-data';

interface AlertsBannerProps {
    aqi: number;
    city: string;
    riskLevel?: string;
}

export default function AlertsBanner({ aqi, city, riskLevel }: AlertsBannerProps) {
    const [dismissed, setDismissed] = useState(false);
    if (dismissed || aqi <= 100) return null;

    const cat = getAqiCategory(aqi);
    const message =
        aqi > 300
            ? `⚠️ HAZARDOUS conditions in ${city}! All outdoor activity should be avoided immediately.`
            : aqi > 200
                ? `🚨 Very Unhealthy air in ${city}. Sensitive groups must stay indoors.`
                : aqi > 150
                    ? `🔴 Unhealthy air quality detected in ${city}. Limit outdoor exposure.`
                    : `🟠 Moderate-to-poor air quality in ${city}. Sensitive groups take precautions.`;

    return (
        <div
            className="alert-banner flex items-start gap-3 px-4 py-3 text-white text-sm"
            style={{
                background: `linear-gradient(135deg, ${cat.color}dd, ${cat.color}99)`,
                boxShadow: `0 4px 20px ${cat.color}40`,
            }}
        >
            <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
            <div className="flex-1">
                <span className="font-semibold">{riskLevel ? `${riskLevel} Risk · ` : ''}</span>
                {message}
            </div>
            <button onClick={() => setDismissed(true)} className="shrink-0 opacity-80 hover:opacity-100">
                <X className="w-4 h-4" />
            </button>
        </div>
    );
}
