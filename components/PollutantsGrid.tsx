'use client';

interface Pollutants {
  pm25: number;
  pm10: number;
  no2: number;
  co: number;
  o3: number;
}

interface PollutantConfig {
  key: keyof Pollutants;
  label: string;
  unit: string;
  safe: number;
  color: string;
  description: string;
}

const POLLUTANTS: PollutantConfig[] = [
  { key: 'pm25', label: 'PM2.5', unit: 'μg/m³', safe: 25, color: '#d4874e', description: 'Fine particles' },
  { key: 'pm10', label: 'PM10', unit: 'μg/m³', safe: 50, color: '#c9a93e', description: 'Coarse particles' },
  { key: 'no2', label: 'NO₂', unit: 'μg/m³', safe: 40, color: '#8a6fc0', description: 'Nitrogen dioxide' },
  { key: 'co', label: 'CO', unit: 'mg/m³', safe: 4, color: '#4a9eac', description: 'Carbon monoxide' },
  { key: 'o3', label: 'O₃', unit: 'μg/m³', safe: 100, color: '#3fa87a', description: 'Ground ozone' },
];

export default function PollutantsGrid({ data }: { data: Pollutants }) {
  return (
    <div className="card fade-in">
      <h3 className="heading-md mb-5" style={{ color: 'var(--text-primary)' }}>
        Pollutant breakdown
      </h3>
      <div className="grid grid-cols-1 gap-4">
        {POLLUTANTS.map(p => {
          const value = data[p.key];
          const pct = Math.min((value / (p.safe * 3)) * 100, 100);
          const isHigh = value > p.safe;
          return (
            <div key={p.key}>
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-2.5">
                  <span
                    className="w-2 h-2 rounded-sm shrink-0"
                    style={{ background: p.color }}
                  />
                  <span
                    className="text-sm font-semibold"
                    style={{ color: 'var(--text-primary)' }}
                  >
                    {p.label}
                  </span>
                  <span
                    className="text-xs hidden sm:inline"
                    style={{ color: 'var(--text-tertiary)' }}
                  >
                    {p.description}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="data-text text-sm font-semibold" style={{ color: isHigh ? p.color : 'var(--text-primary)' }}>
                    {value}
                    <span
                      className="text-xs font-normal ml-1"
                      style={{ color: 'var(--text-tertiary)' }}
                    >
                      {p.unit}
                    </span>
                  </span>
                  {isHigh && (
                    <span
                      className="text-[10px] font-semibold px-1.5 py-0.5"
                      style={{
                        background: `${p.color}18`,
                        color: p.color,
                        borderRadius: 'var(--radius-sm)',
                        letterSpacing: '0.04em',
                      }}
                    >
                      HIGH
                    </span>
                  )}
                </div>
              </div>
              {/* Progress bar */}
              <div
                className="h-1 rounded-full overflow-hidden"
                style={{ background: 'var(--border-subtle)' }}
              >
                <div
                  className="h-full rounded-full transition-all duration-700"
                  style={{
                    width: `${pct}%`,
                    background: `linear-gradient(90deg, ${p.color}60, ${p.color})`,
                  }}
                />
              </div>
              <div className="flex justify-between mt-1">
                <span className="caption" style={{ color: 'var(--text-tertiary)' }}>0</span>
                <span className="caption" style={{ color: 'var(--text-tertiary)' }}>
                  Safe: {p.safe}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
