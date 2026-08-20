'use client';

import { useState, useEffect, useCallback } from 'react';
import Navbar from '@/components/Navbar';
import AqiCard from '@/components/AqiCard';
import PollutantsGrid from '@/components/PollutantsGrid';
import AqiTrendChart from '@/components/AqiTrendChart';
import PollutantBarChart from '@/components/PollutantBarChart';
import PredictionChart from '@/components/PredictionChart';
import PollutionMap from '@/components/PollutionMap';
import InsightsPanel from '@/components/InsightsPanel';
import AdvisoryPanel from '@/components/AdvisoryPanel';
import AlertsBanner from '@/components/AlertsBanner';
import DownloadReport from '@/components/DownloadReport';
import { RefreshCw } from 'lucide-react';

interface PollutionData {
  city: string; lat: number; lon: number; aqi: number;
  pm25: number; pm10: number; no2: number; co: number; o3: number;
  source: string;
}
interface HistoryPoint { timestamp: string; aqi: number; pm25: number; pm10: number; no2: number; co: number; o3: number; }
interface PredictionPoint { hour: number; label: string; aqi: number; }
interface CityMarker { city: string; lat: number; lon: number; aqi: number; }

function LoadingCard({ h = 280 }: { h?: number }) {
  return <div className="card shimmer" style={{ height: h, borderRadius: 'var(--radius-lg)' }} />;
}

export default function DashboardPage() {
  const [city, setCity] = useState('Delhi');
  const [pollution, setPollution] = useState<PollutionData | null>(null);
  const [history, setHistory] = useState<HistoryPoint[]>([]);
  const [predictions, setPredictions] = useState<{ data: PredictionPoint[]; source: string } | null>(null);
  const [insights, setInsights] = useState<{ data: string[]; source: string } | null>(null);
  const [advisory, setAdvisory] = useState<{ riskLevel: string; recommendations: string[]; source: string } | null>(null);
  const [cities, setCities] = useState<CityMarker[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const fetchAll = useCallback(async (c: string) => {
    setLoading(true);
    try {
      const [pollRes, histRes, predRes, insRes, advRes, citiesRes] = await Promise.all([
        fetch(`/api/pollution?city=${encodeURIComponent(c)}`),
        fetch(`/api/pollution/history?city=${encodeURIComponent(c)}&hours=24`),
        fetch(`/api/predict?city=${encodeURIComponent(c)}`),
        fetch(`/api/insights?city=${encodeURIComponent(c)}`),
        fetch(`/api/advisory?city=${encodeURIComponent(c)}&aqi=150`),
        fetch('/api/cities'),
      ]);

      const [pollData, histData, predData, insData, advData, citiesData] = await Promise.all([
        pollRes.json(), histRes.json(), predRes.json(), insRes.json(), advRes.json(), citiesRes.json(),
      ]);

      setPollution(pollData);
      setHistory(histData);
      setPredictions({ data: predData.predictions, source: predData.source });
      setInsights({ data: insData.insights, source: insData.source });
      setAdvisory({ riskLevel: advData.riskLevel, recommendations: advData.recommendations, source: advData.source });
      setCities(citiesData);
      setLastUpdated(new Date());
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchAll(city); }, [city, fetchAll]);

  // Fetch advisory with actual AQI when pollution data arrives
  useEffect(() => {
    if (pollution) {
      fetch(`/api/advisory?city=${encodeURIComponent(city)}&aqi=${pollution.aqi}`)
        .then(r => r.json())
        .then(d => setAdvisory({ riskLevel: d.riskLevel, recommendations: d.recommendations, source: d.source }));
    }
  }, [pollution, city]);

  return (
    <div style={{ background: 'var(--bg-primary)', minHeight: '100dvh' }}>
      <Navbar city={city} onCityChange={(c) => { setCity(c); }} />

      {/* Alert banner */}
      {pollution && <AlertsBanner aqi={pollution.aqi} city={city} riskLevel={advisory?.riskLevel} />}

      <main
        className="max-w-7xl mx-auto px-4 sm:px-6 pt-8 pb-12"
        id="main-content"
        style={{ position: 'relative', zIndex: 1 }}
      >
        {/* Header: left-aligned for asymmetry */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <h1 className="display-lg gradient-text mb-1">Air quality dashboard</h1>
            <p className="body-sm" style={{ color: 'var(--text-secondary)' }}>
              {lastUpdated
                ? `Last updated ${lastUpdated.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true })}`
                : 'Loading data…'}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <DownloadReport />
            <button
              onClick={() => fetchAll(city)}
              disabled={loading}
              className="btn btn-ghost disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </button>
          </div>
        </div>

        {/* Top row: AQI + Pollutants, asymmetric 1:2 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-5">
          <div className="md:col-span-1">
            {loading || !pollution ? <LoadingCard h={320} /> : (
              <AqiCard city={pollution.city} aqi={pollution.aqi} lat={pollution.lat} lon={pollution.lon} source={pollution.source} />
            )}
          </div>
          <div className="md:col-span-2">
            {loading || !pollution ? <LoadingCard h={320} /> : (
              <PollutantsGrid data={{ pm25: pollution.pm25, pm10: pollution.pm10, no2: pollution.no2, co: pollution.co, o3: pollution.o3 }} />
            )}
          </div>
        </div>

        {/* Charts row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
          {loading || history.length === 0 ? <LoadingCard h={280} /> : <AqiTrendChart data={history} />}
          {loading || !pollution ? <LoadingCard h={280} /> : (
            <PollutantBarChart pm25={pollution.pm25} pm10={pollution.pm10} no2={pollution.no2} co={pollution.co} o3={pollution.o3} />
          )}
        </div>

        {/* AI Prediction, full width for breathing room */}
        <div className="mb-5">
          {loading || !predictions ? <LoadingCard h={280} /> : (
            <PredictionChart data={predictions.data} source={predictions.source} />
          )}
        </div>

        {/* Map, full width */}
        <div className="mb-5">
          {loading || cities.length === 0 ? <LoadingCard h={420} /> : <PollutionMap cities={cities} />}
        </div>

        {/* AI Insights + Advisory */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {loading || !insights ? <LoadingCard h={380} /> : (
            <InsightsPanel insights={insights.data} source={insights.source} city={city} />
          )}
          {loading || !advisory ? <LoadingCard h={380} /> : (
            <AdvisoryPanel
              riskLevel={advisory.riskLevel}
              recommendations={advisory.recommendations}
              source={advisory.source}
              city={city}
              aqi={pollution?.aqi ?? 0}
            />
          )}
        </div>
      </main>
    </div>
  );
}
