'use client';

import { useState, useRef } from 'react';
import Navbar from '@/components/Navbar';
import { Upload, FileText, CheckCircle, Loader2 } from 'lucide-react';

interface UploadResult {
  fileName: string;
  rowCount: number;
  columns: string[];
  preview: Record<string, string>[];
  insights: string[];
  source: string;
}

export default function UploadPage() {
  const [dragging, setDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [result, setResult] = useState<UploadResult | null>(null);
  const [error, setError] = useState('');
  const fileRef = useRef<HTMLInputElement>(null);

  const handleFile = async (file: File) => {
    if (!file.name.endsWith('.csv')) {
      setError('Please upload a CSV file.');
      return;
    }
    setError('');
    setUploading(true);
    try {
      const form = new FormData();
      form.append('file', file);
      const res = await fetch('/api/upload', { method: 'POST', body: form });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setResult(data);
    } catch (e) {
      setError(String(e));
    } finally {
      setUploading(false);
    }
  };

  return (
    <div style={{ background: 'var(--bg-primary)', minHeight: '100dvh' }}>
      <Navbar city="Delhi" onCityChange={() => { }} />
      <main
        className="max-w-4xl mx-auto px-4 sm:px-6 pt-8 pb-12"
        style={{ position: 'relative', zIndex: 1 }}
      >
        <div className="flex items-center gap-3 mb-8">
          <div
            className="w-10 h-10 rounded-lg flex items-center justify-center"
            style={{ background: 'var(--accent-muted)' }}
          >
            <Upload className="w-5 h-5" style={{ color: 'var(--accent)' }} />
          </div>
          <div>
            <h1 className="display-lg gradient-text">Upload pollution data</h1>
            <p className="body-sm" style={{ color: 'var(--text-secondary)' }}>
              Upload your CSV dataset for AI-powered analysis
            </p>
          </div>
        </div>

        {/* Drop zone */}
        {!result && (
          <div
            className="card mb-5 cursor-pointer transition-all duration-200"
            style={{
              border: `2px dashed ${dragging ? 'var(--accent)' : 'var(--border)'}`,
              background: dragging ? 'var(--accent-muted)' : 'var(--bg-card)',
              minHeight: 240,
            }}
            onDragOver={e => { e.preventDefault(); setDragging(true); }}
            onDragLeave={() => setDragging(false)}
            onDrop={e => { e.preventDefault(); setDragging(false); const f = e.dataTransfer.files[0]; if (f) handleFile(f); }}
            onClick={() => fileRef.current?.click()}
          >
            <input ref={fileRef} type="file" accept=".csv" className="hidden" onChange={e => { if (e.target.files?.[0]) handleFile(e.target.files[0]); }} />
            <div className="flex flex-col items-center justify-center h-full py-12 gap-4">
              {uploading ? (
                <>
                  <Loader2 className="w-10 h-10 animate-spin" style={{ color: 'var(--accent)' }} />
                  <p className="body-sm" style={{ color: 'var(--text-secondary)' }}>
                    Analyzing with AI…
                  </p>
                </>
              ) : (
                <>
                  <div
                    className="w-14 h-14 rounded-xl flex items-center justify-center"
                    style={{ background: 'var(--accent-muted)' }}
                  >
                    <Upload className="w-7 h-7" style={{ color: 'var(--accent)' }} />
                  </div>
                  <div className="text-center">
                    <p className="font-semibold text-lg" style={{ color: 'var(--text-primary)' }}>
                      {dragging ? 'Drop your CSV here' : 'Drag & drop your CSV file'}
                    </p>
                    <p className="body-sm mt-1" style={{ color: 'var(--text-secondary)' }}>
                      or click to browse, expects columns like city, aqi, pm25, pm10, etc.
                    </p>
                  </div>
                </>
              )}
              {error && (
                <p className="text-sm" style={{ color: 'var(--red)' }}>{error}</p>
              )}
            </div>
          </div>
        )}

        {/* Results */}
        {result && (
          <div className="fade-in flex flex-col gap-5">
            {/* File summary */}
            <div className="card flex items-center gap-4">
              <div
                className="w-11 h-11 rounded-lg flex items-center justify-center shrink-0"
                style={{ background: 'rgba(63, 168, 122, 0.1)' }}
              >
                <CheckCircle className="w-5 h-5" style={{ color: 'var(--green)' }} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold truncate" style={{ color: 'var(--text-primary)' }}>
                  {result.fileName}
                </p>
                <p className="body-sm" style={{ color: 'var(--text-secondary)' }}>
                  {result.rowCount} rows · {result.columns.length} columns
                </p>
              </div>
              <button
                className="btn btn-ghost shrink-0"
                onClick={() => setResult(null)}
              >
                Upload another
              </button>
            </div>

            {/* Insights */}
            <div className="card">
              <div className="flex items-center justify-between mb-5">
                <h3 className="heading-md" style={{ color: 'var(--text-primary)' }}>
                  AI-generated insights
                </h3>
                <span
                  className="flex items-center gap-1.5 px-2 py-1 text-xs font-medium"
                  style={{
                    background: result.source === 'ai' ? 'var(--accent-muted)' : 'rgba(100,116,139,0.1)',
                    color: result.source === 'ai' ? 'var(--accent)' : 'var(--text-tertiary)',
                    borderRadius: 'var(--radius-sm)',
                  }}
                >
                  {result.source === 'ai' ? 'Gemini AI' : 'Simulated'}
                </span>
              </div>
              <div className="flex flex-col gap-2.5">
                {result.insights.map((ins, i) => (
                  <div
                    key={i}
                    className="flex items-start gap-3 p-3 rounded-lg"
                    style={{
                      background: 'var(--bg-surface)',
                      border: '1px solid var(--border-subtle)',
                    }}
                  >
                    <span
                      className="w-6 h-6 rounded-md flex items-center justify-center data-text text-xs font-bold shrink-0"
                      style={{
                        background: 'var(--accent-muted)',
                        color: 'var(--accent)',
                      }}
                    >
                      {i + 1}
                    </span>
                    <p className="text-sm" style={{ color: 'var(--text-primary)', textWrap: 'pretty' }}>
                      {ins}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Data preview */}
            <div className="card overflow-x-auto">
              <h3 className="heading-md mb-5" style={{ color: 'var(--text-primary)' }}>
                <FileText className="w-4 h-4 inline mr-2" style={{ color: 'var(--accent)' }} />
                Data preview (first 5 rows)
              </h3>
              <table className="w-full text-xs">
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                    {result.columns.map(h => (
                      <th
                        key={h}
                        className="text-left py-2 px-2 caption font-semibold"
                        style={{ color: 'var(--text-tertiary)' }}
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {result.preview.map((row, i) => (
                    <tr key={i} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                      {result.columns.map(col => (
                        <td
                          key={col}
                          className="py-2 px-2 data-text"
                          style={{ color: 'var(--text-primary)' }}
                        >
                          {row[col] ?? '—'}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
