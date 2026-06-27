import './globals.css';
import type { Metadata } from 'next';
import type { ReactNode } from 'react';

export const metadata: Metadata = {
  title: 'コーヒー・アミノ酸ビューア',
  description: 'コーヒー豆のアミノ酸と焙煎によるメイラード反応を簡易的に可視化します。',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ja">
      <body>{children}</body>
    </html>
  );
}
