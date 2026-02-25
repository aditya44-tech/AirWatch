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
        <div style={{ background: 'var(--bg-primary)', minHeight: '100vh' }}>
            <Navbar city="Delhi" onCityChange={() => { }} />
            <main className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
                <div className="flex items-center gap-3 mb-6">
                    <Upload className="w-6 h-6 text-blue-400" />
                    <div>
                        <h1 className="text-2xl font-black gradient-text">Upload Pollution Data</h1>
                        <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                            Upload your CSV dataset for AI-powered analysis
                        </p>
                    </div>
                </div>

                {/* Drop zone */}
                {!result && (
                    <div
                        className="card mb-4 cursor-pointer transition-all"
                        style={{
                            border: dragging ? '2px dashed #3b82f6' : '2px dashed var(--border)',
                            background: dragging ? 'rgba(59,130,246,0.05)' : 'var(--bg-card)',
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
                                    <Loader2 className="w-12 h-12 text-blue-400 animate-spin" />
                                    <p style={{ color: 'var(--text-secondary)' }}>Analyzing with AI…</p>
                                </>
                            ) : (
                                <>
                                    <div className="w-16 h-16 rounded-2xl flex items-center justify-center" style={{ background: 'rgba(59,130,246,0.1)' }}>
                                        <Upload className="w-8 h-8 text-blue-400" />
                                    </div>
                                    <div className="text-center">
                                        <p className="font-semibold text-lg" style={{ color: 'var(--text-primary)' }}>
                                            {dragging ? 'Drop your CSV here' : 'Drag & drop your CSV file'}
                                        </p>
                                        <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>
                                            or click to browse — expects columns like city, aqi, pm25, pm10, etc.
                                        </p>
                                    </div>
                                </>
                            )}
                            {error && <p className="text-sm text-red-400">{error}</p>}
                        </div>
                    </div>
                )}

                {/* Results */}
                {result && (
                    <div className="fade-in flex flex-col gap-4">
                        {/* File summary */}
                        <div className="card flex items-center gap-4">
                            <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: 'rgba(34,197,94,0.1)' }}>
                                <CheckCircle className="w-6 h-6 text-green-400" />
                            </div>
                            <div>
                                <p className="font-semibold" style={{ color: 'var(--text-primary)' }}>{result.fileName}</p>
                                <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                                    {result.rowCount} rows · {result.columns.length} columns
                                </p>
                            </div>
                            <button
                                className="ml-auto text-sm px-4 py-2 rounded-xl"
                                style={{ background: 'var(--bg-primary)', border: '1px solid var(--border)', color: 'var(--text-secondary)' }}
                                onClick={() => setResult(null)}
                            >
                                Upload another
                            </button>
                        </div>

                        {/* Insights */}
                        <div className="card">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="font-semibold text-base" style={{ color: 'var(--text-primary)' }}>AI-Generated Insights</h3>
                                <span
                                    className="px-2.5 py-1 rounded-full text-xs font-medium"
                                    style={{ background: result.source === 'ai' ? 'rgba(139,92,246,0.15)' : 'rgba(100,116,139,0.15)', color: result.source === 'ai' ? '#a78bfa' : 'var(--text-secondary)' }}
                                >
                                    {result.source === 'ai' ? '✨ Gemini AI' : 'Simulated'}
                                </span>
                            </div>
                            <div className="flex flex-col gap-3">
                                {result.insights.map((ins, i) => (
                                    <div key={i} className="flex items-start gap-3 p-3 rounded-xl" style={{ background: 'var(--bg-primary)', border: '1px solid var(--border)' }}>
                                        <span className="w-6 h-6 rounded-lg flex items-center justify-center text-xs font-bold shrink-0" style={{ background: 'rgba(139,92,246,0.15)', color: '#a78bfa' }}>{i + 1}</span>
                                        <p className="text-sm" style={{ color: 'var(--text-primary)' }}>{ins}</p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Data preview */}
                        <div className="card overflow-x-auto">
                            <h3 className="font-semibold text-base mb-4" style={{ color: 'var(--text-primary)' }}>
                                <FileText className="w-4 h-4 inline mr-2 text-blue-400" />
                                Data Preview (first 5 rows)
                            </h3>
                            <table className="w-full text-xs">
                                <thead>
                                    <tr style={{ borderBottom: '1px solid var(--border)' }}>
                                        {result.columns.map(h => (
                                            <th key={h} className="text-left py-2 px-2 font-medium" style={{ color: 'var(--text-secondary)' }}>{h}</th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {result.preview.map((row, i) => (
                                        <tr key={i} style={{ borderBottom: '1px solid var(--border)' }}>
                                            {result.columns.map(col => (
                                                <td key={col} className="py-2 px-2" style={{ color: 'var(--text-primary)' }}>{row[col] ?? '—'}</td>
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
