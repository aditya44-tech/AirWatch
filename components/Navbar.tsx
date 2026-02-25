'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { Wind, Sun, Moon, Bell, Map, BarChart2, Upload, GitCompare, Search, X } from 'lucide-react';
import { CITIES } from '@/lib/mock-data';

interface NavbarProps {
    city: string;
    onCityChange: (city: string) => void;
}

export default function Navbar({ city, onCityChange }: NavbarProps) {
    const [theme, setTheme] = useState<'dark' | 'light'>('dark');
    const [search, setSearch] = useState('');
    const [showDropdown, setShowDropdown] = useState(false);

    useEffect(() => {
        const saved = (localStorage.getItem('theme') as 'dark' | 'light') || 'dark';
        setTheme(saved);
    }, []);

    const toggleTheme = useCallback(() => {
        const next = theme === 'dark' ? 'light' : 'dark';
        setTheme(next);
        localStorage.setItem('theme', next);
        document.documentElement.setAttribute('data-theme', next);
    }, [theme]);

    const filtered = CITIES.filter(c =>
        c.city.toLowerCase().includes(search.toLowerCase())
    ).slice(0, 6);

    return (
        <header
            style={{
                background: 'var(--bg-secondary)',
                borderBottom: '1px solid var(--border)',
            }}
            className="sticky top-0 z-50 backdrop-blur-md"
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center h-16 gap-4">
                {/* Logo */}
                <Link href="/dashboard" className="flex items-center gap-2 shrink-0">
                    <div className="relative">
                        <Wind className="w-7 h-7 text-blue-400" />
                        <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
                    </div>
                    <span className="font-bold text-xl hidden sm:block gradient-text">AirWatch</span>
                </Link>

                {/* City Search */}
                <div className="relative flex-1 max-w-xs">
                    <div
                        style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}
                        className="flex items-center gap-2 rounded-xl px-3 py-2 cursor-text"
                    >
                        <Search className="w-4 h-4" style={{ color: 'var(--text-secondary)' }} />
                        <input
                            type="text"
                            placeholder="Search city..."
                            value={search || city}
                            onChange={e => { setSearch(e.target.value); setShowDropdown(true); }}
                            onFocus={() => { setSearch(''); setShowDropdown(true); }}
                            className="bg-transparent text-sm outline-none w-full"
                            style={{ color: 'var(--text-primary)' }}
                        />
                        {search && (
                            <button onClick={() => { setSearch(''); setShowDropdown(false); }}>
                                <X className="w-3 h-3" style={{ color: 'var(--text-secondary)' }} />
                            </button>
                        )}
                    </div>
                    {showDropdown && filtered.length > 0 && (
                        <div
                            style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}
                            className="absolute top-full mt-1 w-full rounded-xl overflow-hidden shadow-2xl z-50"
                        >
                            {filtered.map(c => (
                                <button
                                    key={c.city}
                                    onClick={() => {
                                        onCityChange(c.city);
                                        setSearch('');
                                        setShowDropdown(false);
                                    }}
                                    className="w-full text-left px-4 py-2.5 text-sm hover:bg-[var(--bg-card-hover)] flex items-center justify-between transition-colors"
                                    style={{ color: 'var(--text-primary)' }}
                                >
                                    <span>{c.city}</span>
                                    <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>AQI {c.aqi}</span>
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* Nav links */}
                <nav className="hidden md:flex items-center gap-1 ml-auto">
                    {[
                        { href: '/dashboard', icon: BarChart2, label: 'Dashboard' },
                        { href: '/map', icon: Map, label: 'Map' },
                        { href: '/compare', icon: GitCompare, label: 'Compare' },
                        { href: '/upload', icon: Upload, label: 'Upload' },
                    ].map(({ href, icon: Icon, label }) => (
                        <Link
                            key={href}
                            href={href}
                            className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all hover:bg-[var(--bg-card)]"
                            style={{ color: 'var(--text-secondary)' }}
                        >
                            <Icon className="w-4 h-4" />
                            {label}
                        </Link>
                    ))}
                </nav>

                <div className="flex items-center gap-2 ml-2">
                    <button
                        className="relative p-2 rounded-lg transition-all hover:bg-[var(--bg-card)]"
                        style={{ color: 'var(--text-secondary)' }}
                        title="Alerts"
                    >
                        <Bell className="w-5 h-5" />
                        <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
                    </button>
                    <button
                        onClick={toggleTheme}
                        className="p-2 rounded-lg transition-all hover:bg-[var(--bg-card)]"
                        style={{ color: 'var(--text-secondary)' }}
                        title="Toggle theme"
                    >
                        {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                    </button>
                </div>
            </div>
        </header>
    );
}
