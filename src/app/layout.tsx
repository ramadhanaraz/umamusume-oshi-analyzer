import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Umamusume Top 50 Oshi Strategy Analyzer',
  description: 'Analyze your top 50 Uma Musume oshis and calculate running styles and aptitudes.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="bg-slate-950 text-slate-100 antialiased">{children}</body>
    </html>
  );
}