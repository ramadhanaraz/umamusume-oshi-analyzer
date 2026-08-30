// app/layout.tsx
import type { Metadata, Viewport } from 'next';
import './globals.css';

export const viewport: Viewport = {
  themeColor: '#070b16',
  colorScheme: 'dark',
  width: 'device-width',
  initialScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL('https://uma-oshi-analyzer.vercel.app'),
  title: {
    default: 'Umamusume Top 50 Oshi Strategy Analyzer',
    template: '%s | Umamusume Oshi Analyzer',
  },
  description:
    'Rank your top 50 favorite Umamusume trainees with an interactive 3-phase matchmaker tournament, discover your running style archetype, and export custom HD summary cards.',
  applicationName: 'Umamusume Top 50 Oshi Strategy Analyzer',
  keywords: [
    'Umamusume',
    'Uma Musume',
    'Pretty Derby',
    'Oshi Sorter',
    'Top 50 Oshis',
    'Umander',
    'Strategy Analyzer',
    'Agnes Digital',
    'Running Style',
    'GameTora',
  ],
  authors: [{ name: 'Uma Oshi Community' }],
  creator: 'Umamusume Fan Project',
  publisher: 'Umamusume Top 50 Oshi Strategy Analyzer',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://uma-oshi-analyzer.vercel.app/',
    siteName: 'Umamusume Top 50 Oshi Strategy Analyzer',
    title: 'Umamusume Top 50 Oshi Strategy Analyzer',
    description:
      'Match and rank your ultimate 50 Oshis with Agnes Digital! Analyze your running style distribution and export high-res profile cards.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Umamusume Top 50 Oshi Strategy Analyzer Preview Banner',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Umamusume Top 50 Oshi Strategy Analyzer',
    description:
      'Match and rank your ultimate 50 Oshis with Agnes Digital! Analyze your running style distribution and export high-res profile cards.',
    images: ['/og-image.png'],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="bg-[#070b16] text-slate-100 antialiased selection:bg-pink-500 selection:text-white min-h-screen">
        {children}
      </body>
    </html>
  );
}