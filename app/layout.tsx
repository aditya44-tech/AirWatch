import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

export const metadata: Metadata = {
  title: 'AirWatch — AI Pollution Dashboard',
  description: 'Real-time AI-powered air quality monitoring, predictions, and health advisories for Indian cities.',
  keywords: ['AQI', 'air quality', 'pollution', 'AI', 'health', 'dashboard'],
  openGraph: {
    title: 'AirWatch — AI Pollution Dashboard',
    description: 'Monitor air quality with AI-powered insights',
    type: 'website',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" data-theme="dark" suppressHydrationWarning>
      <body className={`${inter.variable} antialiased`} suppressHydrationWarning>
        <ThemeScript />
        {children}
      </body>
    </html>
  );
}

function ThemeScript() {
  return (
    <script
      dangerouslySetInnerHTML={{
        __html: `
          (function() {
            try {
              const theme = localStorage.getItem('theme') || 'dark';
              document.documentElement.setAttribute('data-theme', theme);
            } catch(e) {}
          })();
        `,
      }}
    />
  );
}
