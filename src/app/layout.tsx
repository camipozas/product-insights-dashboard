import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Product Insights Dashboard',
  description: 'View product data and business insights',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
