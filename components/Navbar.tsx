'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Wind, Sun, Moon, Bell, Map, BarChart2, Upload, GitCompare, Search, X } from 'lucide-react';
import { CITIES } from '@/lib/mock-data';

interface NavbarProps {
  city: string;
  onCityChange: (city: string) => void;
}

const NAV_ITEMS = [
  { href: '/dashboard', icon: BarChart2, label: 'Dashboard' },
  { href: '/map', icon: Map, label: 'Map' },
  { href: '/compare', icon: GitCompare, label: 'Compare' },
  { href: '/upload', icon: Upload, label: 'Upload' },
];

export default function Navbar({ city, onCityChange }: NavbarProps) {
  const pathname = usePathname();
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
      className="sticky top-0 z-50"
      style={{
        background: 'color-mix(in srgb, var(--bg-secondary) 85%, transparent)',
        borderBottom: '1px solid var(--border-subtle)',
        backdropFilter: 'blur(16px) saturate(1.2)',
        WebkitBackdropFilter: 'blur(16px) saturate(1.2)',
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center h-14 gap-3">
        {/* Logo */}
        <Link href="/dashboard" className="flex items-center gap-2.5 shrink-0 group">
          <div className="relative">
            <Wind
              className="w-6 h-6 transition-colors duration-200"
              style={{ color: 'var(--accent)' }}
            />
            <span
              className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 rounded-full animate-pulse"
              style={{ background: 'var(--green)' }}
            />
          </div>
          <span
            className="font-bold text-lg hidden sm:block gradient-text"
            style={{ letterSpacing: '-0.02em' }}
          >
            AirWatch
          </span>
        </Link>

        {/* City Search */}
        <div className="relative flex-1 max-w-[200px]">
          <div
            className="flex items-center gap-2 rounded-lg px-3 py-1.5 cursor-text transition-all duration-150"
            style={{
              background: 'var(--bg-surface)',
              border: '1px solid var(--border-subtle)',
            }}
          >
            <Search
              className="w-3.5 h-3.5 shrink-0"
              style={{ color: 'var(--text-tertiary)' }}
            />
            <input
              type="text"
              placeholder={city}
              value={search}
              onChange={e => {
                setSearch(e.target.value);
                setShowDropdown(true);
              }}
              onFocus={() => {
                setSearch('');
                setShowDropdown(true);
              }}
              onBlur={() => {
                setTimeout(() => setShowDropdown(false), 200);
              }}
              className="bg-transparent text-sm outline-none w-full placeholder:text-[var(--text-tertiary)]"
              style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-outfit)' }}
            />
            {search && (
              <button
                onClick={() => {
                  setSearch('');
                  setShowDropdown(false);
                }}
                className="shrink-0 transition-opacity hover:opacity-70"
              >
                <X
                  className="w-3 h-3"
                  style={{ color: 'var(--text-tertiary)' }}
                />
              </button>
            )}
          </div>
          {showDropdown && filtered.length > 0 && (
            <div
              className="absolute top-full mt-1 w-full rounded-lg overflow-hidden"
              style={{
                background: 'var(--bg-card)',
                border: '1px solid var(--border)',
                boxShadow: 'var(--shadow-lg)',
              }}
            >
              {filtered.map(c => (
                <button
                  key={c.city}
                  onClick={() => {
                    onCityChange(c.city);
                    setSearch('');
                    setShowDropdown(false);
                  }}
                  className="w-full text-left px-3 py-2 text-sm flex items-center justify-between transition-colors duration-150"
                  style={{
                    color: 'var(--text-primary)',
                  }}
                  onMouseEnter={e => {
                    (e.currentTarget as HTMLElement).style.background = 'var(--bg-card-hover)';
                  }}
                  onMouseLeave={e => {
                    (e.currentTarget as HTMLElement).style.background = 'transparent';
                  }}
                >
                  <span>{c.city}</span>
                  <span
                    className="text-xs data-text"
                    style={{ color: 'var(--text-tertiary)' }}
                  >
                    {c.aqi}
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Nav links */}
        <nav className="hidden md:flex items-center gap-0.5 ml-auto">
          {NAV_ITEMS.map(({ href, icon: Icon, label }) => {
            const isActive = pathname === href || pathname?.startsWith(href + '/');
            return (
              <Link
                key={href}
                href={href}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-150"
                style={{
                  color: isActive ? 'var(--accent)' : 'var(--text-secondary)',
                  background: isActive ? 'var(--accent-muted)' : 'transparent',
                }}
                onMouseEnter={e => {
                  if (!isActive) {
                    (e.currentTarget as HTMLElement).style.background = 'var(--bg-card)';
                    (e.currentTarget as HTMLElement).style.color = 'var(--text-primary)';
                  }
                }}
                onMouseLeave={e => {
                  if (!isActive) {
                    (e.currentTarget as HTMLElement).style.background = 'transparent';
                    (e.currentTarget as HTMLElement).style.color = 'var(--text-secondary)';
                  }
                }}
              >
                <Icon className="w-4 h-4" />
                {label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-1 ml-2">
          <button
            className="relative p-2 rounded-lg transition-all duration-150"
            style={{ color: 'var(--text-secondary)' }}
            title="Alerts"
            onMouseEnter={e => {
              (e.currentTarget as HTMLElement).style.background = 'var(--bg-card)';
              (e.currentTarget as HTMLElement).style.color = 'var(--text-primary)';
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLElement).style.background = 'transparent';
              (e.currentTarget as HTMLElement).style.color = 'var(--text-secondary)';
            }}
          >
            <Bell className="w-4.5 h-4.5" />
            <span
              className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full"
              style={{ background: 'var(--red)' }}
            />
          </button>
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg transition-all duration-150"
            style={{ color: 'var(--text-secondary)' }}
            title="Toggle theme"
            onMouseEnter={e => {
              (e.currentTarget as HTMLElement).style.background = 'var(--bg-card)';
              (e.currentTarget as HTMLElement).style.color = 'var(--text-primary)';
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLElement).style.background = 'transparent';
              (e.currentTarget as HTMLElement).style.color = 'var(--text-secondary)';
            }}
          >
            {theme === 'dark' ? (
              <Sun className="w-4.5 h-4.5" />
            ) : (
              <Moon className="w-4.5 h-4.5" />
            )}
          </button>
        </div>
      </div>
    </header>
  );
}
